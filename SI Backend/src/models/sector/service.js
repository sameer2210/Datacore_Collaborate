import Sector from "./model.js";

export async function getAllSectors(search) {
    try {
        const query = search ? { name: { $regex: search, $options: "i" } } : {};
        const sectors = await Sector.find(query).sort({ name: 1 });
        return sectors;
    } catch (error) {
        throw new Error("Error retrieving sectors from the database.");
    }
}

export async function validateSector(id) {
    try {
        const sector = await Sector.findById(id);
        if (!sector)
            return false;

        return true;
    } catch (error) {
        return false;
    }
}



