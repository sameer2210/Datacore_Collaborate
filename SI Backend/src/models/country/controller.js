import { getAllCountries as getAllCountriesService } from './service.js';
import CountryDto from './dto.js';

export async function getAllCountries(req, res, next) {
    try {
        const search = req.query.search;
        const countries = await getAllCountriesService(search);
        const countryDtos = countries.map(country => new CountryDto(country));
        res.json(countryDtos);
    } catch (error) {
        next(error);
    }
}

