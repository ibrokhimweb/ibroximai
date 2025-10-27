import { Context, InlineKeyboard, NextFunction } from "grammy";
import { channels } from "../constants/index.js";

export const checkSubscription = async (ctx: Context, next: NextFunction) => {
  const keyboard = new InlineKeyboard();

  // Obuna bo'lmagan kanallarni filterlaymiz
  const notSubscribedChannels: typeof channels = [];

  for (const channel of channels) {
    try {
      const member = await ctx.api.getChatMember(
        `@${channel.username}`,
        ctx.from!.id
      );
      if (member.status === "left" || member.status === "kicked") {
        notSubscribedChannels.push(channel);
      }
    } catch (err) {
      console.error(
        `❌ Kanalni tekshirishda xatolik: ${channel.username}`,
        err
      );
      // Agar kanal topilmasa yoki bot admin emas bo'lsa, tekshiruvni o'tkazamiz
      notSubscribedChannels.push(channel);
    }
  }

  if (notSubscribedChannels?.length) {
    // Inline tugmalarni yaratish
    notSubscribedChannels.forEach((channel) => {
      // URL tugmasi orqali foydalanuvchi kanalga yo‘naltiriladi
      keyboard.url(channel.name, `https://t.me/${channel.username}`).row();
    });

    keyboard.text("✅ Tasdiqlash", "confirm_subscription");

    await ctx.reply(
      "❗ Botdan foydalanish uchun quyidagi kanallarga obuna bo‘lishingiz kerak:",
      { reply_markup: keyboard }
    );
    return;
  }

  await next();
};
