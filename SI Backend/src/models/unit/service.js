import Unit from "./model.js";
import UnitDto from "./dto.js";

export async function getUnitById(id) {
    try {
        const unit = await Unit.findById(id);
        return unit ? UnitDto(unit) : null;
    } catch (error) {
        throw new Error("Error retrieving unit by ID from the database.");
    }
}

export async function getUnitByName(name) {
    try {
        const unit = await Unit.findOne({ name });
        return unit ? UnitDto(unit) : null;
    } catch (error) {
        throw new Error("Error retrieving unit by name from the database.");
    }
}

export async function getAllUnits(search, categories) {
    try {
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (categories && categories.length > 0) {
            query.category = { $in: categories };
        }

        const units = await Unit.find(query).sort({ name: 1 });
        return units.map(unit => UnitDto(unit));
    } catch (error) {
        throw new Error("Error retrieving units from the database.");
    }
}

