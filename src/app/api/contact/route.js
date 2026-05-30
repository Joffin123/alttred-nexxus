import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await transporter.sendMail({
      from: `"ALTTRED NEXXUS" <${process.env.GMAIL_USER}>`,
      to: "joffingeorge10@gmail.com",
      replyTo: email,
      subject: `New enquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="margin-bottom:4px">New project enquiry</h2>
          <p style="color:#666;font-size:13px;margin-top:0">via ALTTRED NEXXUS contact form</p>
          <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px">
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;width:90px;color:#888;vertical-align:top">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;vertical-align:top">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:#ff6b3d">${email}</a></td></tr>
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
