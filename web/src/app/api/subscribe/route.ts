import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, firstName } = await req.json();
  if (!email) return NextResponse.json({ success: false, error: "Email required." }, { status: 400 });

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      fields: { name: firstName || "" },
      groups: [process.env.MAILERLITE_GROUP_ID],
    }),
  });

  const json = await res.json();
  if (res.ok) return NextResponse.json({ success: true });
  return NextResponse.json({ success: false, error: json.message || "Failed to subscribe." }, { status: 500 });
}
