export default {} as typeof Worker & (new () => Worker);

self.onmessage = async (event) => {
  const { imageUrl, factor }: { imageUrl: string; factor: "2x" | "3x" } =
    event.data;

  try {
    const { loadUpscaler } = await import("./upscaleImage");
    const upscaler = await loadUpscaler(factor);

    const result = await upscaler(imageUrl);

    self.postMessage({ success: true, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected error during upscaling.";

    self.postMessage({
      success: false,
      error: message,
    });
  }
};
