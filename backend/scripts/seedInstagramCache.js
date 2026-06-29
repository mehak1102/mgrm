import dotenv from "dotenv";
import mongoose from "mongoose";
import { refreshInstagramCache } from "../services/instagramService.js";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connected");

  const result = await refreshInstagramCache({ force: true });
  console.log("Instagram cache seeded:", {
    source: result.source,
    posts: result.posts?.length ?? 0,
    updatedAt: result.updatedAt,
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
