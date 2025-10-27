import { Context } from "grammy";
import axios from "axios";

/**
 * 🔍 Lexica.art AI prompt qidiruvchisi
 * Foydalanuvchidan matn oladi va 3 tagacha natijani qaytaradi
 */
export const lexicaHandler = async (ctx: Context) => {
  const text = ctx.message?.text?.trim();
  if (!text) return;

  try {
    const { data } = await axios.post(
      "https://lexica.art/api/infinite-prompts",
      new URLSearchParams({ text }),
      {
        headers: {
          Origin: "https://lexica.art",
          Referer: `https://lexica.art/?q=${encodeURIComponent(text)}`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!data?.prompts?.length) {
      await ctx.reply(`\`\`\`${JSON.stringify(data, null, 2)}\`\`\``, {
        parse_mode: "Markdown",
      });
      return;
    }

    // 🔹 Faqat 3 ta rasmni yuboramiz
    const results = data.prompts.slice(0, 3);

    for (const item of results) {
      if (item?.imageUrls?.length > 0) {
        await ctx.replyWithPhoto(item.imageUrls[0], {
          caption: `🎨 *Prompt:* ${item.prompt}`,
          parse_mode: "Markdown",
        });
      } else {
        await ctx.reply(`🧠 Prompt: ${item.prompt}`);
      }
    }
  } catch (error) {
    console.error("⚠️ Lexica xatosi:", error);
    await ctx.reply(
      "❌ So‘rovni bajarishda xatolik yuz berdi. Keyinroq urinib ko‘ring."
    );
  }
};
