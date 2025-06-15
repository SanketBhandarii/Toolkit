import Image from "next/image";

interface Props {
  imageUrl: string;
}

export const ImagePreview = ({ imageUrl }: Props) => (
  <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
    <Image
      src={imageUrl}
      alt="Uploaded"
      className="w-full rounded-lg object-contain border border-slate-600/30"
      width={0}
      height={0}
    />
    <p className="text-center mt-3 text-sm text-gray-300 font-medium">
      Original Image
    </p>
  </div>
);