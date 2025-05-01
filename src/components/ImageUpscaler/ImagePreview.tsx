import { useEffect, useState } from "react"

export default function ImagePreview({
    src,
    factor,
    original,
}: {
    src: string
    factor: "2x" | "3x"
    original: string
}) {
    const [sizes, setSizes] = useState<{ original: string, upscaled: string }>({
        original: "",
        upscaled: ""
    })

    useEffect(() => {
        const img1 = new Image()
        const img2 = new Image()

        img1.onload = () =>
            setSizes(prev => ({ ...prev, original: `${img1.width} × ${img1.height}` }))
        img2.onload = () =>
            setSizes(prev => ({ ...prev, upscaled: `${img2.width} × ${img2.height}` }))

        img1.src = original
        img2.src = src
    }, [original, src])

    return (
        <div>
            <p className="text-center text-sm text-gray-500 font-medium mb-2">
                Original vs Upscaled ({factor})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center">
                    <p className="text-sm mb-1">
                        Original <span className="text-gray-400">({sizes.original})</span>
                    </p>
                    <img
                        src={original}
                        alt="Original"
                        className="rounded-lg object-contain w-full max-h-[350px]"
                    />
                </div>
                <div className="text-center">
                    <p className="text-sm mb-1">
                        Upscaled <span className="text-gray-400">({sizes.upscaled})</span>
                    </p>
                    <img
                        src={src}
                        alt="Upscaled"
                        className="rounded-lg object-contain w-full max-h-[350px]"
                    />
                </div>
            </div>
        </div>
    )
}
