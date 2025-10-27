import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
  await ctx.reply("📚 Buyruqlar:\n/start - Boshlash\n/help - Yordam");
};
