import { Context } from "grammy";
import { channels } from "../../constants/index.js";

export const confirmSubscription = async (ctx: Context) => {
  const fromId = ctx.from?.id;
  if (!fromId) return;

  let allSubscribed = true;

  for (const channel of channels) {
    try {
      const member = await ctx.api.getChatMember(
        `@${channel.username}`,
        fromId
      );
      if (member.status === "left" || member.status === "kicked") {
        allSubscribed = false;
        break;
      }
    } catch (err) {
      console.error(
        `❌ Kanalni tekshirishda xatolik: ${channel.username}`,
        err
      );
      allSubscribed = false;
      break;
    }
  }

  if (allSubscribed) {
    await ctx.answerCallbackQuery({
      text: "✅ Barcha shartlar to'liq bajarilgan!",
    });
  } else {
    await ctx.answerCallbackQuery({
      text: "❌ Iltimos, barcha kanallarga obuna bo‘ling.",
    });
  }
};
