import Image from "next/image";

interface Props {
  depthUrl: string;
}

export const DepthMapViewer = ({ depthUrl }: Props) => (
  <div className="rounded-xl p-2 ">
    <Image
      src={depthUrl}
      alt="Depth Map"
      className="w-full rounded-md object-contain"
      width={0}
      height={0}
    />
    <p className="text-center mt-2 text-xs text-muted-foreground text-gray-200">
      Predicted Depth Map
    </p>
  </div>
);
