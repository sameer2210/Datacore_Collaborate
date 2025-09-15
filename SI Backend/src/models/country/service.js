import Country from "./model.js";

export async function getAllCountries(search) {
    try {
        const query = search ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { currency: { $regex: search, $options: "i" } }
            ]
        } : {};
        const countries = await Country.find(query).sort({ name: 1 });
        return countries;
    } catch (error) {
        throw new Error("Error retrieving countries from the database.");
    }
}

export async function validateCountry(id) {
    try {
        const country = await Country.findById(id);
        if (!country)
            return false;

        return true;
    } catch (error) {
        return false;
    }
}

