/**
 * Seed sample recovery story (run once: node backend/seedProductExtras.js)
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import RecoveryStory from "./models/RecoveryStory.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connected");

  const product = await Product.findOne().sort({ createdAt: -1 });
  const user = await User.findOne({ role: "user" }) || await User.findOne();

  if (product && user) {
    const storyCount = await RecoveryStory.countDocuments({ productId: product._id });
    if (!storyCount) {
      await RecoveryStory.create({
        userId: user._id,
        productId: product._id,
        beforeImage: product.images?.[0] || "/products/knee.png",
        afterImage: product.images?.[0] || "/products/knee.png",
        title: "Back to morning walks",
        story:
          "Consistent use of this support during physiotherapy helped restore mobility and reduce daily pain.",
        recoveryDuration: "8 weeks",
        status: "published",
        isFeatured: true,
      });
      console.log("Sample published recovery story created");
    }
  }

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
