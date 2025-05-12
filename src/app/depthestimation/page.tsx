import { Metadata } from "next";
import { DepthEstimatorController } from "@/components/DepthEstimation";

export const metadata: Metadata = {
  title: "Depth Estimation",
  description: "Depth of objects present in an image.",
};

export default function DepthEstimationPage() {
  return <DepthEstimatorController />;
}
