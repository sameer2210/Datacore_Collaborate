import mongoose from 'mongoose';

const productionDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rawMaterials: { type: String, required: true },
  finalProducts: { type: String, required: true },
  technologyUsed: { type: String, required: true },
  productionCapacity: { type: String, required: true },

}, { timestamps: true });

const ProductionData = mongoose.model('ProductionData', productionDataSchema);
export default ProductionData;
