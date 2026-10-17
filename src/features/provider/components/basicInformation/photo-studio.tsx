"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Modal } from "@/src/components/shared/modal";
import { PHOTO_STUDIO_CONFIG } from "@/src/lib/photo-studio/config";
import {
  computeMaskCoverage,
  shouldRejectMask,
  buildLayerStack,
} from "@/src/lib/photo-studio/compose";

type PhotoStudioProps = {
  open: boolean;
  onClose: () => void;
  onDone: (file: File) => Promise<boolean>;
};

const ACCEPTANCE_TEXT =
  "عکس را با دوربین بگیرید و چهره را داخل راهنمای قاب قرار دهید. عکس در قالب یکسان و با نشان هلپا۲۴ آماده می‌شود؛ اگر حذف خودکار پس‌زمینه در دسترس نباشد، عکس استاندارد با واترمارک آماده خواهد شد.";

function drawWatermark(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  context.save();
  context.globalAlpha = PHOTO_STUDIO_CONFIG.WATERMARK.opacity;
  context.fillStyle = PHOTO_STUDIO_CONFIG.WATERMARK.color;
  context.font = `700 ${PHOTO_STUDIO_CONFIG.WATERMARK.fontSize}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
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
      context.save();
      context.translate(x, y);
      context.rotate(PHOTO_STUDIO_CONFIG.WATERMARK.rotation);
      context.fillText(PHOTO_STUDIO_CONFIG.WATERMARK.text, 0, 0);
      context.restore();
    }
  }
  context.restore();
}

function waitForVideoReady(video: HTMLVideoElement) {
  if (video.videoWidth > 0 && video.videoHeight > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const events = ["loadedmetadata", "loadeddata", "canplay"] as const;
    const cleanup = () => {
      events.forEach((event) => video.removeEventListener(event, checkReady));
      video.removeEventListener("error", onError);
      window.clearTimeout(timeout);
    };
    const checkReady = () => {
      if (video.videoWidth <= 0 || video.videoHeight <= 0) return;
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Camera preview failed to load."));
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Camera preview did not become ready."));
    }, 10_000);

    events.forEach((event) => video.addEventListener(event, checkReady));
    video.addEventListener("error", onError);
    checkReady();
  });
}

export function PhotoStudio({ open, onClose, onDone }: PhotoStudioProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const finalFileRef = useRef<File | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState("در حال آماده‌سازی دوربین…");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [captureReady, setCaptureReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [noticeText, setNoticeText] = useState<string | null>(null);
  const [mode, setMode] = useState<"camera" | "preview">("camera");
  const initializationIdRef = useRef(0);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

  };

  const resetStudio = () => {
    initializationIdRef.current += 1;
    stopStream();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    finalFileRef.current = null;
    setConsentAccepted(false);
    setMode("camera");
    setPreviewUrl(null);
    setStatus("در حال آماده‌سازی دوربین…");
    setErrorText(null);
    setNoticeText(null);
    setCaptureReady(false);
    setIsProcessing(false);
    setIsCapturing(false);
  };

  const handleModalClose = () => {
    resetStudio();
    onClose();
  };

  useEffect(() => {
    return () => {
      initializationIdRef.current += 1;
      stopStream();
    };
  }, []);

  const startCamera = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorText(
        window.isSecureContext
          ? "دوربین در این مرورگر در دسترس نیست؛ دسترسی دوربین را بررسی کنید یا مرورگر دیگری را امتحان کنید."
          : "برای استفاده از دوربین، صفحه را با اتصال امن HTTPS باز کنید.",
      );
      setStatus("دوربین در دسترس نیست");
      return;
    }

    const initializationId = ++initializationIdRef.current;
    let failedAt = "دوربین";
    setErrorText(null);
    setNoticeText(null);
    setCaptureReady(false);
    setStatus("در حال درخواست مجوز دوربین…");

    let streamRequest: Promise<MediaStream>;
    try {
      streamRequest = navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 1600 },
        },
        audio: false,
      });
    } catch (error) {
      streamRequest = Promise.reject(error);
    }

    void (async () => {
      try {
        const stream = await streamRequest;
        if (initializationId !== initializationIdRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        failedAt = "پخش تصویر دوربین";
        const video = videoRef.current;
        if (!video) throw new Error("Camera preview is not mounted.");
        video.muted = true;
        video.playsInline = true;
        video.srcObject = stream;
        await video.play();
        await waitForVideoReady(video);
        if (initializationId !== initializationIdRef.current) return;
        setCaptureReady(true);
        setStatus("چهره را داخل راهنمای قاب قرار دهید");
        setErrorText(null);
      } catch (error) {
        if (initializationId !== initializationIdRef.current) return;
        stopStream();
        setCaptureReady(false);
        const errorName =
          error instanceof DOMException || error instanceof Error
            ? error.name
            : "UnknownError";
        console.error("Provider photo studio initialization failed", {
          stage: failedAt,
          error,
        });

        if (errorName === "NotAllowedError" || errorName === "SecurityError") {
          setErrorText(
            "دسترسی دوربین مسدود است. مجوز دوربین این سایت را در تنظیمات مرورگر فعال کنید و صفحه را با HTTPS باز کنید.",
          );
        } else if (
          errorName === "NotFoundError" ||
          errorName === "DevicesNotFoundError"
        ) {
          setErrorText("دوربین دستگاه پیدا نشد.");
        } else if (
          errorName === "NotReadableError" ||
          errorName === "AbortError"
        ) {
          setErrorText(
            "دوربین در دسترس نیست یا برنامه‌ی دیگری از آن استفاده می‌کند. برنامه‌های دوربین را ببندید و دوباره تلاش کنید.",
          );
        } else {
          setErrorText(
            `راه‌اندازی ${failedAt} ناموفق بود. دوربین را آزاد کنید و دوباره تلاش کنید.`,
          );
        }
        setStatus(`راه‌اندازی ${failedAt} انجام نشد`);
      }
    })();
  };

  const resetToCamera = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    finalFileRef.current = null;
    setMode("camera");
    setPreviewUrl(null);
    setIsProcessing(false);
    setCaptureReady(false);
    setErrorText(null);
    setNoticeText(null);
  };

  const retryCamera = () => {
    initializationIdRef.current += 1;
    stopStream();
    setCaptureReady(false);
    setErrorText(null);
    setStatus("در حال آماده‌سازی دوربین…");
    startCamera();
  };

  const handleCapture = async () => {
    if (!videoRef.current || !captureReady) return;

    setIsCapturing(true);
    setIsProcessing(true);
    setErrorText(null);
    setNoticeText(null);
    setStatus("در حال آماده‌سازی عکس…");

    try {
      const video = videoRef.current;
      const width = PHOTO_STUDIO_CONFIG.OUTPUT.width;
      const height = PHOTO_STUDIO_CONFIG.OUTPUT.height;
      if (video.videoWidth <= 0 || video.videoHeight <= 0) {
        throw new Error("Camera frame is not ready.");
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
      const targetAspect = width / height;
      const sourceAspect = video.videoWidth / video.videoHeight;
      const sourceWidth =
        sourceAspect > targetAspect
          ? video.videoHeight * targetAspect
          : video.videoWidth;
      const sourceHeight =
        sourceAspect > targetAspect
          ? video.videoHeight
          : video.videoWidth / targetAspect;
      const sourceX = (video.videoWidth - sourceWidth) / 2;
      const sourceY = (video.videoHeight - sourceHeight) / 2;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        width,
        height,
      );

      let backgroundRemoved = false;
      try {
        const { FilesetResolver, ImageSegmenter } = await import(
          "@mediapipe/tasks-vision"
        );
        const useSimdModule = await FilesetResolver.isSimdSupported();
        const fileset = await FilesetResolver.forVisionTasks(
          "/mediapipe",
          useSimdModule,
        );
        const segmenter = await ImageSegmenter.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/selfie_segmenter.tflite",
          },
          runningMode: "IMAGE",
          outputConfidenceMasks: true,
          outputCategoryMask: true,
        });

        try {
          const result = segmenter.segment(canvas);
          try {
            const labels = segmenter.getLabels();
            const personIndex = labels.findIndex((label) =>
              /person|human|foreground/i.test(label),
            );
            const confidenceIndex = personIndex >= 0 ? personIndex : 0;
            const confidenceMask = result.confidenceMasks?.[confidenceIndex];
            const categoryMask = result.categoryMask;
            const maskWidth = confidenceMask?.width ?? categoryMask?.width ?? 0;
            const maskHeight =
              confidenceMask?.height ?? categoryMask?.height ?? 0;
            const confidenceValues = confidenceMask?.getAsFloat32Array();
            const categoryValues = categoryMask?.getAsUint8Array();
            if (
              !maskWidth ||
              !maskHeight ||
              (!confidenceValues && !categoryValues)
            ) {
              throw new Error("Segmentation model returned no usable mask.");
            }

            const mask = new Uint8ClampedArray(width * height * 4);
            for (let y = 0; y < height; y += 1) {
              const maskY = Math.min(
                maskHeight - 1,
                Math.floor((y / height) * maskHeight),
              );
              for (let x = 0; x < width; x += 1) {
                const maskX = Math.min(
                  maskWidth - 1,
                  Math.floor((x / width) * maskWidth),
                );
                const sourceIndex = maskY * maskWidth + maskX;
                let alpha = 0;
                if (confidenceValues) {
                  let confidence = confidenceValues[sourceIndex] ?? 0;
                  if (confidence > 1) confidence /= 255;
                  alpha = Math.min(1, Math.max(0, (confidence - 0.25) / 0.5));
                } else if (categoryValues) {
                  const category = categoryValues[sourceIndex] ?? 0;
                  alpha =
                    personIndex >= 0
                      ? Number(category === personIndex)
                      : Number(category > 0);
                }
                const index = (y * width + x) * 4;
                mask[index] = Math.round(alpha * 255);
                mask[index + 1] = mask[index];
                mask[index + 2] = mask[index];
                mask[index + 3] = 255;
              }
            }

            const coverage = computeMaskCoverage(mask, width, height);
            if (shouldRejectMask(coverage, width, height)) {
              throw new Error("Segmentation mask did not pass quality checks.");
            }

            const source = context.getImageData(0, 0, width, height).data;
            const backgroundCanvas = document.createElement("canvas");
            backgroundCanvas.width = width;
            backgroundCanvas.height = height;
            const backgroundContext = backgroundCanvas.getContext("2d");
            if (!backgroundContext) {
              throw new Error("Watermark background canvas is unavailable.");
            }
            backgroundContext.fillStyle = PHOTO_STUDIO_CONFIG.OUTPUT.background;
            backgroundContext.fillRect(0, 0, width, height);
            drawWatermark(backgroundContext, width, height);

            const layered = buildLayerStack({
              imageWidth: width,
              imageHeight: height,
              source,
              mask,
              backgroundPixels: backgroundContext.getImageData(
                0,
                0,
                width,
                height,
              ).data,
            });
            context.putImageData(
              new ImageData(
                new Uint8ClampedArray(layered.output),
                width,
                height,
              ),
              0,
              0,
            );
            backgroundRemoved = true;
          } finally {
            result.close();
          }
        } finally {
          segmenter.close();
        }
      } catch (error) {
        console.warn(
          "Provider photo background removal failed; using standardized photo fallback",
          error,
        );
      }

      if (!backgroundRemoved) {
        drawWatermark(context, width, height);
      }

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
      setStatus(
        backgroundRemoved
          ? "عکس با پس‌زمینه‌ی استاندارد آماده است"
          : "عکس استاندارد با واترمارک آماده شد",
      );
      setNoticeText(
        backgroundRemoved
          ? null
          : "حذف خودکار پس‌زمینه در این دستگاه در دسترس نبود؛ عکس با قاب و واترمارک استاندارد آماده شد.",
      );
    } catch (error) {
      console.error("Provider photo capture failed", error);
      const message = error instanceof Error ? error.message : "";
      setErrorText(
        message === "Camera frame is not ready."
          ? "تصویر دوربین هنوز آماده نیست؛ چند لحظه صبر کنید و دوباره بگیرید."
          : message === "Output image exceeds the allowed size."
            ? "حجم عکس نهایی بیشتر از حد مجاز است؛ دوباره عکس بگیرید."
            : "آماده‌سازی عکس انجام نشد؛ دوباره تلاش کنید.",
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
              onClick={() => {
                setConsentAccepted(true);
                startCamera();
              }}
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

          {noticeText && (
            <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-sm leading-6 text-amber-900">
              {noticeText}
            </p>
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
