import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Relation with User model
      required: true,
    },
    industryName: String,
    licenseNumber: String,
    location: String,
    establishmentYear: String,
    contactPerson: String,
    address1: String,
    address2: String,
    city: String,
    country: String,
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
