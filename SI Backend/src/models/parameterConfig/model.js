import mongoose from 'mongoose';

const parameterConfigSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['1', '2', 'V shape', 'Binary']
    },
    lowerBound: {
        type: Number,
        required: true
    },
    upperBound: {
        type: Number,
        required: true
    },
    middleBound: {
        type: Number,
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const ParameterConfig = mongoose.model('ParameterConfig', parameterConfigSchema);

// const values = [
//     {
//         "code": "B1",
//         "weight": 10.2,
//         "type": "2",
//         "lowerBound": 200,
//         "upperBound": 533.79,
//         "middleBound": ""
//     },
//     {
//         "code": "B2",
//         "weight": 12.26,
//         "type": "2",
//         "lowerBound": 124.63,
//         "upperBound": 550.96,
//         "middleBound": ""
//     },
//     {
//         "code": "B3",
//         "weight": 38.68,
//         "type": "2",
//         "lowerBound": 0,
//         "upperBound": 1.34,
//         "middleBound": ""
//     },
//     {
//         "code": "B4",
//         "weight": 6.3,
//         "type": "2",
//         "lowerBound": 5.49,
//         "upperBound": 25.29,
//         "middleBound": ""
//     },
//     {
//         "code": "B5",
//         "weight": 21.48,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 1,
//         "middleBound": ""
//     },
//     {
//         "code": "B6",
//         "weight": 11.08,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 50,
//         "middleBound": ""
//     },
//     {
//         "code": "E1",
//         "weight": 15.49,
//         "type": "2",
//         "lowerBound": 3120000,
//         "upperBound": 5450000,
//         "middleBound": ""
//     },
//     {
//         "code": "E2",
//         "weight": 2.74,
//         "type": "2",
//         "lowerBound": 42050000,
//         "upperBound": 110300000,
//         "middleBound": ""
//     },
//     {
//         "code": "E3",
//         "weight": 7.01,
//         "type": "2",
//         "lowerBound": 3530000,
//         "upperBound": 7300000,
//         "middleBound": ""
//     },
//     {
//         "code": "E4",
//         "weight": 9.2,
//         "type": "2",
//         "lowerBound": 0,
//         "upperBound": 100,
//         "middleBound": ""
//     },
//     {
//         "code": "E5",
//         "weight": 8.47,
//         "type": "2",
//         "lowerBound": 8582,
//         "upperBound": 48528,
//         "middleBound": ""
//     },
//     {
//         "code": "E6",
//         "weight": 8.47,
//         "type": "2",
//         "lowerBound": 210,
//         "upperBound": 2701,
//         "middleBound": ""
//     },
//     {
//         "code": "E7",
//         "weight": 23.78,
//         "type": "2",
//         "lowerBound": 0,
//         "upperBound": 20,
//         "middleBound": ""
//     },
//     {
//         "code": "E8",
//         "weight": 6.07,
//         "type": "2",
//         "lowerBound": 0,
//         "upperBound": 85,
//         "middleBound": ""
//     },
//     {
//         "code": "E9",
//         "weight": 18.78,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 100,
//         "middleBound": ""
//     },
//     {
//         "code": "S1",
//         "weight": 13.4,
//         "type": "V shape",
//         "lowerBound": 0.79,
//         "upperBound": 4,
//         "middleBound": 2.35
//     },
//     {
//         "code": "S2",
//         "weight": 5.9,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 40,
//         "middleBound": ""
//     },
//     {
//         "code": "S3",
//         "weight": 6.05,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 50,
//         "middleBound": ""
//     },
//     {
//         "code": "S4",
//         "weight": 12.27,
//         "type": "1",
//         "lowerBound": 3.1,
//         "upperBound": 7,
//         "middleBound": ""
//     },
//     {
//         "code": "S5",
//         "weight": 11.71,
//         "type": "1",
//         "lowerBound": 18.7,
//         "upperBound": 40,
//         "middleBound": ""
//     },
//     {
//         "code": "S6",
//         "weight": 18.28,
//         "type": "Binary",
//         "lowerBound": 0,
//         "upperBound": 1,
//         "middleBound": ""
//     },
//     {
//         "code": "S7",
//         "weight": 27.89,
//         "type": "2",
//         "lowerBound": 0.21,
//         "upperBound": 0.95,
//         "middleBound": ""
//     },
//     {
//         "code": "S8",
//         "weight": 4.51,
//         "type": "1",
//         "lowerBound": 26,
//         "upperBound": 49,
//         "middleBound": ""
//     },
//     {
//         "code": "G1",
//         "weight": 5.27,
//         "type": "Binary",
//         "lowerBound": 0,
//         "upperBound": 1,
//         "middleBound": ""
//     },
//     {
//         "code": "G2",
//         "weight": 5.24,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 50,
//         "middleBound": ""
//     },
//     {
//         "code": "G3",
//         "weight": 12.5,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 5,
//         "middleBound": ""
//     },
//     {
//         "code": "G4",
//         "weight": 9.02,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 5,
//         "middleBound": ""
//     },
//     {
//         "code": "G5",
//         "weight": 7.51,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 0.2,
//         "middleBound": ""
//     },
//     {
//         "code": "G6",
//         "weight": 14.24,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 26.1,
//         "middleBound": ""
//     },
//     {
//         "code": "G7",
//         "weight": 19.49,
//         "type": "Binary",
//         "lowerBound": 0,
//         "upperBound": 1,
//         "middleBound": ""
//     },
//     {
//         "code": "G8",
//         "weight": 9.9,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 100,
//         "middleBound": ""
//     },
//     {
//         "code": "G9",
//         "weight": 4.12,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 12,
//         "middleBound": ""
//     },
//     {
//         "code": "G10",
//         "weight": 12.71,
//         "type": "1",
//         "lowerBound": 0,
//         "upperBound": 5,
//         "middleBound": ""
//     }
// ]

// const enterValues = async () => {
//     console.log("start entry");
//     try {
//         for (const value of values) {
//             await ParameterConfig.create(value);
//         }
//         console.log('All parameter configurations have been created successfully.');
//     } catch (error) {
//         console.error('Error creating parameter configurations:', error);
//     }
// };

// enterValues();

export default ParameterConfig;