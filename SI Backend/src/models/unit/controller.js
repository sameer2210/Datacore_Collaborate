import { getAllUnits as getAllUnitsService } from './service.js';

export const getUnits = async (req, res) => {
    try {
        const { search, categories } = req.query;

        // Parse categories if present
        const parsedCategories = categories ? categories.split(',') : [];

        const units = await getAllUnitsService(search, parsedCategories);

        res.status(200).json({
            success: true,
            data: units,
            message: 'Units retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'An error occurred while retrieving units'
        });
    }
};
