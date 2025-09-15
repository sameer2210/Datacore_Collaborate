import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Convert __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define upload path
const uploadDir = path.join(__dirname, "..", "uploads", "electrical");

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

export const upload = multer({ storage });
