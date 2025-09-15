import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [100, "Name cannot exceed 100 characters"]
    },
    logo: {
        type: String,
        required: false,
        trim: true
    },
    employeeCount: {
        type: mongoose.Schema.Types.ObjectId,  // Changed to ObjectId
        required: [true, "Employee count range is required"],
        ref: 'EmployeeCount'  // Assuming this is the correct model name
    },
    address: {
        type: String  // Changed to ObjectId
    },
    registrationNumber: {
        type: String
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,  // Changed to ObjectId
        required: [true, "Country is required"],
        ref: 'Country'  // Assuming you have a Country model
    },
    averageRevenue: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Average revenue is required"],
        ref: "AnnualRevenue"
    },
    sector: {
        type: mongoose.Schema.Types.ObjectId,  // Changed to ObjectId
        required: [true, "Sector is required"],
        ref: 'Sector'  // Changed to singular
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,  // Changed to ObjectId
        required: [true, "Industry is required"],
        ref: 'Industry'  // Changed to singular
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "block"]
    }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;