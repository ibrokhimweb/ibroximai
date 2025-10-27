import { MiddlewareFn } from "grammy";
import { userService } from "../bot/services/user.service.js";

export const registerUser: MiddlewareFn = async (ctx, next) => {
  const from = ctx.from;
  if (!from) return next();

  await userService.createOrUpdateUser({
    telegram_id: String(from.id),
    username: from.username,
    first_name: from.first_name,
    last_name: from.last_name,
    language: from.language_code,
    is_premium: from.is_premium,
  });

  await next();
};
