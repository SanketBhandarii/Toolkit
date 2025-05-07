import { Metadata } from "next";

import ImageSegmenter from "@/components/ImageSegmenter";

export const metadata: Metadata = {
  title: "Image Segmenter",
  description: "Segment your images to get the foreground and background",
};

export default function Home() {
  return (
    <div >
      <ImageSegmenter/>
    </div>
  );
}
