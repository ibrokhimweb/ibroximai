import { MiddlewareFn } from "grammy";
import { userService } from "../bot/services/user.service.js";

export const ensurePhone: MiddlewareFn = async (ctx, next) => {
  const from = ctx.from;
  if (!from) return;

  const user = await userService.findByTelegramId(String(from.id));
  if (!user?.phone) {
    await ctx.reply("📱 Iltimos, telefon raqamingizni yuboring:", {
      reply_markup: {
        keyboard: [
          [{ text: "📞 Telefon raqamni yuborish", request_contact: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return; // Stop chain until phone provided
  }

  await next();
};
