import { auth } from "@/lib/auth/server";

export async function main() {
  await auth.api.createUser({
    body: {
      email: "admin@default.com",
      password: "Admin@123",
      name: "Admin Default",
      role: "admin",
    },
  });
}

main();
