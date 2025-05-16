"use client";
import Link from "next/link";
import React from "react";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const tools = [
  {
    name: "Text Summarizer",
    description: "Summarize your long paragraph",
    href: "/textsummarizer",
  },
  {
    name: "Image To Text",
    description: "Read text from the image.",
    href: "/imagetotext",
  },
  {
    name: "Depth Estimation",
    description: "Depth of objects present in an image.",
    href: "/depthestimation",
  },
  {
    name: "Object Detection",
    description: "Detect objects in images",
    href: "/objectdetection",
  },
  {
    name: "Image Segmenter",
    description: "Segment your images",
    href: "/imagesegmenter",
  },
  {
    name: "Text to Speech",
    description: "Convert text to speech ",
    href: "/texttospeech",
  },
  {
    name: "Speech to Text",
    description: "Transcribe audio using whipser model",
    href: "/whisperweb",
  },
  {
    name: "Image Upscaler",
    description: "Enhance low-resolution images with AI.",
    href: "/imageupscaler",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-800 text-white px-6 py-12">
      <div className="text-center py-12">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 mb-4"
        >
          Tools to Simplify Your Digital Workflow
        </motion.h1>
        <p className="text-lg md:text-xl text-zinc-400 mb-6">
          Explore innovative tools crafted with cutting-edge AI technologies.
        </p>
        <Button
          variant="default"
          className="text-white px-6 py-5 rounded-lg cursor-pointer bg-sky-700 transition-colors duration-300"
        >
          Get Started
        </Button>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 max-w-6xl mx-auto">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="w-full"
          >
            <Link href={tool.href} prefetch={true}>
              <Card className="bg-neutral-800 border border-neutral-700 hover:scale-[1.02] hover:border-teal-400 transition-transform duration-300 rounded-xl cursor-pointer shadow-lg">
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-semibold text-white mb-3">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-zinc-300 text-lg">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 max-w-2xl mx-auto">
        <Alert className="bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-600 border border-transparent shadow-lg p-4 rounded-xl">
          <Terminal className="h-5 w-5 text-purple-500 mr-3" />
          <div>
            <AlertTitle className="text-xl font-semibold text-white">
              More Tools Coming Soon
            </AlertTitle>
            <AlertDescription className="text-zinc-400">
              We&apos;re working on more AI-powered tools. Stay tuned for
              updates!
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
};

export default LandingPage;
