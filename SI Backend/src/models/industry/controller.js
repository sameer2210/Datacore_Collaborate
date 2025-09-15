import { getAllIndustries as getAllIndustriesService } from './service.js';
import IndustryDto from './dto.js';

export async function getAllIndustries(req, res, next) {
    try {
        const search = req.query.search;
        const sector = req.params.sector;
        const industries = await getAllIndustriesService(search, sector);
        const industyDtos = industries.map(industry => new IndustryDto(industry));
        res.json(industyDtos);
    } catch (error) {
        next(error);
    }
}

