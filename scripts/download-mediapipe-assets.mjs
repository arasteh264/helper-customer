import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";

const targetDir = path.resolve(process.cwd(), "public/mediapipe");
const models = [
  {
    name: 'blaze_face_short_range.tflite',
    url: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
  },
  {
    name: 'selfie_segmenter.tflite',
    url: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
  },
]

await fs.mkdir(targetDir, { recursive: true });

for (const item of files) {
  const filePath = path.join(targetDir, item.fileName);
  await new Promise((resolve, reject) => {
    const request = https.get(item.url, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        reject(new Error(`${item.url} returned ${response.statusCode}`));
        response.resume();
        return;
      }

      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        try {
          await fs.writeFile(filePath, Buffer.concat(chunks));
          resolve();
        } catch (writeError) {
          reject(writeError);
        }
      });
    });

    request.on("error", reject);
  });

  console.log(`Downloaded ${item.fileName}`);
}

console.log(`Assets are ready in ${targetDir}`);
