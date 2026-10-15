"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import type { FaceDetector } from "@mediapipe/tasks-vision";
import { Button } from "@/src/components/ui/button";
import { Modal } from "@/src/components/shared/modal";
import { PHOTO_STUDIO_CONFIG } from "@/src/lib/photo-studio/config";
import {
  buildLayerStack,
  calculateTemplateOffset,
  calculateTemplateScale,
  computeMaskCoverage,
  shouldRejectMask,
} from "@/src/lib/photo-studio/compose";

type PhotoStudioProps = {
  open: boolean;
  onClose: () => void;
  onDone: (file: File) => Promise<boolean>;
};

type FaceBounds = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

const ACCEPTANCE_TEXT =
  "عکس را با دوربین بگیرید. تصویر روی دستگاه شما در قالب یکسان و با نشان هلپا24 روی پس‌زمینه آماده می‌شود؛ فقط نسخه‌ی نهایی آپلود خواهد شد.";

export function PhotoStudio({ open, onClose, onDone }: PhotoStudioProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<FaceDetector | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastDetectionAtRef = useRef(0);
  const faceBoundsRef = useRef<FaceBounds | null>(null);
  const finalFileRef = useRef<File | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState("در حال آماده‌سازی دوربین…");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [captureReady, setCaptureReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [mode, setMode] = useState<"camera" | "preview">("camera");
  const [isLocalProcessingReady, setIsLocalProcessingReady] = useState(false);
  const [cameraAttempt, setCameraAttempt] = useState(0);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  };

  const resetStudio = () => {
    stopStream();
    detectorRef.current?.close();
    detectorRef.current = null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    finalFileRef.current = null;
    faceBoundsRef.current = null;
    setConsentAccepted(false);
    setMode("camera");
    setPreviewUrl(null);
    setStatus("در حال آماده‌سازی دوربین…");
    setErrorText(null);
    setCaptureReady(false);
    setIsProcessing(false);
    setIsCapturing(false);
    setIsLocalProcessingReady(false);
  };

  const handleModalClose = () => {
    resetStudio();
    onClose();
  };

  useEffect(() => {
    return () => {
      stopStream();
      detectorRef.current?.close();
      detectorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    if (!consentAccepted) return;

    let cancelled = false;
    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorText(
          window.isSecureContext
            ? "دوربین در این مرورگر در دسترس نیست؛ اجازه‌ی دوربین را بررسی کنید یا مرورگر دیگری را امتحان کنید."
            : "برای استفاده از دوربین، صفحه را با اتصال امن HTTPS باز کنید.",
        );
        setStatus("دوربین در دسترس نیست");
        return;
      }

      try {
        setStatus("در حال درخواست مجوز دوربین…");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 1600 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatus("آماده‌سازی ابزار تشخیص چهره…");
        const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const fileset = await FilesetResolver.forVisionTasks("/mediapipe", true);
        const detector = await FaceDetector.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/blaze_face_short_range.tflite",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.65,
        });
        if (cancelled) {
          detector.close();
          return;
        }
        detectorRef.current = detector;
        setIsLocalProcessingReady(true);
        setStatus("چهره را داخل بیضی قرار دهید");
        setErrorText(null);
      } catch (error) {
        stopStream();
        setIsLocalProcessingReady(false);
        setCaptureReady(false);
        const message =
          error instanceof DOMException && error.name === "NotAllowedError"
            ? "اجازه‌ی دوربین داده نشد؛ دسترسی دوربین را در مرورگر فعال کنید."
            : error instanceof DOMException &&
                ["NotFoundError", "DevicesNotFoundError"].includes(error.name)
              ? "دوربین جلویی پیدا نشد؛ دوربین دستگاه را بررسی کنید."
              : "آماده‌سازی دوربین یا مدل محلی انجام نشد؛ دوباره تلاش کنید.";
        setErrorText(
          message,
        );
        setStatus("آماده‌سازی دوربین انجام نشد");
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      stopStream();
      detectorRef.current?.close();
      detectorRef.current = null;
    };
  }, [cameraAttempt, consentAccepted, open]);

  useEffect(() => {
    if (!open || !consentAccepted || mode !== "camera" || !isLocalProcessingReady) return;

    const tick = async () => {
      const video = videoRef.current;
      const detector = detectorRef.current;
      if (!video || video.readyState < 2 || !detector) {
        requestRef.current = requestAnimationFrame(tick);
        return;
      }

      if (performance.now() - lastDetectionAtRef.current < 180) {
        requestRef.current = requestAnimationFrame(tick);
        return;
      }
      lastDetectionAtRef.current = performance.now();

      try {
        const result = detector.detectForVideo(video, performance.now());
        const detections = result.detections ?? [];
        const face = detections[0];

        if (detections.length !== 1 || !face) {
          faceBoundsRef.current = null;
          setStatus(detections.length > 1 ? "فقط یک نفر در قاب باشد" : "چهره‌ای پیدا نشد");
          setCaptureReady(false);
          requestRef.current = requestAnimationFrame(tick);
          return;
        }

        const box = face.boundingBox;
        if (!box) {
          faceBoundsRef.current = null;
          setStatus("چهره را واضح‌تر روبه‌روی دوربین بگیرید");
          setCaptureReady(false);
          requestRef.current = requestAnimationFrame(tick);
          return;
        }

        const centerX = (box.originX + box.width / 2) / video.videoWidth;
        const centerY = (box.originY + box.height / 2) / video.videoHeight;
        const faceRatio = box.width / video.videoWidth;
        faceBoundsRef.current = {
          originX: box.originX,
          originY: box.originY,
          width: box.width,
          height: box.height,
        };

        if (faceRatio < PHOTO_STUDIO_CONFIG.LIMITS.minFaceRatio) {
          setStatus("کمی نزدیک‌تر بایستید");
          setCaptureReady(false);
        } else if (faceRatio > PHOTO_STUDIO_CONFIG.LIMITS.maxFaceRatio) {
          setStatus("کمی از دوربین فاصله بگیرید");
          setCaptureReady(false);
        } else if (Math.abs(centerX - 0.5) > 0.18 || Math.abs(centerY - 0.45) > 0.15) {
          setStatus("چهره را وسط بیضی بگذارید");
          setCaptureReady(false);
        } else {
          setStatus("حالت گرفتن عکس فعال شد");
          setCaptureReady(true);
        }
      } catch {
        setStatus("بررسی تصویر انجام نشد؛ لطفاً دوباره تلاش کنید");
        setCaptureReady(false);
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [consentAccepted, isLocalProcessingReady, mode, open]);

  const resetToCamera = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    finalFileRef.current = null;
    faceBoundsRef.current = null;
    setMode("camera");
    setPreviewUrl(null);
    setIsProcessing(false);
    setCaptureReady(false);
    setErrorText(null);
  };

  const retryCamera = () => {
    stopStream();
    detectorRef.current?.close();
    detectorRef.current = null;
    setIsLocalProcessingReady(false);
    setCaptureReady(false);
    faceBoundsRef.current = null;
    setErrorText(null);
    setStatus("در حال آماده‌سازی دوربین…");
    setCameraAttempt((attempt) => attempt + 1);
  };

  const handleCapture = async () => {
    const faceBounds = faceBoundsRef.current;
    if (!videoRef.current || !captureReady || !faceBounds) return;

    setIsCapturing(true);
    setIsProcessing(true);
    setStatus("در حال آماده‌سازی عکس…");

    try {
      const video = videoRef.current;
      const width = PHOTO_STUDIO_CONFIG.OUTPUT.width;
      const height = PHOTO_STUDIO_CONFIG.OUTPUT.height;
      if (
        Math.min(video.videoWidth, video.videoHeight) <
        PHOTO_STUDIO_CONFIG.LIMITS.minResolution
      ) {
        throw new Error("Camera resolution is too low.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas unavailable");
      }

      context.fillStyle = PHOTO_STUDIO_CONFIG.OUTPUT.background;
      context.fillRect(0, 0, width, height);
      const scale = calculateTemplateScale(
        faceBounds.width,
        faceBounds.height,
        width,
        height,
      );
      const faceOffset = calculateTemplateOffset(
        width,
        height,
        faceBounds.width,
        faceBounds.height,
        scale,
      );
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.save();
      context.translate(
        faceOffset.x - faceBounds.originX * scale,
        faceOffset.y - faceBounds.originY * scale,
      );
      context.scale(scale, scale);
      context.drawImage(
        video,
        0,
        0,
        video.videoWidth,
        video.videoHeight,
      );
      context.restore();

      const { FilesetResolver, ImageSegmenter } = await import("@mediapipe/tasks-vision");
      const fileset = await FilesetResolver.forVisionTasks("/mediapipe", true);
      const segmenter = await ImageSegmenter.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: "/mediapipe/selfie_segmenter.tflite",
        },
        runningMode: "IMAGE",
        outputConfidenceMasks: true,
        outputCategoryMask: true,
      });
      const result = segmenter.segment(canvas);
      const labels = segmenter.getLabels();
      const personIndex = labels.findIndex((label) =>
        /person|human|foreground/i.test(label),
      );
      const confidenceIndex = personIndex >= 0 ? personIndex : 0;
      const confidenceMask = result.confidenceMasks?.[confidenceIndex];
      const categoryMask = result.categoryMask;
      const maskWidth = confidenceMask?.width ?? categoryMask?.width ?? 0;
      const maskHeight = confidenceMask?.height ?? categoryMask?.height ?? 0;
      const confidenceValues = confidenceMask?.getAsFloat32Array();
      const categoryValues = categoryMask?.getAsUint8Array();
      if (!maskWidth || !maskHeight || (!confidenceValues && !categoryValues)) {
        result.close();
        segmenter.close();
        throw new Error("Segmentation model did not return a usable mask.");
      }

      const mask = new Uint8ClampedArray(width * height * 4);
      for (let y = 0; y < height; y += 1) {
        const sourceY = Math.min(maskHeight - 1, Math.floor((y / height) * maskHeight));
        for (let x = 0; x < width; x += 1) {
          const sourceX = Math.min(maskWidth - 1, Math.floor((x / width) * maskWidth));
          const sourceIndex = sourceY * maskWidth + sourceX;
          let alpha = 0;
          if (confidenceValues) {
            let confidence = confidenceValues[sourceIndex] ?? 0;
            if (confidence > 1) confidence /= 255;
            alpha = Math.min(1, Math.max(0, (confidence - 0.25) / 0.5));
          } else if (categoryValues) {
            const category = categoryValues[sourceIndex] ?? 0;
            alpha = personIndex >= 0 ? Number(category === personIndex) : Number(category > 0);
          }
          const index = (y * width + x) * 4;
          mask[index] = Math.round(alpha * 255);
          mask[index + 1] = mask[index];
          mask[index + 2] = mask[index];
          mask[index + 3] = 255;
        }
      }
      result.close();
      segmenter.close();

      const coverage = computeMaskCoverage(mask, width, height);
      if (shouldRejectMask(coverage, width, height)) {
        throw new Error("Foreground mask failed quality checks.");
      }

      const source = context.getImageData(0, 0, width, height).data;
      const backgroundCanvas = document.createElement("canvas");
      backgroundCanvas.width = width;
      backgroundCanvas.height = height;
      const backgroundContext = backgroundCanvas.getContext("2d");

      if (!backgroundContext) {
        throw new Error("Watermark canvas unavailable.");
      }

      backgroundContext.fillStyle = PHOTO_STUDIO_CONFIG.OUTPUT.background;
      backgroundContext.fillRect(0, 0, width, height);
      backgroundContext.save();
      backgroundContext.globalAlpha = PHOTO_STUDIO_CONFIG.WATERMARK.opacity;
      backgroundContext.fillStyle = PHOTO_STUDIO_CONFIG.WATERMARK.color;
      backgroundContext.font = `700 ${PHOTO_STUDIO_CONFIG.WATERMARK.fontSize}px sans-serif`;
      backgroundContext.textAlign = "center";
      backgroundContext.textBaseline = "middle";
      for (
        let y = -PHOTO_STUDIO_CONFIG.WATERMARK.verticalSpacing;
        y < height + PHOTO_STUDIO_CONFIG.WATERMARK.verticalSpacing;
        y += PHOTO_STUDIO_CONFIG.WATERMARK.verticalSpacing
      ) {
        for (
          let x = -PHOTO_STUDIO_CONFIG.WATERMARK.horizontalSpacing;
          x < width + PHOTO_STUDIO_CONFIG.WATERMARK.horizontalSpacing;
          x += PHOTO_STUDIO_CONFIG.WATERMARK.horizontalSpacing
        ) {
          backgroundContext.save();
          backgroundContext.translate(x, y);
          backgroundContext.rotate(PHOTO_STUDIO_CONFIG.WATERMARK.rotation);
          backgroundContext.fillText(PHOTO_STUDIO_CONFIG.WATERMARK.text, 0, 0);
          backgroundContext.restore();
        }
      }
      backgroundContext.restore();
      const backgroundPixels = backgroundContext.getImageData(
        0,
        0,
        width,
        height,
      ).data;

      const layered = buildLayerStack({
        imageWidth: width,
        imageHeight: height,
        source,
        mask,
        backgroundPixels,
      });

      const output = new ImageData(
        new Uint8ClampedArray(layered.output),
        width,
        height,
      );
      context.putImageData(output, 0, 0);

      let quality = PHOTO_STUDIO_CONFIG.OUTPUT.quality;
      let blob: Blob | null = null;
      while (quality >= 0.65) {
        blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(
            resolve,
            PHOTO_STUDIO_CONFIG.OUTPUT.format,
            quality,
          ),
        );
        if (blob && blob.size <= PHOTO_STUDIO_CONFIG.OUTPUT.maxBytes) break;
        quality = Math.round((quality - 0.05) * 100) / 100;
      }
      if (!blob || blob.size > PHOTO_STUDIO_CONFIG.OUTPUT.maxBytes) {
        throw new Error("Output image exceeds the allowed size.");
      }

      const file = new File([blob], "profile-photo.jpg", { type: blob.type });
      finalFileRef.current = file;
      const previewObjectUrl = URL.createObjectURL(blob);
      setPreviewUrl((currentUrl) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        return previewObjectUrl;
      });
      setMode("preview");
      setStatus("عکس آماده است؛ تأیید یا دوباره گرفتن");
    } catch (error) {
      setErrorText(
        error instanceof Error &&
          error.message === "Camera resolution is too low."
          ? "وضوح دوربین برای ساخت عکس مناسب نیست؛ از دوربین اصلی یا دستگاه دیگری استفاده کنید."
          : "ساخت عکس مناسب انجام نشد. نور و فاصله را بهتر کنید و دوباره بگیرید.",
      );
      setStatus("خطا در آماده‌سازی عکس");
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      title="استودیو عکس پروفایل"
      size="lg"
      fullScreenOnMobile
    >
      {!consentAccepted ? (
        <div className="space-y-5">
          <div className="rounded-xl bg-foreground/5 p-4 text-sm leading-7 text-foreground/75">
            {ACCEPTANCE_TEXT}
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-foreground/10 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/70">
              با ادامه، اجازه‌ی استفاده از دوربین را می‌دهید.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setConsentAccepted(true)}
              className="min-h-11 w-full sm:w-auto"
            >
              <Camera size={16} />
              شروع عکاسی
            </Button>
          </div>
        </div>
      ) : mode === "camera" ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-black sm:rounded-[2rem]">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="h-[min(52dvh,26rem)] min-h-[220px] w-full scale-x-[-1] object-cover"
              aria-label="پیش‌نمایش زنده دوربین"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[72%] w-[68%] rounded-[50%] border-[3px] border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.42)]" />
              <div className="absolute left-1/2 top-[55%] h-[24%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
            </div>
            <div
              className="absolute inset-x-0 bottom-0 bg-black/30 px-4 py-3 text-center text-sm text-white backdrop-blur-sm"
              aria-live="polite"
            >
              {status}
            </div>
          </div>

          {errorText && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {errorText}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              className="min-h-11 flex-1"
              onClick={handleCapture}
              disabled={!captureReady || isCapturing || isProcessing}
            >
              {isCapturing ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
              {isCapturing ? "در حال گرفتن عکس…" : "گرفتن عکس"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={retryCamera}
              className="min-h-11 gap-2"
              disabled={isCapturing || isProcessing || isUploading}
            >
              <RefreshCw size={16} />
              راه‌اندازی دوباره
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-foreground/10 bg-white p-2 sm:p-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="پیش‌نمایش عکس نهایی"
                className="mx-auto aspect-[4/5] max-h-[48dvh] w-auto max-w-full rounded-xl object-contain"
              />
            ) : (
              <div               className="flex aspect-[4/5] max-h-[48dvh] items-center justify-center rounded-xl bg-foreground/5 text-sm text-foreground/60">
                تصویر آماده نیست
              </div>
            )}
          </div>

          {errorText && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {errorText}
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              className="min-h-11 flex-1"
              onClick={async () => {
                if (!finalFileRef.current) return;
                setIsUploading(true);
                setErrorText(null);
                try {
                  const uploaded = await onDone(finalFileRef.current);
                  if (uploaded) handleModalClose();
                  else setErrorText("آپلود عکس انجام نشد؛ اتصال را بررسی کنید و دوباره تلاش کنید.");
                } catch (error) {
                  setErrorText(
                    error instanceof Error && error.message.trim()
                      ? error.message
                      : "آپلود عکس انجام نشد؛ اتصال را بررسی کنید و دوباره تلاش کنید.",
                  );
                } finally {
                  setIsUploading(false);
                }
              }}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
              {isUploading ? "در حال آپلود…" : "تأیید و آپلود"}
            </Button>
            <Button type="button" variant="outline" onClick={resetToCamera} className="min-h-11 gap-2" disabled={isUploading}>
              <Sparkles size={16} />
              گرفتن دوباره
            </Button>
            <Button type="button" variant="ghost" onClick={handleModalClose} className="min-h-11 gap-2" disabled={isUploading}>
              <X size={16} />
              بستن
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
