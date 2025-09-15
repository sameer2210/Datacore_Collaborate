class IndustryDto {
    constructor(industry) {
        this.id = industry._id;  // Use MongoDB's default '_id'
        this.name = industry.name;
        this.sector = industry.sector;
    }
}

class IndustryResponseDto {
    constructor(industry) {
        this.id = industry._id;
        this.name = industry.name;
    }
}

export default IndustryDto
export { IndustryDto, IndustryResponseDto };
