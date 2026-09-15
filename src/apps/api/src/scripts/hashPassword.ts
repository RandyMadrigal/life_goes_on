import "dotenv/config";
import bcrypt from "bcryptjs";

const rounds = parseInt(process.env.BCRYPT_ROUNDS ?? "12", 10);
const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- <plain-text-password>");
  process.exit(1);
}

bcrypt.hash(password, rounds).then((hash) => {
  console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
});
