import { Context, NextFunction } from "grammy";

// Oldingi xabar id larini saqlash uchun
const userMessages = new Map<number, number[]>();

export const logger = async (ctx: Context, next: NextFunction) => {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  // 1️⃣ Oldingi xabarlarni o'chiramiz
  const messages = userMessages.get(chatId) || [];
  for (const msgId of messages) {
    try {
      await ctx.api.deleteMessage(chatId, msgId);
    } catch (err) {
      // Xabar allaqachon o'chirilgan bo'lishi mumkin
    }
  }
  userMessages.set(chatId, []);

  const from =
    ctx.from?.username || ctx.from?.first_name || "Noma'lum foydalanuvchi";
  const text = ctx.message?.text || "";
  console.log(`[${new Date().toISOString()}] ${from}: ${text}`);
  await next();
};
