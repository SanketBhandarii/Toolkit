import React from "react";
import { Metadata } from "next";
import ImageToTextPage from "@/components/ImageToText";

export const metadata: Metadata = {
  title: "Image To Text",
  description: "Identify the text from the image",
};

const page = () => {
  return <ImageToTextPage />;
};

export default page;
