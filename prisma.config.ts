import "dotenv/config";
import path from "node:path";
import { PrismaConfig } from "prisma";

export default {
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
} satisfies PrismaConfig;
