import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relation with User model
        required: true,
      },
  tradeLicense: String,
  plantLayout: String,
  bills: [String],
  ghgReport: String,
  wwtpLayout: String,
  waterBalance: String,
  massBalance: String,
  energyBalance: String,
  manufacturingDesc: String,
 
}, { timestamps: true });

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload;
