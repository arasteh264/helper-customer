"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Modal } from "@/src/components/shared/modal";
import { PHOTO_STUDIO_CONFIG } from "@/src/lib/photo-studio/config";
import { buildLayerStack } from "@/src/lib/photo-studio/compose";

type PhotoStudioProps = {
  open: boolean;
  onClose: () => void;
  onDone: (file: File) => Promise<void> | void;
};

const ACCEPTANCE_TEXT =
  "عکس فقط روی دستگاه شما پردازش می‌شود و فقط نسخه‌ی نهایی آپلود می‌شود.";

const createFallbackMask = (
  width: number,
  height: number,
  box?: { x: number; y: number; width: number; height: number },
) => {
  const mask = new Uint8ClampedArray(width * height * 4);
  const centerX = box ? box.x + box.width / 2 : width * 0.5;
  const centerY = box ? box.y + box.height / 2 : height * 0.48;
  const ellipseWidth = box ? box.width * 1.25 : width * 0.38;
  const ellipseHeight = box ? box.height * 1.35 : height * 0.56;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = x - centerX;
      const dy = y - centerY;
      const normalizedX = (dx * dx) / (ellipseWidth * ellipseWidth);
      const normalizedY = (dy * dy) / (ellipseHeight * ellipseHeight);
      const inside = normalizedX + normalizedY <= 1;
      const index = (y * width + x) * 4;
      mask[index] = inside ? 255 : 0;
      mask[index + 1] = inside ? 255 : 0;
      mask[index + 2] = inside ? 255 : 0;
      mask[index + 3] = 255;
    }
  }

  return mask;
};

export function PhotoStudio({ open, onClose, onDone }: PhotoStudioProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);
  const finalFileRef = useRef<File | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState("در حال آماده‌سازی دوربین…");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureReady, setCaptureReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [mode, setMode] = useState<"camera" | "preview">("camera");
  const [isLocalProcessingReady, setIsLocalProcessingReady] = useState(false);

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
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    finalFileRef.current = null;
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
    return () => stopStream();
  }, []);

  useEffect(() => {
    if (!open) return;

    if (!consentAccepted) return;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorText("دوربین در این مرورگر پشتیبانی نمی‌شود. لطفاً از دستگاه یا مرورگر دیگری استفاده کنید.");
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

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsCameraReady(true);
        setStatus("چهره را داخل بیضی قرار دهید");
        setErrorText(null);

        if (typeof window !== "undefined") {
          try {
            const taskVision = await import("@mediapipe/tasks-vision");
            await taskVision.FilesetResolver.forVisionTasks("/mediapipe", true);
            setIsLocalProcessingReady(true);
          } catch {
            setIsLocalProcessingReady(false);
            setStatus("دوربین آماده است؛ فایل‌های مدل محلی MediaPipe نصب نشده‌اند");
          }
        }
      } catch {
        setErrorText(
          "مجوز دوربین داده نشد. برای این مرحله، اگر دسترسی دوربین ندارید، فقط با عکس‌های دیگر ادامه دهید.",
        );
        setStatus("مجوز دوربین رد شد");
      }
    };

    void startCamera();

    return () => {
      stopStream();
    };
  }, [consentAccepted, open]);

  useEffect(() => {
    if (!open || !consentAccepted || mode !== "camera") return;

    const tick = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        requestRef.current = requestAnimationFrame(tick);
        return;
      }

      try {
        const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const fileset = await FilesetResolver.forVisionTasks("/mediapipe", true);
        const detector = await FaceDetector.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/face_detection_short_range.tflite",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.5,
        });

        const result = detector.detectForVideo(video, performance.now());
        const face = result.detections?.[0];

        if (!face) {
          setStatus("چهره‌ای پیدا نشد");
          setCaptureReady(false);
          requestRef.current = requestAnimationFrame(tick);
          return;
        }

        const box = face.boundingBox;
        const centerX = (box.originX + box.width / 2) / video.videoWidth;
        const centerY = (box.originY + box.height / 2) / video.videoHeight;
        const faceRatio = box.width / video.videoWidth;

        if (faceRatio < 0.12) {
          setStatus("کمی نزدیک‌تر بایستید");
          setCaptureReady(false);
        } else if (Math.abs(centerX - 0.5) > 0.18 || Math.abs(centerY - 0.45) > 0.15) {
          setStatus("چهره را وسط بیضی بگذارید");
          setCaptureReady(false);
        } else {
          setStatus("حالت گرفتن عکس فعال شد");
          setCaptureReady(true);
        }
      } catch {
        setStatus("دوربین آماده است؛ برای پردازش دقیق‌تر مدل‌های MediaPipe نصب شوند");
        setCaptureReady(true);
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [consentAccepted, mode, open]);

  const resetToCamera = () => {
    setMode("camera");
    setPreviewUrl(null);
    setIsProcessing(false);
    setCaptureReady(false);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !captureReady) return;

    setIsCapturing(true);
    setIsProcessing(true);
    setStatus("در حال آماده‌سازی عکس…");

    try {
      const video = videoRef.current;
      const width = PHOTO_STUDIO_CONFIG.OUTPUT.width;
      const height = PHOTO_STUDIO_CONFIG.OUTPUT.height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas unavailable");
      }

      context.fillStyle = PHOTO_STUDIO_CONFIG.OUTPUT.background;
      context.fillRect(0, 0, width, height);
      context.translate(width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, width, height);
      context.setTransform(1, 0, 0, 1, 0, 0);

      let mask: Uint8ClampedArray | null = null;

      if (isLocalProcessingReady && typeof window !== "undefined") {
        try {
          const { FilesetResolver, ImageSegmenter } = await import("@mediapipe/tasks-vision");
          const fileset = await FilesetResolver.forVisionTasks("/mediapipe", true);
          const segmenter = await ImageSegmenter.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath: "/mediapipe/selfie_segmentation_landscape.tflite",
            },
            runningMode: "IMAGE",
            outputConfidenceMasks: true,
            outputCategoryMask: true,
          });
          const result = segmenter.segment(video);
          const sourceMask = result.categoryMask?.getAsUint8Array();
          if (sourceMask) {
            mask = new Uint8ClampedArray(sourceMask.length * 4);
            for (let index = 0; index < sourceMask.length; index += 1) {
              const value = sourceMask[index] ?? 0;
              const rgbaIndex = index * 4;
              mask[rgbaIndex] = value > 128 ? 255 : 0;
              mask[rgbaIndex + 1] = value > 128 ? 255 : 0;
              mask[rgbaIndex + 2] = value > 128 ? 255 : 0;
              mask[rgbaIndex + 3] = 255;
            }
          }
        } catch {
          const box = {
            x: width * 0.32,
            y: height * 0.18,
            width: width * 0.36,
            height: height * 0.52,
          };
          mask = createFallbackMask(width, height, box);
        }
      } else {
        const box = {
          x: width * 0.32,
          y: height * 0.18,
          width: width * 0.36,
          height: height * 0.52,
        };
        mask = createFallbackMask(width, height, box);
      }

      const source = context.getImageData(0, 0, width, height).data;
      const layered = buildLayerStack({
        imageWidth: width,
        imageHeight: height,
        source,
        mask,
      });

      const output = new ImageData(
        new Uint8ClampedArray(layered.output),
        width,
        height,
      );
      context.putImageData(output, 0, 0);

      if (typeof document !== "undefined" && "fonts" in document) {
        await document.fonts.load("500 48px Poppins");
      }

      context.fillStyle = `rgba(31, 122, 92, ${PHOTO_STUDIO_CONFIG.WATERMARK.opacity})`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `${Math.round(width * PHOTO_STUDIO_CONFIG.WATERMARK.sizeRatio)}px Poppins, sans-serif`;
      context.fillText(PHOTO_STUDIO_CONFIG.WATERMARK.text, width / 2, height * 0.52);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (nextBlob) => {
            if (!nextBlob) {
              reject(new Error("Final image could not be generated."));
              return;
            }
            resolve(nextBlob);
          },
          PHOTO_STUDIO_CONFIG.OUTPUT.format,
          PHOTO_STUDIO_CONFIG.OUTPUT.quality,
        );
      });

      const file = new File([blob], "profile-photo.webp", { type: "image/webp" });
      finalFileRef.current = file;
      const previewObjectUrl = URL.createObjectURL(blob);
      setPreviewUrl((currentUrl) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        return previewObjectUrl;
      });
      setMode("preview");
      setStatus("عکس آماده است؛ تأیید یا دوباره گرفتن");
    } catch (error) {
      console.error(error);
      setErrorText("پردازش عکس انجام نشد. لطفاً دوباره تلاش کنید.");
      setStatus("خطا در آماده‌سازی عکس");
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose} title="استودیو عکس پروفایل" size="lg">
      {!consentAccepted ? (
        <div className="space-y-5">
          <div className="rounded-xl bg-foreground/5 p-4 text-sm leading-7 text-foreground/75">
            {ACCEPTANCE_TEXT}
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-card p-3">
            <p className="text-sm text-foreground/70">فقط نسخه‌ی نهایی آپلود می‌شود.</p>
            <Button variant="primary" size="md" onClick={() => setConsentAccepted(true)}>
              <Check size={16} />
              شروع
            </Button>
          </div>
        </div>
      ) : mode === "camera" ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-black">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="h-[58dvh] w-full scale-x-[-1] object-cover"
              aria-label="پیش‌نمایش زنده دوربین"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[72%] w-[68%] rounded-[50%] border-[3px] border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.42)]" />
              <div className="absolute left-1/2 top-[55%] h-[24%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-black/30 px-4 py-3 text-center text-sm text-white backdrop-blur-sm">
              {status}
            </div>
          </div>

          {errorText && (
            <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
              {errorText}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={handleCapture}
              disabled={!captureReady || isCapturing || isProcessing}
            >
              {isCapturing ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
              {isCapturing ? "در حال گرفتن عکس…" : "گرفتن عکس"}
            </Button>
            <Button type="button" variant="outline" onClick={resetToCamera} className="gap-2">
              <RefreshCw size={16} />
              دوباره
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-foreground/10 bg-card p-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="پیش‌نمایش عکس نهایی"
                className="h-[420px] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center rounded-xl bg-foreground/5 text-sm text-foreground/60">
                تصویر آماده نیست
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={async () => {
                if (!finalFileRef.current) return;
                await onDone(finalFileRef.current);
                if (!errorText) {
                  handleModalClose();
                }
              }}
            >
              <Check size={16} />
              تأیید و آپلود
            </Button>
            <Button type="button" variant="outline" onClick={() => {
              setMode("camera");
              setPreviewUrl((currentUrl) => {
                if (currentUrl) URL.revokeObjectURL(currentUrl);
                return null;
              });
              setStatus("چهره را داخل بیضی قرار دهید");
              setCaptureReady(false);
              setErrorText(null);
            }} className="gap-2">
              <Sparkles size={16} />
              گرفتن دوباره
            </Button>
            <Button type="button" variant="ghost" onClick={handleModalClose} className="gap-2">
              <X size={16} />
              بستن
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
