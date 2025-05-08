import ObjectDetection from "@/components/ObjectDetection";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Object Detection",
  description:
    "object detection tool where users can upload or record an image, and the system will detect the objects in the image",
};

const page = () => {
  return (
    <div>
      <ObjectDetection />
    </div>
  );
};

export default page;
