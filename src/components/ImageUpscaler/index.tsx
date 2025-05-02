"use client"

import { Download, Upload } from "lucide-react"
import { useState } from "react"

import Upscaler from "upscaler"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DropZone from "./DropZone"
import ImagePreview from "./ImagePreview"
import UpscaleOptions from "./UpscaleOptions"

export default function ImageUpscaler() {
    const [preview, setPreview] = useState<string | null>(null)
    const [factor, setFactor] = useState<"2x" | "3x">("2x")
    const [upscaled, setUpscaled] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreview(url)
        setUpscaled(null)
    }

    const handleUpscale = async () => {
        if (!preview) return;
        setLoading(true);

        try {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = preview;

            img.onload = async () => {
                const upscaler = new Upscaler();
                const upscaled = await upscaler.execute(img, {
                    output: "base64",
                    patchSize: 128,
                    padding: 2,
                    progress: (progress) => {
                        console.log("Progress:", progress);
                    },
                });

                setUpscaled(upscaled as string);
            };
        } catch (err) {
            console.error("Upscaling failed:", err);
            alert("AI upscaling failed.");
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = () => {
        if (!upscaled) return
        const a = document.createElement("a")
        a.href = upscaled
        a.download = `upscaled_${factor}.png`
        a.click()
    }

    const handleReupload = () => {
        setPreview(null)
        setUpscaled(null)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center mb-6 mt-10">
                <h1 className="text-3xl font-bold mb-1">Image Upscaler</h1>
                <p className="text-gray-400 font-semibold">
                    Upload an image and upscale it to 2x or 3x the original size.
                </p>
            </div>

            <Card className="p-5 w-full max-w-md sm:max-w-2xl border border-gray-300">
                <div className="space-y-6">
                    {!preview ? (
                        <DropZone onSelect={handleUpload} />
                    ) : (
                        <ImagePreview
                            src={upscaled ?? preview}
                            original={preview}
                            factor={factor}
                        />

                    )}

                    <UpscaleOptions value={factor} onChange={(v) => {
                        setFactor(v)
                        setUpscaled(null)
                    }} />

                    <div className="flex flex-col items-center gap-3">
                        <Button
                            disabled={loading}
                            className="w-full sm:w-[80%] bg-neutral-400 hover:bg-neutral-500 text-white cursor-pointer"
                            onClick={handleUpscale}
                            suppressHydrationWarning
                        >
                            {loading ? "Upscaling..." : "Upscale Image"}
                        </Button>


                        <Button className="w-full sm:w-[80%] bg-neutral-100 text-gray-700 hover:bg-neutral-200 cursor-pointer" onClick={handleReupload} suppressHydrationWarning>
                            <Upload className="mr-2" />
                            Reupload
                        </Button>

                        {upscaled && (
                            <Button className="w-full sm:w-[80%] bg-neutral-400 hover:bg-neutral-500 text-white cursor-pointer" onClick={handleDownload} suppressHydrationWarning>
                                <Download className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}