import { NextResponse } from "next/server";
import Exa from "exa-js";

export async function POST() {
  const exa = new Exa("e37b5f50-2f87-4a23-a3a4-31c84eeafaac");
  try {
    const result = await exa.getContents([
      "https://www.aven.com/support"
    ], {
      text: true
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 