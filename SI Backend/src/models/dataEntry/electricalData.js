import mongoose from "mongoose";

const PanelSchema = new mongoose.Schema({
  size: String,
  qty: Number,
}, { _id: false });

const BankSchema = new mongoose.Schema({
  brand: String,
  kva: Number,
  detuned: String,
  shunt: String,
}, { _id: false });

const FilterSchema = new mongoose.Schema({
  type: String,
  panel: String,
  installation: String,
  model: String,
}, { _id: false });

const StabilizerSchema = new mongoose.Schema({
  present: String,
  brand: String,
  kva: Number,
}, { _id: false });

const VFDsSchema = new mongoose.Schema({
  model: String,
  appType: String,
  location: String,
  date: String,
}, { _id: false });

const ElectricalDataSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relation with User model
        required: true,
      },
  diagramFile: String,
  loadDate: String,
  loadTime: String,
  loadFile: String,
  mvPanels: [PanelSchema],
  lvPanels: [PanelSchema],
  banks: [BankSchema],
  filters: [FilterSchema],
  stabilizer: StabilizerSchema,
  loads: [String],
  vfds: VFDsSchema,
  failures: Number,
  
}, { timestamps: true });

export default mongoose.model("ElectricalData", ElectricalDataSchema);
