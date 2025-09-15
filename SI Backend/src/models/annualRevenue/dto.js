class AnnualRevenueDto {
    constructor(annualRevenue) {
        this.id = annualRevenue._id;  // Use MongoDB's default '_id'
        this.name = annualRevenue.name;
    }
}


export class AnnualRevenueResponseDto {
    constructor(annualRevenue) {
        this.id = annualRevenue._id;
        this.name = annualRevenue.name;
    }
}

export default AnnualRevenueDto;

