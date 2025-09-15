import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isoCertified: { type: String, required: true },
  benchmarkCertifications: { type: String },
  wastewaterReuse: { type: String },
  wasteToEnergy: { type: String },

}, { timestamps: true });

const Certification = mongoose.model('Certification', certificationSchema);

export default Certification;
