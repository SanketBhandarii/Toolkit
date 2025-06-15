import Image from "next/image";

interface Props {
  depthUrl: string;
}

export const DepthMapViewer = ({ depthUrl }: Props) => (
  <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
    <Image
      src={depthUrl}
      alt="Depth Map"
      className="w-full rounded-lg object-contain border border-slate-600/30"
      width={0}
      height={0}
    />
    <p className="text-center mt-3 text-sm text-teal-400 font-medium">
      Predicted Depth Map
    </p>
  </div>
);