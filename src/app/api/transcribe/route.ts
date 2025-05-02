import { NextResponse } from "next/server";

import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({ apiKey: process.env.THIRD_PARTY_API_KEY! });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadRes = await client.files.upload(buffer);
    const transcript = await client.transcripts.transcribe({
      audio: uploadRes,
      speech_model: "slam-1",
    });
    return NextResponse.json({ text: transcript.text });
  } catch (error) {
    console.error("Transcription Error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe" },
      { status: 500 }
    );
  }
}
