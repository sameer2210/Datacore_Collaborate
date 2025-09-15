import mongoose from 'mongoose';

const hvacDataSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relation with User model
        required: true,
      },
  chillers: { type: String },
  chillerType: { type: String },
  coolingTowers: { type: String },
  vfds: { type: String },
  calorifiers: { type: String },
  fahus: { type: String },
  ahus: { type: String },
  fcus: { type: String },
  
}, { timestamps: true });

const HvacData = mongoose.model('HvacData', hvacDataSchema);
export default HvacData;
