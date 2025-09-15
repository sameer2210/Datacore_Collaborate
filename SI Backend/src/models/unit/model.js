import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
    }
});

// Add initial data
// unitSchema.statics.initialData = [
//     { name: "Tonne", category: "weight" },
//     { name: "Barrel", category: "volume" }
// ];

// const units = [
//     { name: "Litre", category: "weight" },
//     { name: "Cubic meter", category: "weight" },
//     { name: "Barrel", category: "weight" },
//     { name: "Square meter", category: "weight" },
//     { name: "Hectare", category: "weight" },
//     { name: "Square kilometer", category: "weight" },
//     { name: "Kilogram", category: "weight" },
//     { name: "Ton", category: "weight" },
//     { name: "Pound", category: "weight" },
//     { name: "Pieces", category: "weight" },
//     { name: "Dozen", category: "weight" },
//     { name: "Meter", category: "weight" },
//     { name: "Kilometer", category: "weight" },
//     { name: "Foot", category: "weight" },
//     { name: "Hour", category: "weight" },
//     { name: "Day", category: "weight" },
//     { name: "Month", category: "weight" },
//     { name: "Year", category: "weight" },
//     { name: "Kilowatt-hour", category: "weight" },
//     { name: "Megajoule", category: "weight" }
// ];

const Unit = mongoose.model('Unit', unitSchema);

// async function storeUnits(units) {
//     try {
//         const results = await Promise.all(units.map(async (unit) => {
//             try {
//                 const newUnit = new Unit(unit);
//                 await newUnit.save();
//                 return { success: true, unit: unit.name };
//             } catch (error) {
//                 console.error(`Error saving unit ${unit.name}:`, error.message);
//                 return { success: false, unit: unit.name, error: error.message };
//             }
//         }));

//         const successCount = results.filter(result => result.success).length;
//         console.log(`Successfully added ${successCount} out of ${units.length} units`);

//         return results;
//     } catch (error) {
//         console.error("Error in storeUnits function:", error);
//         throw error;
//     }
// }

// storeUnits(units);

export default Unit;
