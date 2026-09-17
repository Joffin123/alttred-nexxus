import nodemailer from "nodemailer";
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
console.log(
  "Turnstile secret loaded:",
  TURNSTILE_SECRET_KEY ? "YES" : "NO"
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(req) {
  const { name, email, message, turnstileToken } = await req.json();
  if (!turnstileToken) {
  return Response.json(
    { error: "Please complete the verification." },
    { status: 400 }
  );
}
const turnstileResponse = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: turnstileToken,
    }),
  }
);

const turnstileResult = await turnstileResponse.json();

if (!turnstileResult.success) {
  console.log("Turnstile verification failed:", turnstileResult);
  return Response.json(
    { error: "Verification failed. Please try again." },
    { status: 403 }
  );
}

  if (!name || !email || !message) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await transporter.sendMail({
      from: `"ALTTRED NEXXUS" <${process.env.SMTP_USER}>`,
      to: "joffin@astack.co",
      replyTo: email,
      subject: `New enquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="margin-bottom:4px">New project enquiry</h2>
          <p style="color:#666;font-size:13px;margin-top:0">via ALTTRED NEXXUS contact form</p>
          <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px">
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;width:90px;color:#888;vertical-align:top">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;vertical-align:top">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:#000">${email}</a></td></tr>
            <tr><td style="padding:10px 0;color:#888;vertical-align:top">Message</td><td style="padding:10px 0;white-space:pre-wrap">${message}</td></tr>
          </table>
        </div>
      `,
    });
  } catch (err) {
    console.error("Mail error:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
