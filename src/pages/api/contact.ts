export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import siteConfig from '@/config/site.config';
import { RESEND_API_KEY, RESEND_FROM_EMAIL } from 'astro:env/server';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.email('Please enter a valid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().max(0),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // 💡 優化：自動判斷是 JSON 還是 FormData
    const contentType = request.headers.get('content-type');
    let data: Record<string, unknown>;

    if (contentType?.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // 驗證邏輯
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, errors: result.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Bot 檢測
    if (result.data.honeypot) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const apiKey = RESEND_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // 💡 確保使用你在 Cloudflare 設定的變數，或是你 Resend 驗證過的網域
    const fromEmail = RESEND_FROM_EMAIL || 'blog@ecoplant.uk';

    const { error } = await resend.emails.send({
      from: `Contact Form <${fromEmail}>`,
      to: siteConfig.email,
      replyTo: result.data.email,
      subject: result.data.subject || `New message from ${result.data.name}`,
      html: `
        <p><strong>Name:</strong> ${result.data.name}</p>
        <p><strong>Email:</strong> ${result.data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${result.data.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error('Contact error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Server Error';
    return new Response(
      JSON.stringify({ success: false, message: errorMessage }),
      { status: 500 }
    );
  }
};