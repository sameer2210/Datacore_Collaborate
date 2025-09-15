class EmployeeCountDto {
    constructor(employeeCount) {
        this.id = employeeCount._id;  // Use MongoDB's default '_id'
        this.name = employeeCount.name;
    }
}


export class EmployeeCountResponseDto {
    constructor(employeeCount) {
        this.id = employeeCount._id;
        this.name = employeeCount.name;
    }
}

export default EmployeeCountDto;

