import dotenv from "dotenv";
import { bot } from "./bot/index.js";

dotenv.config();

// 🚀 Botni ishga tushirish
bot.start();
console.log("🤖 Bot ishga tushdi...");
