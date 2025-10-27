import { Context } from "grammy";
import { userService } from "../services/user.service.js";
import { mainMenuKeyboard } from "../keyboards/index.js";

export const contactHandler = async (ctx: Context) => {
  const from = ctx.from;
  const contact = ctx.message?.contact;

  if (!from || !contact) return;

  try {
    await userService.updatePhone(String(from.id), contact.phone_number);

    await mainMenuKeyboard(ctx);
  } catch (err) {
    console.error("❌ Contact handler error:", err);
    await ctx.reply("⚠️ Xatolik yuz berdi. Keyinroq qayta urinib ko‘ring.");
  }
};
