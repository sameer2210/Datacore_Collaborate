// src/models/dataEntry/scadaData.js
import mongoose from 'mongoose';

const scadaDataSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relation with User model
        required: true,
      },
  scadaPresent: { type: String },
  scadaFeatures: { type: String },

}, { timestamps: true });

const ScadaData = mongoose.model('ScadaData', scadaDataSchema);
export default ScadaData;
