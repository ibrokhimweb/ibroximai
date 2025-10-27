import { Context, NextFunction } from "grammy";
import { ensurePhone } from "../../middlewares/ensurePhone.js";
import { mainMenuKeyboard } from "../keyboards/index.js";
import { userService } from "../services/user.service.js";

export const startCommand = async (ctx: Context, next: NextFunction) => {
  const name = ctx.from?.first_name || "foydalanuvchi";

  try {
    const text = `*👋 Salom, ${name}!*
    
    Men — sizning shaxsiy yordamchingizman.`;

    await ctx.reply(text, { parse_mode: "Markdown" });

    await ensurePhone(ctx, next);

    const user = await userService.findByTelegramId(String(ctx.from?.id));

    if (user?.phone) {
      await mainMenuKeyboard(ctx);
    }
  } catch (err) {
    console.error("❌ Start command error:", err);
    await ctx.reply(
      "⚠️ Xatolik yuz berdi, birozdan so‘ng qayta urinib ko‘ring."
    );
  }
};
