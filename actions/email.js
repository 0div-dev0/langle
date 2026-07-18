"use server"
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
export default async function sendEmail({ email, token }) {
  try {
    const verifyUrl = `${process.env.NEXT_AUTH_URL}/api/auth/verify?token=${token}`
    await resend.emails.send({
      from: "Langle <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Langle account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #030712;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); margin-bottom: 16px;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Welcome to Langle</h1>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 16px;">Guess the language. Find the country.</p>
            </div>

            <!-- Main Card -->
            <div style="background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 40px;">
              <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #f1f5f9; text-align: center;">Verify your email</h2>
              <p style="margin: 0 0 32px; color: #94a3b8; font-size: 15px; line-height: 1.6; text-align: center;">Thanks for signing up! Click the button below to verify your email and start guessing languages from around the world.</p>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${verifyUrl}" style="display: inline-flex; align-items: center; gap: 8px; padding: 16px 32px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; font-weight: 600; font-size: 16px; border-radius: 12px; text-decoration: none; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3); transition: transform 0.2s, box-shadow 0.2s;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  Verify Email
                </a>
              </div>

              <!-- Alternative link -->
              <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">Button not working? Copy this link:</p>
                <p style="margin: 0; word-break: break-all; color: #8b5cf6; font-size: 13px; font-family: monospace;"><a href="${verifyUrl}" style="color: #8b5cf6; text-decoration: underline;">${verifyUrl}</a></p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
              <p style="margin: 0; color: #475569; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
              <p style="margin: 16px 0 0; color: #334155; font-size: 12px;">Made with <span style="color: #ec4899;">♥</span> for language lovers everywhere</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
  } catch {
    throw new Error("Email not sent")
  }
}