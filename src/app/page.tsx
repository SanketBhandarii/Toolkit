import { Metadata } from "next";
import React from "react";

import LandingPage from "@/components/Landing";

export const metadata: Metadata = {
  title: "Web Tools",
  description: "Get your tools here",
};

const page = () => {
  return (
    <div>
      <LandingPage />
    </div>
  );
};

export default page;
