import Image from "next/image";

interface Props {
  imageUrl: string;
}

export const ImagePreview = ({ imageUrl }: Props) => (
  <div className="rounded-xl p-2">
    <Image
      src={imageUrl}
      alt="Uploaded"
      className="w-full rounded-md object-contain"
      width={0}
      height={0}
    />
    <p className="text-center mt-2 text-xs text-muted-foreground text-gray-200">
      Original Image
    </p>
  </div>
);
