import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { firstName, lastName, email, phone, message } = await req.json();
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Someone";

  try {
    await Promise.all([
      // Notification to Lena
      resend.emails.send({
        from: "Valar Website <lena.bykova@valar.co.nz>",
        to: "lena.bykova@valar.co.nz",
        subject: `New message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
      // Auto-reply to the sender
      resend.emails.send({
        from: "Lena Bykova — Valar <lena.bykova@valar.co.nz>",
        to: email,
        subject: "I received your message — Valar Financial Advisors",
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f7f7f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#061634;padding:32px 40px;border-radius:8px 8px 0 0;">
            <p style="margin:0;color:#f0a500;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Valar Financial Advisors</p>
            <p style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:bold;">Thank you for getting in touch<span style="color:#f0a500;">.</span></p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="margin:0 0 16px;color:#1a2f5e;font-size:15px;">Hi ${firstName || "there"},</p>
            <p style="margin:0 0 16px;color:#4a5568;font-size:15px;line-height:1.6;">
              I've received your message and will be in touch within <strong>1 business day</strong>.
            </p>
            <p style="margin:0 0 32px;color:#4a5568;font-size:15px;line-height:1.6;">
              In the meantime, feel free to explore what we offer:
            </p>

            <!-- CTAs -->
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
              <tr>
                <td style="padding-right:8px;">
                  <a href="https://www.valar.co.nz/services" style="display:block;background:#061634;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:4px;font-size:13px;font-weight:bold;text-align:center;">
                    Our Services →
                  </a>
                </td>
                <td style="padding-left:8px;">
                  <a href="https://www.valar.co.nz/insights" style="display:block;background:#f7f7f5;color:#061634;text-decoration:none;padding:14px 20px;border-radius:4px;font-size:13px;font-weight:bold;text-align:center;border:1px solid #d1d5db;">
                    Knowledge Hub →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Signature -->
            <table cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #e5e7eb;padding-top:24px;margin-top:8px;">
              <tr>
                <td>
                  <p style="margin:0 0 4px;color:#061634;font-size:14px;font-weight:bold;">Lena Bykova</p>
                  <p style="margin:0 0 2px;color:#4a5568;font-size:13px;">Mortgage &amp; Investment Advisor (FSP1010055)</p>
                  <p style="margin:0 0 2px;color:#4a5568;font-size:13px;">VALAR Financial Advisors Limited</p>
                  <p style="margin:8px 0 2px;color:#4a5568;font-size:13px;">P: <a href="tel:+64210863569" style="color:#f0a500;">+64 21 086 35 695</a></p>
                  <p style="margin:0 0 2px;color:#4a5568;font-size:13px;">E: <a href="mailto:lena.bykova@valar.co.nz" style="color:#f0a500;">lena.bykova@valar.co.nz</a></p>
                  <p style="margin:0;color:#4a5568;font-size:13px;">W: <a href="https://www.valar.co.nz" style="color:#f0a500;">www.valar.co.nz</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer disclaimer -->
        <tr>
          <td style="background:#f0f0ee;padding:20px 40px;border-radius:0 0 8px 8px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;">
              IMPORTANT: This e-mail, including any attachments, is confidential. If it is not intended for you, or if you have received this email in error, please notify the sender immediately and delete all copies. Any views or opinions expressed are those of the author and do not necessarily represent those of Valar Financial Advisors Limited.
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
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send message." }, { status: 500 });
  }
}
