import { Context } from "grammy";
import { prisma } from "../config/prisma.js";

export interface MyContext extends Context {
  prisma: typeof prisma;
}
