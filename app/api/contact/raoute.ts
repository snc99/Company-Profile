import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data); // Handle form data here
  return NextResponse.json({ message: "Contact form submitted successfully!" });
}
