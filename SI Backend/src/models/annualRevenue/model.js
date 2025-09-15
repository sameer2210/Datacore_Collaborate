import mongoose from 'mongoose';

const annualRevenueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});



const AnnualRevenue = mongoose.model('AnnualRevenue', annualRevenueSchema);

// Start of Selection
// const list = [
//     { name: "1-10 Million" },
//     { name: "10-20 Million" },
//     { name: "20-30 Million" }
// ];

// async function addAnnualRevenues() {
//     try {
//         await AnnualRevenue.insertMany(list);
//         console.log("Annual Revenues added to the database.");
//     } catch (error) {
//         console.error("Error adding Annual Revenues:", error);
//     }
// }

// addAnnualRevenues();

export default AnnualRevenue;
