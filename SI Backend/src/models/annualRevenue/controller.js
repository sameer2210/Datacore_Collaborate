import { getAllAnnualRevenues as getAllAnnualRevenuesService } from './service.js';
import AnnualRevenueDto from './dto.js';

export async function getAllAnnualRevenues(req, res, next) {
    try {
        const search = req.query.search;
        const annualRevenues = await getAllAnnualRevenuesService(search);
        const annualRevenueDtos = annualRevenues.map(sector => new AnnualRevenueDto(sector));
        res.json(annualRevenueDtos);
    } catch (error) {
        next(error);
    }
}

