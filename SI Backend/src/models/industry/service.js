import Industry from "./model.js";

export async function getAllIndustries(search, sector) {
    try {
        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        if (sector)
            query.sector = sector;

        const industries = await Industry.find(query).sort({ name: 1 });
        return industries;
    } catch (error) {
        throw new Error("Error retrieving industries from the database.");
    }
}

export async function validateIndustry(id) {
    try {
        const industry = await Industry.findById(id);
        if (!industry)
            return false;

        return true;
    } catch (error) {
        return false;
    }
}
