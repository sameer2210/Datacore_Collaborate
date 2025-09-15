import mongoose from 'mongoose';

const employeeCountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});



const EmployeeCount = mongoose.model('EmployeeCount', employeeCountSchema);

export default EmployeeCount;
