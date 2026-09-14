import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * The auto-reply, in the language the person wrote to us in.
 *
 * One template, two sets of strings — not two templates. The Ukrainian page
 * needed a reply that is not in English, and a second copy of a branded email
 * is a second place to forget when the phone number or the licence line
 * changes. Everything structural stays below; only what a reader sees is here.
 *
 * The links differ too, and deliberately: an English reply points into the
 * English site, and pointing a Ukrainian reader at `/services` would undo the
 * thing `/ua` exists to do.
 */
const REPLY_COPY = {
  en: {
    subject: "I received your message — Valar Financial Advisors",
    title: "Thank you for getting in touch",
    greeting: (name: string) => `Hi ${name},`,
    received: (window: string) =>
      `I've received your message and will be in touch within <strong>${window}</strong>.`,
    window: "1 business day",
    meanwhile: "In the meantime, feel free to explore what we offer:",
    ctas: [
      { label: "Our Services →", href: "https://www.valar.co.nz/services" },
      { label: "Knowledge Hub →", href: "https://www.valar.co.nz/insights" },
    ],
    signName: "Lena Bykova",
    role: "Mortgage &amp; Investment Adviser (FSP1010055)",
    disclaimer:
      "IMPORTANT: This e-mail, including any attachments, is confidential. If it is not intended for you, or if you have received this email in error, please notify the sender immediately and delete all copies. Any views or opinions expressed are those of the author and do not necessarily represent those of Valar Financial Advisors Limited.",
    fallbackName: "there",
  },
  uk: {
    subject: "Ваше повідомлення отримано — Valar Financial Advisors",
    title: "Дякую, що написали",
    greeting: (name: string) => `Вітаю, ${name}!`,
    received: (window: string) =>
      `Я отримала ваше повідомлення й відповім протягом <strong>${window}</strong>.`,
    window: "одного робочого дня",
    meanwhile: "А поки що:",
    ctas: [
      { label: "Гайд First Home Buyer →", href: "https://www.valar.co.nz/ua#guide" },
      { label: "Подивитися вебінар →", href: "https://www.valar.co.nz/ua#webinar" },
    ],
    /* Ліна on a Ukrainian page, Lena in English and on the register. */
    signName: "Ліна Бикова",
    role: "Іпотечна та інвестиційна радниця (FSP1010055)",
    disclaimer:
      "ВАЖЛИВО: цей лист і будь-які вкладення є конфіденційними. Якщо він призначений не вам або надійшов помилково, будь ласка, повідомте відправника й видаліть усі копії. Висловлені думки належать автору й не обов'язково збігаються з позицією Valar Financial Advisors Limited.",
    fallbackName: "друже",
  },
} as const;

export async function POST(req: Request) {
  const { firstName, lastName, email, phone, message, locale } = await req.json();
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Someone";
  const t = locale === "uk" ? REPLY_COPY.uk : REPLY_COPY.en;

  try {
    await Promise.all([
      // Notification to Lena. Always in English — it is her own inbox, and the
      // language the enquiry came in is itself worth knowing at a glance.
      resend.emails.send({
        from: "Valar Website <lena.bykova@valar.co.nz>",
        to: "lena.bykova@valar.co.nz",
        subject: `New message from ${name}${locale === "uk" ? " (Ukrainian page)" : ""}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${locale === "uk" ? "<p><strong>Wrote in:</strong> Ukrainian — reply in Ukrainian</p>" : ""}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
      // Auto-reply to the sender
      resend.emails.send({
        from: "Lena Bykova — Valar <lena.bykova@valar.co.nz>",
        to: email,
        subject: t.subject,
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
            <p style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:bold;">${t.title}<span style="color:#f0a500;">.</span></p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="margin:0 0 16px;color:#1a2f5e;font-size:15px;">${t.greeting(firstName || t.fallbackName)}</p>
            <p style="margin:0 0 16px;color:#4a5568;font-size:15px;line-height:1.6;">
              ${t.received(t.window)}
            </p>
            <p style="margin:0 0 32px;color:#4a5568;font-size:15px;line-height:1.6;">
              ${t.meanwhile}
            </p>

            <!-- CTAs -->
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
              <tr>
                <td style="padding-right:8px;">
                  <a href="${t.ctas[0].href}" style="display:block;background:#061634;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:4px;font-size:13px;font-weight:bold;text-align:center;">
                    ${t.ctas[0].label}
                  </a>
                </td>
                <td style="padding-left:8px;">
                  <a href="${t.ctas[1].href}" style="display:block;background:#f7f7f5;color:#061634;text-decoration:none;padding:14px 20px;border-radius:4px;font-size:13px;font-weight:bold;text-align:center;border:1px solid #d1d5db;">
                    ${t.ctas[1].label}
                  </a>
                </td>
              </tr>
            </table>

            <!-- Signature -->
            <table cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #e5e7eb;padding-top:24px;margin-top:8px;">
              <tr>
                <td>
                  <p style="margin:0 0 4px;color:#061634;font-size:14px;font-weight:bold;">${t.signName}</p>
                  <p style="margin:0 0 2px;color:#4a5568;font-size:13px;">${t.role}</p>
                  <p style="margin:0 0 2px;color:#4a5568;font-size:13px;">Valar Financial Advisors Limited &middot; FSP1012862</p>
                  <p style="margin:8px 0 2px;color:#4a5568;font-size:13px;">P: <a href="tel:+642108635695" style="color:#f0a500;">+64 21 086 35695</a></p>
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
              ${t.disclaimer}
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
