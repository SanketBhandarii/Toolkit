"use client";
import Link from "next/link";
import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    name: "Image To Text",
    description: "Extract and read text from any image instantly",
    href: "/imagetotext",
    gradient: "from-blue-600 to-slate-600",
  },
  {
    name: "Depth Estimation",
    description: "Analyze 3D depth perception in your images",
    href: "/depthestimation",
    gradient: "from-blue-600 to-slate-600",
  },
  {
    name: "Object Detection",
    description: "Identify and locate objects with precision",
    href: "/objectdetection",
    gradient: "from-blue-600 to-slate-600",
  },
  {
    name: "Speech to Text",
    description: "Transcribe audio with advanced Whisper AI",
    href: "/whisperweb",
    gradient: "from-blue-600 to-slate-600",
  },
  {
    name: "Text to Speech",
    description: "Convert your text into natural-sounding voice",
    href: "/texttospeech",
    gradient: "from-blue-600 to-slate-600",
  },
  {
    name: "Text Summarizer",
    description: "Transform lengthy paragraphs into summaries",
    href: "/textsummarizer",
    gradient: "from-blue-600 to-slate-600",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#012b28] via-black to-teal-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="relative z-10 px-4 md:px-6 py-8 md:py-12">
        <div className="text-center py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto text-teal-400 mb-4" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-6xl font-bold mb-3 leading-tight"
          >
            <span className="bg-gradient-to-r from-teal-600 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              AI-Powered Tools
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            No server. No api&apos;s. All processing in your browser
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button className="bg-gradient-to-r from-teal-800 to-blue-600 text-white px-8 py-4 md:px-12 md:py-6 text-md rounded-lg shadow-2xl transform transition-all duration-300 group">
              Explore below
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto mb-16">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1 }}
              className="group"
            >
              <Link href={tool.href} prefetch={true}>
                <Card className="h-36 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-teal-500/50 transition-all duration-500 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer relative overflow-hidden mx-2 md:mx-0">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  <CardContent className="relative z-10">
                    <CardTitle className="text-lg font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                      {tool.name}
                    </CardTitle>

                    <CardDescription className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                      {tool.description}
                    </CardDescription>

                    <div className="mt-4 flex items-center text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:-translate-y-1">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-3 justify-center text-lg items-center text-gray-400">
          Contributions Welcome
          <Link
            href="https://github.com/SanketBhandarii/Toolkit"
            target="_blank"
            className="text-xl"
          >
            <FaGithub className="cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
