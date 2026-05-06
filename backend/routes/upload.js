import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
import { auth, adminOnly } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("Cloudinary config check:", {
    cloud: process.env.CLOUDINARY_CLOUD_NAME,
    key: Boolean(process.env.CLOUDINARY_API_KEY),
    secret: Boolean(process.env.CLOUDINARY_API_SECRET),
  });
}

router.post("/", auth, adminOnly, upload.single("image"), async (req, res) => {
  try {
    configureCloudinary();

    if (!process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({
        msg: "Cloudinary env missing. Check backend/.env",
      });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "mgrm-products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;