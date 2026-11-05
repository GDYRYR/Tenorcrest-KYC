import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "@/lib/kv";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      dob,
      address,
      phone,
      country,
      city,
      nextOfKin,
      photo,
      signature,
    } = body;

    if (
      !fullName ||
      !dob ||
      !address ||
      !phone ||
      !country ||
      !city ||
      !nextOfKin ||
      !photo ||
      !signature
    ) {
      return NextResponse.json(
        { error: "All fields including photo and signature are required." },
        { status: 400 }
      );
    }

    // Basic size guard (base64 grows ~33%)
    if (typeof photo === "string" && photo.length > 6_000_000) {
      return NextResponse.json(
        { error: "Photo is too large. Please use a smaller image." },
        { status: 400 }
      );
    }

    const submission = await saveSubmission({
      fullName: String(fullName).trim(),
      dob: String(dob).trim(),
      address: String(address).trim(),
      phone: String(phone).trim(),
      country: String(country).trim(),
      city: String(city).trim(),
      nextOfKin: String(nextOfKin).trim(),
      photo: String(photo),
      signature: String(signature),
    });

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Failed to save submission. Please try again." },
      { status: 500 }
    );
  }
}
