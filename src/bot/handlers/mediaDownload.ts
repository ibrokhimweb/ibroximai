import { Context, NextFunction } from "grammy";

export const mediaHandler = async (ctx: Context, next: NextFunction) => {
  const text = ctx.message?.text;
  if (!text) return;

  try {
    // Instagram va TikTok regex
    const instaRegex =
      /(https?:\/\/(?:www\.)?instagram\.com\/(reel|tv|p)\/[A-Za-z0-9_-]+)/i;
    const tiktokRegex = /(https?:\/\/(?:www\.)?tiktok\.com\/[A-Za-z0-9_/]+)/i;

    const instaMatch = text.match(instaRegex);
    const tiktokMatch = text.match(tiktokRegex);

    if (instaMatch) {
      await ctx.api.sendChatAction(ctx.chat?.id || "", "upload_video");
      const url = instaMatch[0].replace("instagram.com", "kkinstagram.com");
      await ctx.replyWithVideo(url);
      return;
    }

    if (tiktokMatch) {
      await ctx.api.sendChatAction(ctx.chat?.id || "", "upload_video");
      const url = tiktokMatch[0].replace("tiktok.com", "kktiktok.com");
      await ctx.replyWithVideo(url);
      return;
    }

    // URL regex bilan tekshirilsin (agar faqat text bo‘lsa)
    if (text.match(/(https?:\/\/[^\s]+)/i)) {
      await ctx.reply(
        "❌ URL noto‘g‘ri yoki qo‘llab-quvvatlanmaydi. Iltimos, faqat Instagram yoki TikTok linkini yuboring."
      );

      return;
    }

    return;
  } catch (err) {
    console.error("❌ Media handler error:", err);
    await ctx.reply(
      "❌ Video yuborib bo'lmadi. Iltimos URLni tekshirib qayta urinib ko'ring."
    );
  }

  await next();
};
