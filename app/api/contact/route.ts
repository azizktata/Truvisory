import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/utils/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendContactEmail(name, email, phone ?? "", message);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
