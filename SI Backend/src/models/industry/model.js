import mongoose from 'mongoose';
import "../sector/model.js";

const industrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    sector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sector',
        required: true
    }
});

const defaultIndustries = [
    {
        "sector": "66d975d56526d79a361ded00",
        "name": "Appliance Manufacturing"
    },
    {
        "sector": "66d975d56526d79a361ded00",
        "name": "Building Products & Furnishings"
    },
    {
        "sector": "66d975d56526d79a361ded00",
        "name": "E-Commerce"
    },
    {
        "sector": "66d975d56526d79a361ded00",
        "name": "Household & Personal Products"
    },
    {
        "sector": "66d975d56526d79a361ded00",
        "name": "Apparel, Accessories & Footwear"
    },
    {
        "sector": "66d975d56526d79a361ded00",
        "name": "Multiline and Specialty Retailers & Distributors"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Coal Operations"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Construction Materials"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Iron and Steel"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Metals & Mining"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Oil & Gas – Exploration & Production"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Oil & Gas – Midstream"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Oil & Gas – Refining & Marketing"
    },
    {
        "sector": "66e92853fb65ae4ff93b2f10",
        "name": "Oil & Gas – Services"
    },
    {
        "sector": "66e9285dfb65ae4ff93b2f11",
        "name": "Asset Management & Custody Activities"
    },
    {
        "sector": "66e9285dfb65ae4ff93b2f11",
        "name": "Commercial Banks"
    },
    {
        "sector": "66e9285dfb65ae4ff93b2f11",
        "name": "Consumer Finance"
    },
    {
        "sector": "66e9285dfb65ae4ff93b2f11",
        "name": "Insurance"
    },
    {
        "sector": "66e9285dfb65ae4ff93b2f11",
        "name": "Investment Banking & Brokerage"
    },
    {
        "sector": "66e9285dfb65ae4ff93b2f11",
        "name": "Mortgage Finance"
    },
    {
        "sector": "66e9285dfb65ae4ff93b2f11",
        "name": "Security & Commodity Exchanges"
    },
    {
        "sector": "66e9286efb65ae4ff93b2f12",
        "name": "Agricultural Products"
    },
    {
        "sector": "66e9286efb65ae4ff93b2f12",
        "name": "Food Retailers & Distributors"
    },
    {
        "sector": "66e9286efb65ae4ff93b2f12",
        "name": "Meat, Poultry & Dairy"
    },
    {
        "sector": "66e9286efb65ae4ff93b2f12",
        "name": "Non-Alcoholic Beverages"
    },
    {
        "sector": "66e9286efb65ae4ff93b2f12",
        "name": "Processed Foods"
    },
    {
        "sector": "66e9286efb65ae4ff93b2f12",
        "name": "Restaurant"
    },
    {
        "sector": "66e92887fb65ae4ff93b2f13",
        "name": "Biotechnology & Pharmaceuticals"
    },
    {
        "sector": "66e92887fb65ae4ff93b2f13",
        "name": "Drug Retailers"
    },
    {
        "sector": "66e92887fb65ae4ff93b2f13",
        "name": "Health Care Delivery"
    },
    {
        "sector": "66e92887fb65ae4ff93b2f13",
        "name": "Health Care Distributors"
    },
    {
        "sector": "66e92887fb65ae4ff93b2f13",
        "name": "Managed Care"
    },
    {
        "sector": "66e92887fb65ae4ff93b2f13",
        "name": "Medical Equipment & Supplies"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Electric Utilities & Power Generators"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Engineering & Construction Service"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Gas Utilities & Distributors"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Home Builders"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Real Estate"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Real Estate Services"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Waste Management"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f14",
        "name": "Water Utilities & Services"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f15",
        "name": "Biofuels"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f15",
        "name": "Forestry Management"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f15",
        "name": "Fuel Cells & Industrial Batteries"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f15",
        "name": "Pulp & Paper Products"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f15",
        "name": "Solar Technology & Project Developer"
    },
    {
        "sector": "66e9289afb65ae4ff93b2f15",
        "name": "Wind Technology & Project Developers"
    },
    {
        "sector": "66e928aafb65ae4ff93b2f16",
        "name": "Aerospace & Defence"
    },
    {
        "sector": "66e928aafb65ae4ff93b2f16",
        "name": "Chemicals"
    },
    {
        "sector": "66e928aafb65ae4ff93b2f16",
        "name": "Containers & Packaging"
    },
    {
        "sector": "66e928aafb65ae4ff93b2f16",
        "name": "Electrical & Electronic Equipment"
    },
    {
        "sector": "66e928aafb65ae4ff93b2f16",
        "name": "Industrial Machinery & Goods"
    },
    {
        "sector": "66e928befb65ae4ff93b2f17",
        "name": "Advertising & Marketing"
    },
    {
        "sector": "66e928befb65ae4ff93b2f17",
        "name": "Education"
    },
    {
        "sector": "66e928befb65ae4ff93b2f17",
        "name": "Hotels & Lodging"
    },
    {
        "sector": "66e928befb65ae4ff93b2f17",
        "name": "Leisure Facilities"
    },
    {
        "sector": "66e928befb65ae4ff93b2f17",
        "name": "Media & Entertainment"
    },
    {
        "sector": "66e928befb65ae4ff93b2f17",
        "name": "Professional & Commercial Services"
    },
    {
        "sector": "66e928d5fb65ae4ff93b2f18",
        "name": "Electronic Manufacturing Services & Original Design Manufacturing"
    },
    {
        "sector": "66e928d5fb65ae4ff93b2f18",
        "name": "Hardware"
    },
    {
        "sector": "66e928d5fb65ae4ff93b2f18",
        "name": "Internet Media & Services"
    },
    {
        "sector": "66e928d5fb65ae4ff93b2f18",
        "name": "Semiconductors"
    },
    {
        "sector": "66e928d5fb65ae4ff93b2f18",
        "name": "Software & IT Services"
    },
    {
        "sector": "66e928d5fb65ae4ff93b2f18",
        "name": "Telecommunication Services"
    }
];

// Function to initialize default industries




const Industry = mongoose.model('Industry', industrySchema);
const initializeDefaultIndustries = async () => {
    try {
        const count = await Industry.countDocuments();
        if (count === 0) {
            await Industry.insertMany(defaultIndustries);
        }
    } catch (error) {
        console.error('Error initializing default industries:', error);
    }
};

// Call the initialization function
initializeDefaultIndustries();

export default Industry;
