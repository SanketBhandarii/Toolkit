export function rawImageToDataURL(rawImage: {
  data: Uint8Array;
  width: number;
  height: number;
  channels: number;
}): string {
  const { data, width, height, channels } = rawImage;

  // Convert raw data to RGBA for ImageData
  const rgbaData = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const base = i * channels;
    rgbaData[i * 4 + 0] = data[base]; // R
    rgbaData[i * 4 + 1] = data[base + 1]; // G
    rgbaData[i * 4 + 2] = data[base + 2]; // B
    rgbaData[i * 4 + 3] = 255; // A (opaque)
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  const imageData = new ImageData(rgbaData, width, height);
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}
