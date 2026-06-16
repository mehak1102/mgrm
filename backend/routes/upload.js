import express from "express";
import multer from "multer";
import { auth, adminOnly } from "../middleware/auth.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

async function handleUpload(req, res, folder) {
  try {
    if (!process.env.CLOUDINARY_API_KEY) {
      return res.status(500).json({
        msg: "Cloudinary env missing. Check backend/.env",
      });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ msg: err.message });
  }
}

// Admin product images
router.post("/", auth, adminOnly, upload.single("image"), (req, res) =>
  handleUpload(req, res, "mgrm-products")
);

// Authenticated users — review photos
router.post("/review", auth, upload.single("image"), (req, res) =>
  handleUpload(req, res, "mgrm-reviews")
);

// Authenticated users — profile + recovery photos
router.post("/profile", auth, upload.single("image"), (req, res) =>
  handleUpload(req, res, "mgrm-profiles")
);

router.post("/recovery-user", auth, upload.single("image"), (req, res) =>
  handleUpload(req, res, "mgrm-recovery")
);

// Admin — recovery story images
router.post("/recovery", auth, adminOnly, upload.single("image"), (req, res) =>
  handleUpload(req, res, "mgrm-recovery")
);

export default router;
