import type { Detection } from "./hooks/useDetector";

type BoundingBoxProps = {
  object: Detection;
};

export default function BoundingBox({ object }: BoundingBoxProps) {
  const { box, label } = object;
  const { xmin, ymin, xmax, ymax } = box;

  const color = getRandomHexColor();
  const left = 100 * xmin + "%";
  const top = 100 * ymin + "%";
  const width = 100 * (xmax - xmin) + "%";
  const height = 100 * (ymax - ymin) + "%";

  return (
    <>
      <span
        className="absolute px-3 text-sm text-white"
        style={{ left, top, backgroundColor: color }}
      >
        {label}
      </span>
      <div
        className="absolute"
        style={{ left, top, width, height, border: `2px solid ${color}` }}
      />
    </>
  );
}

function getRandomHexColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}
