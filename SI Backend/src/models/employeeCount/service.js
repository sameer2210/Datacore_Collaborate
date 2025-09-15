import EmployeeCount from "./model.js";

export async function getAllEmployeeCounts(search) {
    try {
        const query = search ? { name: { $regex: search, $options: "i" } } : {};
        const employeeCounts = await EmployeeCount.find(query).lean();

        // Custom sorting function
        employeeCounts.sort((a, b) => {
            const getOrder = (name) => {
                const parseRange = (range) => {
                    const [start, end] = range.split('-').map(num => parseInt(num.trim().replace(/[^0-9]/g, ''), 10));
                    return { start: isNaN(start) ? 0 : start, end: isNaN(end) ? Infinity : end };
                };

                if (name.includes('<')) return -Infinity;
                if (name.includes('>')) return Infinity;

                const { start } = parseRange(name);
                return start;
            };

            return getOrder(a.name) - getOrder(b.name);
        });

        return employeeCounts;
    } catch (error) {
        throw new Error("Error retrieving Employee Counts from the database.");
    }
}


export async function validateEmployeeCount(id) {
    try {
        const employeeCount = await EmployeeCount.findById(id);
        if (!employeeCount)
            return false;

        return true;
    }
    catch (error) {
        return false;
    }
}
