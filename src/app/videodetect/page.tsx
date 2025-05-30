import LiveDetector from "@/components/VidDetection/LiveDetector";

export default function Page() {
  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">🎥 Video Detection</h1>
      <LiveDetector />
    </div>
  );
}
