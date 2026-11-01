import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function getGmailCredentials() {
  const user = (process.env.GMAIL_USER || "catmusic435@gmail.com").trim();
  const fallbackPass = Buffer.from(
    "bXZjaWdna3h3ZHl2aXpydA==",
    "base64"
  ).toString("utf8");
  const pass = (process.env.GMAIL_APP_PASSWORD || fallbackPass).replace(
    /\s+/g,
    ""
  );
  const to = (process.env.GMAIL_TO || user).trim();
  return { user, pass, to };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type: "wish" | "rsvp" = body?.type === "rsvp" ? "rsvp" : "wish";
    const author = String(body?.author || body?.name || "").trim();
    const message = String(body?.message || "").trim();

    if (!author) {
      return NextResponse.json(
        { ok: false, error: "Missing author/name" },
        { status: 400 }
      );
    }

    const { user, pass, to } = getGmailCredentials();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const nowStr = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    if (type === "rsvp") {
      const sideLabel =
        body?.side === "bride"
          ? "Nhà Gái (15:00 Chiều 23/12 • Thu Hiền)"
          : "Nhà Trai (24/12 • Phương Đông)";
      const attendingMap: Record<string, string> = {
        yes: "Sẽ tham dự",
        maybe: "Có thể tham dự",
        no: "Bận mất rồi",
      };
      const attendingLabel =
        attendingMap[String(body?.attending || "yes")] || "Sẽ tham dự";
      const guestsCount = Number(body?.guestsCount) || 1;
      const notes = String(body?.dietaryNotes || "").trim();

      await transporter.sendMail({
        from: `"Thiệp Cưới Phương Đông & Thu Hiền" <${user}>`,
        to,
        subject: `💌 [Xác Nhận Tham Dự] ${author} — ${attendingLabel}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #FFF9E6; border: 2px solid #8C0000; border-radius: 16px; overflow: hidden;">
            <div style="background: #8C0000; color: #FFE8A4; padding: 18px 24px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 4px;">囍</div>
              <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Xác Nhận Tham Dự Lễ Cưới</h2>
              <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">Phạm Phương Đông &amp; Nguyễn Thị Thu Hiền • 23–24/12/2026</p>
            </div>
            <div style="padding: 22px 24px; color: #2F0000; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 10px;"><strong>Khách mời:</strong> <span style="color: #8C0000; font-size: 17px; font-weight: bold;">${escapeHtml(author)}</span></p>
              <p style="margin: 0 0 10px;"><strong>Trạng thái:</strong> ${escapeHtml(attendingLabel)}</p>
              <p style="margin: 0 0 10px;"><strong>Tham dự bên:</strong> ${escapeHtml(sideLabel)}</p>
              <p style="margin: 0 0 10px;"><strong>Số người:</strong> ${guestsCount} người</p>
              ${
                notes
                  ? `<p style="margin: 0 0 10px;"><strong>Số điện thoại / Ghi chú:</strong> ${escapeHtml(notes)}</p>`
                  : ""
              }
              <hr style="border: none; border-top: 1px solid rgba(140,0,0,0.2); margin: 16px 0;" />
              <p style="margin: 0; font-size: 12px; color: #666;">Thời gian gửi: ${escapeHtml(nowStr)}</p>
            </div>
          </div>
        `,
      });

      return NextResponse.json({ ok: true });
    }

    // Default: Guestbook Wish Email
    await transporter.sendMail({
      from: `"Thiệp Cưới Phương Đông & Thu Hiền" <${user}>`,
      to,
      subject: `🌸 [Lời Chúc Mừng Cưới] từ ${author}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #FFF9E6; border: 2px solid #8C0000; border-radius: 16px; overflow: hidden;">
          <div style="background: #8C0000; color: #FFE8A4; padding: 18px 24px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 4px;">囍</div>
            <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Lời Chúc Mới Trong Sổ Lưu Bút</h2>
            <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">Phạm Phương Đông &amp; Nguyễn Thị Thu Hiền • 24/12/2026</p>
          </div>
          <div style="padding: 22px 24px; color: #2F0000; font-size: 15px; line-height: 1.6;">
            <p style="margin: 0 0 12px;"><strong>Người gửi:</strong> <span style="color: #8C0000; font-size: 17px; font-weight: bold;">${escapeHtml(author)}</span></p>
            <div style="background: #FFFFFF; border-left: 4px solid #8C0000; padding: 14px 16px; border-radius: 8px; font-style: italic; white-space: pre-wrap;">${escapeHtml(message)}</div>
            <hr style="border: none; border-top: 1px solid rgba(140,0,0,0.2); margin: 16px 0;" />
            <p style="margin: 0; font-size: 12px; color: #666;">Thời gian gửi: ${escapeHtml(nowStr)}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send wedding email:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
