import { TextSummarizerController } from "@/components/TextSummarizer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Summarizer",
  description: "Summarize your long paragraph",
};

const page = () => {
  return <TextSummarizerController />;
};

export default page;
