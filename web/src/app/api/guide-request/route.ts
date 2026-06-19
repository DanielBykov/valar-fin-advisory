import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { firstName, email, phone, guideKey, guideTitle, subscribe } = await req.json();
  if (!firstName || !email) {
    return NextResponse.json({ success: false, error: "Name and email required." }, { status: 400 });
  }

  const sends: Promise<unknown>[] = [
    // Notification to Lena
    resend.emails.send({
      from: "Valar Website <lena.bykova@valar.co.nz>",
      to: "lena.bykova@valar.co.nz",
      subject: `Guide request: ${guideTitle}`,
      html: `
        <p><strong>Guide:</strong> ${guideTitle}</p>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Subscribe:</strong> ${subscribe === "yes" ? "Yes" : "No"}</p>
      `,
    }),

    // Confirmation to the person who requested
    resend.emails.send({
      from: "Lena Bykova — Valar <lena.bykova@valar.co.nz>",
      to: email,
      subject: `Your guide is on its way — ${guideTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f7f7f5;font-family:Georgia,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;padding:40px 20px;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="background:#061634;padding:32px 40px;">
                    <p style="margin:0;color:#f0a500;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">VALAR FINANCIAL ADVISORS</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 40px 32px;">
                    <p style="margin:0 0 24px;font-size:16px;color:#061634;line-height:1.6;">Hi ${firstName},</p>
                    <p style="margin:0 0 16px;font-size:15px;color:#2d3a5a;line-height:1.7;">
                      Thank you for requesting the <strong>${guideTitle}</strong>.
                    </p>
                    <p style="margin:0 0 32px;font-size:15px;color:#2d3a5a;line-height:1.7;">
                      I'll send it through to you shortly. If you have any questions in the meantime, just reply to this email.
                    </p>
                    <hr style="border:none;border-top:1px solid #e8e8e6;margin:32px 0;" />
                    <p style="margin:0 0 4px;font-size:13px;color:#061634;font-weight:bold;font-family:Arial,sans-serif;">Lena Bykova</p>
                    <p style="margin:0 0 2px;font-size:12px;color:#2d3a5a;font-family:Arial,sans-serif;">Mortgage &amp; Investment Advisor (FSP1010055)</p>
                    <p style="margin:0 0 2px;font-size:12px;color:#2d3a5a;font-family:Arial,sans-serif;">VALAR Financial Advisors Limited</p>
                    <p style="margin:0 0 2px;font-size:12px;color:#2d3a5a;font-family:Arial,sans-serif;">+64 21 086 35695</p>
                    <p style="margin:0 0 2px;font-size:12px;color:#2d3a5a;font-family:Arial,sans-serif;">lena.bykova@valar.co.nz</p>
                    <p style="margin:0;font-size:12px;font-family:Arial,sans-serif;"><a href="https://www.valar.co.nz" style="color:#f0a500;">www.valar.co.nz</a></p>
                    <hr style="border:none;border-top:1px solid #e8e8e6;margin:24px 0 16px;" />
                    <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;font-family:Arial,sans-serif;">
                      This email is for the named recipient only and may contain information that is confidential. If you received it in error, please delete it and notify us immediately.
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    }),
  ];

  // Add to MailerLite if subscribed
  if (subscribe === "yes") {
    sends.push(
      fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          fields: { name: firstName },
          groups: [process.env.MAILERLITE_GROUP_ID],
        }),
      })
    );
  }

  await Promise.all(sends);
  return NextResponse.json({ success: true });
}
