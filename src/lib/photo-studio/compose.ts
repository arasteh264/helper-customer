import { PHOTO_STUDIO_CONFIG } from "./config";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateTemplateScale(
  faceWidth: number,
  faceHeight: number,
  imageWidth: number,
  imageHeight: number,
) {
  const template = PHOTO_STUDIO_CONFIG.TEMPLATE;
  const targetFaceWidth = imageWidth * template.faceWidthRatio;
  const targetFaceHeight = imageHeight * template.faceHeightRatio;
  const candidateWidth = targetFaceWidth / Math.max(faceWidth, 1);
  const candidateHeight = targetFaceHeight / Math.max(faceHeight, 1);
  return clamp(Math.min(candidateWidth, candidateHeight), 0.5, 2.2);
}

export function calculateTemplateOffset(
  imageWidth: number,
  imageHeight: number,
  faceWidth: number,
  faceHeight: number,
  scale = 1,
) {
  const template = PHOTO_STUDIO_CONFIG.TEMPLATE;
  const targetCenterX = imageWidth * (template.faceCenterX / 100);
  const targetCenterY = imageHeight * (template.faceCenterY / 100);
  const scaledWidth = faceWidth * scale;
  const scaledHeight = faceHeight * scale;

  return {
    x: targetCenterX - scaledWidth / 2,
    y: targetCenterY - scaledHeight / 2,
    width: scaledWidth,
    height: scaledHeight,
  };
}

export function computeMaskCoverage(
  mask: Uint8ClampedArray | Uint8Array | number[],
  width: number,
  height: number,
  threshold = 128,
) {
  let foreground = 0;
  for (let index = 0; index < mask.length; index += 4) {
    const value = mask[index] ?? 0;
    if (value > threshold) foreground += 1;
  }

  const totalPixels = width * height;
  return totalPixels > 0 ? foreground / totalPixels : 0;
}

export function shouldRejectMask(
  coverage: number,
  width: number,
  height: number,
) {
  const limits = PHOTO_STUDIO_CONFIG.LIMITS;
  const ratio = Math.min(width, height);

  if (ratio < limits.minResolution) return true;
  if (coverage < limits.minFaceCoverage || coverage > limits.maxFaceCoverage) {
    return true;
  }

  return false;
}

export function buildLayerStack({
  imageWidth,
  imageHeight,
  source,
  mask,
  backgroundPixels,
}: {
  imageWidth: number;
  imageHeight: number;
  source: Uint8ClampedArray;
  mask: Uint8ClampedArray;
  backgroundPixels: Uint8ClampedArray;
}) {
  const output = new Uint8ClampedArray(imageWidth * imageHeight * 4);

  for (let index = 0; index < output.length; index += 4) {
    const alpha = (mask[index] ?? 0) / 255;

    output[index] = Math.round(
      (source[index] ?? 255) * alpha +
        (backgroundPixels[index] ?? 255) * (1 - alpha),
    );
    output[index + 1] = Math.round(
      (source[index + 1] ?? 255) * alpha +
        (backgroundPixels[index + 1] ?? 255) * (1 - alpha),
    );
    output[index + 2] = Math.round(
      (source[index + 2] ?? 255) * alpha +
        (backgroundPixels[index + 2] ?? 255) * (1 - alpha),
    );
    output[index + 3] = 255;
  }

  return { output };
}
