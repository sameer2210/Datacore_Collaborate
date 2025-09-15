class SectorDto {
    constructor(sector) {
        this.id = sector._id;  // Use MongoDB's default '_id'
        this.name = sector.name;
    }
}

export class SectorResponseDto {
    constructor(sector) {
        this.id = sector._id;
        this.name = sector.name;
    }
}

export default SectorDto;
