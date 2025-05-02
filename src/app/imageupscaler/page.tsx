import { Metadata } from "next";

import ImageUpscaler from "@/components/ImageUpscaler";

export const metadata: Metadata = {
  title: "Image Upscaler",
  description: "Upscale your images to 2x or 3x the original size",
};

export default function Home() {
  return (
    <div>
      <ImageUpscaler />
    </div>
  );
}
