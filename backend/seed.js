import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Product.deleteMany();

await Product.insertMany([
  {
    name: "Spondylosis Collar",
    slug: "spondylosis-collar",
    category: "Cervical",
    price: 899,
    discountPrice: 649,
    description: "Neck support for pain relief",
    // images: ["https://via.placeholder.com/400x400.png?text=MGRM+Product"],
    images: ["/products/collar.png"],

    sizes: ["S", "M", "L"],
    colors: ["White"],
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: "Knee Support",
    slug: "knee-support",
    category: "Knee",
    price: 999,
    discountPrice: 799,
    description: "Knee support brace",
    // images: ["https://via.placeholder.com/400x400.png?text=MGRM+Product"],
    images: ["/products/knee.png"],
    sizes: ["M", "L"],
    colors: ["Black"],
    isBestSeller: true
  }
]);

console.log("Data Inserted");
process.exit();