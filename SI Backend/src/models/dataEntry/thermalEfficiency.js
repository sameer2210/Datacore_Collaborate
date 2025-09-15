// src/models/dataEntry/thermalEfficiency.schema.js
import mongoose from 'mongoose';

const thermalEfficiencySchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relation with User model
        required: true,
      },
  cooled: { type: String },
  envelopeSpecs: { type: String },
  roofInsulation: { type: String },
  coolRoof: { type: String },
  windowFilms: { type: String },
 
}, { timestamps: true });

const ThermalEfficiency = mongoose.model('ThermalEfficiency', thermalEfficiencySchema);
export default ThermalEfficiency;
