import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { firstName, email, phone, guideTitle, subscribe } = await req.json();
  if (!firstName || !email) {
    return NextResponse.json({ success: false, error: "Name and email required." }, { status: 400 });
  }

  // Everyone who requests the guide joins the First Home Buyers group — this triggers the
  // MailerLite welcome automation that delivers the guide and the follow-up series.
  // Ticking the news box also adds them to the general newsletter group.
  const groups = [process.env.MAILERLITE_FHB_GROUP_ID];
  if (subscribe === "yes") groups.push(process.env.MAILERLITE_GROUP_ID);

  await Promise.all([
    // Internal heads-up to Lena that a new lead came in.
    resend.emails.send({
      from: "Valar Website <lena.bykova@valar.co.nz>",
      to: "lena.bykova@valar.co.nz",
      subject: `Guide request: ${guideTitle}`,
      html: `
        <p><strong>Guide:</strong> ${guideTitle}</p>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>News opt-in:</strong> ${subscribe === "yes" ? "Yes" : "No"}</p>
      `,
    }),

    // Add the lead to MailerLite. The guide itself is delivered by the MailerLite
    // welcome automation attached to the First Home Buyers group.
    fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: { name: firstName },
        groups,
      }),
    }),
  ]);

  return NextResponse.json({ success: true });
}
