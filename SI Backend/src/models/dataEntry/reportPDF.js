import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relation with User model
    required: true,
  },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true }, //  store public URL/path
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model("Pdf", pdfSchema);
