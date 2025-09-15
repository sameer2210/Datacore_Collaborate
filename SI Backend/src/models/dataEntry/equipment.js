// src/models/dataEntry/equipment.schema.js
import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relation with User model
        required: true,
      },
  equipmentName: { type: String, required: true },
  equipmentType: { type: String },
  batchDuration: { type: String },
  batchesPerDay: { type: String },
  ratedPower: { type: String },
  installationYear: { type: String },
  manufacturer: { type: String },
  comments: { type: String },
 
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;
