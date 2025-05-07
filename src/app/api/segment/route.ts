// import { NextResponse } from "next/server";

// const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN!;

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("image") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const fileArrayBuffer = await file.arrayBuffer();

//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/google/deeplabv3_mobilenet_v2_1.0_513",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
//           "Content-Type": file.type || "image/jpeg",
//         },
//         body: fileArrayBuffer,
//       }
//     );

//     const resultText = await response.text();

//     try {
//       const resultJson = JSON.parse(resultText);
//       return NextResponse.json(resultJson);
//     } catch (e) {
//       return NextResponse.json(
//         {
//           error: "Failed to parse response from Hugging Face",
//           raw: resultText,
//         },
//         { status: 500 }
//       );
//     }
//   } catch (err) {
//     console.error("Server error:", err);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
console.log("Hello")
