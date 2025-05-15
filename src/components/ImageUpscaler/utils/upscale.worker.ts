export default {} as typeof Worker & (new () => Worker);

self.onmessage = async (event) => {
  const { imageUrl, factor }: { imageUrl: string; factor: "2x" | "3x" } =
    event.data;

  try {
    const { loadUpscaler } = await import("./upscaleImage");
    const upscaler = await loadUpscaler(factor);

    const result = await upscaler(imageUrl);

    self.postMessage({ success: true, result });
  } catch (error: any) {
    self.postMessage({
      success: false,
      error: error?.message || "Unexpected error during upscaling.",
    });
  }
};
