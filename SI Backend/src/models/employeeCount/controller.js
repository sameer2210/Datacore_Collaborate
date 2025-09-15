import { getAllEmployeeCounts as getAllEmployeeCountsService } from './service.js';
import EmployeeCountDto from './dto.js';

export async function getAllEmployeeCounts(req, res, next) {
    try {
        const search = req.query.search;
        const employeeCounts = await getAllEmployeeCountsService(search);
        const employeeCountDtos = employeeCounts.map(sector => new EmployeeCountDto(sector));
        res.json(employeeCountDtos);
    } catch (error) {
        next(error);
    }
}

