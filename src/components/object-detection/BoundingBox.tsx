import type { Detection } from "./hooks/useDetector";

type BoundingBoxProps = {
  object: Detection;
};

export default function BoundingBox({ object }: BoundingBoxProps) {
  const { box, label, score } = object;
  const { xmin, ymin, xmax, ymax } = box;

  const color = getColorForLabel(label);
  const left = `${100 * xmin}%`;
  const top = `${100 * ymin}%`;
  const width = `${100 * (xmax - xmin)}%`;
  const height = `${100 * (ymax - ymin)}%`;

  return (
    <>
      <div
        className="absolute text-xs px-2 py-1 text-white font-semibold rounded-md shadow-lg z-10 backdrop-blur-sm"
        style={{
          left,
          top: `calc(${top} - 1.5rem)`,
          backgroundColor: `${color}CC`,
          border: `1px solid ${color}`,
          whiteSpace: "nowrap",
        }}
      >
        {label} {Math.round(score * 100)}%
      </div>
      <div
        className="absolute border-2 z-10 rounded-sm"
        style={{ 
          left, 
          top, 
          width, 
          height, 
          borderColor: color,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.3), inset 0 0 0 1px ${color}33`
        }}
      />
    </>
  );
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4", 
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#FF9F43",
  "#70A1FF",
  "#5F27CD",
  "#00D2D3",
  "#FF6348",
  "#2ED573",
  "#FFA502",
  "#3742FA",
];

function getColorForLabel(label: string): string {
  const hash = label
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return COLORS[hash % COLORS.length];
}