import React from "react";
import { Metadata } from "next";
import ImageToText from "@/components/ocr-tool";

export const metadata: Metadata = {
  title: "Image To Text",
  description: "Identify the text from the image",
};

const page = () =>{
  return <ImageToText/>;
};

export default page;
