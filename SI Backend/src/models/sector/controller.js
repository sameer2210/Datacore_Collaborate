import { getAllSectors as getAllSectorsService } from './service.js';
import SectorDto from './dto.js';

export async function getAllSectors(req, res, next) {
    try {
        const search = req.query.search;
        const sectors = await getAllSectorsService(search);
        const sectorDtos = sectors.map(sector => new SectorDto(sector));
        res.json(sectorDtos);
    } catch (error) {
        next(error);
    }
}

