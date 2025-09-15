// src/models/dataEntry/productionData.schema.js
import mongoose from 'mongoose';

const operationalDataSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relation with User model
        required: true,
      },
  annualProduction: { type: String },
  shutdownDays: { type: String },
  directHireEmployees: { type: String },
  indirectHireEmployees: { type: String },
  gridElectricity: { type: String },
  independentPower: { type: String },
  solarPower: { type: String },
  dieselConsumed: { type: String },
  heavyOilConsumed: { type: String },
  fuelGasConsumed: { type: String },
  freshWater: { type: String },
  recycledWater: { type: String },
  energyInvestment: { type: String },

}, { timestamps: true });

const OperationalData = mongoose.model('OperationalData', operationalDataSchema);
export default OperationalData;
