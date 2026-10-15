import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDir = path.join(projectRoot, "public", "mediapipe");
const wasmDir = path.join(
  projectRoot,
  "node_modules",
  "@mediapipe",
  "tasks-vision",
  "wasm",
);
const models = [
  {
    fileName: "blaze_face_short_range.tflite",
    url: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
  },
  {
    fileName: "selfie_segmenter.tflite",
    url: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
  },
];
const wasmFiles = [
  "vision_wasm_module_internal.js",
  "vision_wasm_module_internal.wasm",
  "vision_wasm_nosimd_internal.js",
  "vision_wasm_nosimd_internal.wasm",
];

await fs.mkdir(targetDir, { recursive: true });

for (const model of models) {
  const response = await fetch(model.url);
  if (!response.ok) {
    throw new Error(`Could not download ${model.fileName}: HTTP ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0) {
    throw new Error(`Downloaded model is empty: ${model.fileName}`);
  }
  await fs.writeFile(path.join(targetDir, model.fileName), buffer);
  console.log(`Downloaded ${model.fileName} (${buffer.length} bytes)`);
}

for (const fileName of wasmFiles) {
  await fs.copyFile(path.join(wasmDir, fileName), path.join(targetDir, fileName));
}

console.log(`MediaPipe models and runtime are ready in ${targetDir}`);
