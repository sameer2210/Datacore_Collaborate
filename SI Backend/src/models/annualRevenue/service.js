import AnnualRevenue from "./model.js";

export async function getAllAnnualRevenues(search) {
    try {
        const query = search ? { name: { $regex: search, $options: "i" } } : {};
        const annualRevenues = await AnnualRevenue.find(query);

        // Custom sorting function
        const sortedAnnualRevenues = annualRevenues.sort((a, b) => {
            const getValue = (str) => {
                const match = str.match(/\$(\d+(?:\.\d+)?)\s*(million|billion|trillion)?/i);
                if (!match) return 0;

                let value = parseFloat(match[1]);
                const unit = match[2]?.toLowerCase();

                if (unit === 'million') value *= 1e6;
                else if (unit === 'billion') value *= 1e9;
                else if (unit === 'trillion') value *= 1e12;

                return value;
            };

            return getValue(a.name) - getValue(b.name);
        });

        return sortedAnnualRevenues;
    } catch (error) {
        throw new Error("Error retrieving Annual Revenues from the database.");
    }
}


export async function validateannualRevenue(id) {
    try {
        const annualRevenue = await AnnualRevenue.findById(id);
        if (!annualRevenue)
            return false;

        return true;
    }
    catch (error) {
        return false;
    }
}
