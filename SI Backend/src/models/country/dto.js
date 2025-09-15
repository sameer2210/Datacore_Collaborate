class CountryDto {
    constructor(country) {
        this.id = country._id;  // Use MongoDB's default '_id'
        this.name = country.name;
        this.currency = country.currency;
    }
}

export class CountryResponseDto {
    constructor(country) {
        this.id = country._id;
        this.name = country.name;
        this.currency = country.currency;
    }
}

export default CountryDto;
