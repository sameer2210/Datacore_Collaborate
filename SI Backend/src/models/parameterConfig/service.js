import ParameterConfig from "./model.js";
import Country from "../country/model.js";

const calculationB1 = async (data) => {
    const { B1: B1Data } = data;
    const { scope1Emissions, scope2Emissions, grossRevenue } = B1Data
    if (scope1Emissions?.value==null || scope2Emissions?.value==null || grossRevenue?.value==null || grossRevenue.value == 0)
    {
        return await caluteOtherValues(null, "B1");

    }


    const kpiValue = (scope1Emissions.value + scope2Emissions.value) / grossRevenue.value;

    return await caluteOtherValues(kpiValue, "B1");
}

const calculationB2 = async (data) => {
    const { B1: B1Data, B2: B2Data } = data

    const { grossRevenue } = B1Data;
    const { totalWaterConsumption } = B2Data
    if (totalWaterConsumption?.value == null || grossRevenue?.value==null || grossRevenue.value == 0 )
    {
        return await caluteOtherValues(null, "B2");
    }
        

    const kpiValue = totalWaterConsumption.value / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "B2");
}

const calculationB3 = async (data) => {
    const { B1: B1Data, B3: B3Data } = data

    const { grossRevenue } = B1Data;
    const { totalHazardousWaste } = B3Data;
    if (totalHazardousWaste?.value == null || grossRevenue?.value == null || grossRevenue.value == 0)
    {
        return await caluteOtherValues(null, "B3");

    }

    const kpiValue = totalHazardousWaste.value / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "B3");
}

const calculationB4 = async (data) => {
    const { B1: B1Data, B4: B4Data } = data

    const { grossRevenue } = B1Data;
    const { totalNonHazardousWaste } = B4Data;
    if (totalNonHazardousWaste?.value == null || grossRevenue?.value == null || grossRevenue.value == 0 )
    {
        return await caluteOtherValues(null, "B4");

    }

    const kpiValue = totalNonHazardousWaste.value / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "B4");
}

const calculationB5 = async (data) => {
    const { B5: B5Data } = data

    const { Y1, Y2, Y3 } = B5Data
    if (Y1?.value==null || Y2?.value==null || Y3?.value==null )
    {
        return await caluteOtherValues(null, "B5");

    }

    const kpiValue = (Y1.value + Y2.value + Y3.value) / 3;
    return await caluteOtherValues(kpiValue, "B5");
}

//Doubt
// const calculationB6 = async (data,countryId,year) => {
//     const { B6: B6Data } = data

//     const { totalElectricityConsumption, electricityFromGrid, recPurchased, electricityFromRenewables } = B6Data
//    if (totalElectricityConsumption?.value == null || electricityFromGrid?.value == null || recPurchased?.value == null || electricityFromRenewables?.value == null || totalElectricityConsumption.value == 0) 
//     {
//         return await caluteOtherValues(null, "B6");
//     }

//     const countryDetails = await Country.findById(countryId);
//     console.log(countryDetails,"countryDetails");
//     let cleanElectricityFactor = 1;

//     if(countryDetails && countryDetails.cleanElectricityFactor) {
//         cleanElectricityFactor = countryDetails.cleanElectricityFactor
//         console.log(cleanElectricityFactor,"cleanElectricityFactor");
//     }

//     const kpiValue = ((cleanElectricityFactor*electricityFromGrid.value + recPurchased.value + electricityFromRenewables.value) / totalElectricityConsumption.value) * 100;
//     return await caluteOtherValues(kpiValue, "B6");
// }

const calculationB6 = async (data, countryId, year) => {
    const { B6: B6Data } = data;

    const { totalElectricityConsumption, electricityFromGrid, recPurchased, electricityFromRenewables } = B6Data;

    if (
        totalElectricityConsumption?.value == null || 
        electricityFromGrid?.value == null || 
        recPurchased?.value == null || 
        electricityFromRenewables?.value == null || 
        totalElectricityConsumption.value == 0
    ) {
        return await caluteOtherValues(null, "B6");
    }

    const countryDetails = await Country.findById(countryId);
    console.log(countryDetails, "countryDetails");

    let cleanElectricityFactor = 1;

    if (countryDetails && countryDetails.cleanElectricityFactor) {
        // Find the clean electricity factor for the given year
        const factorForYear = countryDetails.cleanElectricityFactor.find(factor => factor.year === year);
        
        if (factorForYear) {
            cleanElectricityFactor = factorForYear.value / 100; // Divide by 100 to get the actual factor
            console.log(cleanElectricityFactor, "cleanElectricityFactor");
        }
    }

    console.log(cleanElectricityFactor, "cleanElectricityFactor");

    const kpiValue = ((cleanElectricityFactor * electricityFromGrid.value + recPurchased.value + electricityFromRenewables.value) / totalElectricityConsumption.value) * 100;
    return await caluteOtherValues(kpiValue, "B6");
};


// const caluteOtherValues = async (kpiValue, code) => {
//     console.log(kpiValue,code,"code");
//     const parameterConfig = await ParameterConfig.findOne({ code: code });
//     console.log(parameterConfig,"parameterConfig");

//     const listCode = ['B1','B2','B3','B4','E1','E2','E3','E4','E5','E6','E7','E8','E9'];

//     if(kpiValue==null) {

//         if(listCode.includes(code))
//         {
//             return {
//                 score: 0.4*parameterConfig.weight,
//                 normalizedValue: 0.4,
//                 kpiValue: 0
//             };

//         }
//         else
//         {
//             return {
//                 score: 0,
//                 normalizedValue: 0,
//                 kpiValue: 0
//             };
//         }
       
//     }

    

    
//     kpiValue = parseFloat(kpiValue.toFixed(2));

//     const { weight, type, lowerBound, upperBound, middleBound } = parameterConfig;
//     let normalizedValue;

//     if (type === "1") {
//         // if (kpiValue < lowerBound)
//         //     normalizedValue = 0

//         // else if (kpiValue > upperBound)
//         //     normalizedValue = 1

//         // else
//         // =(1-(0.6*(K24-M24))/(K24-J24))

//         if(listCode.includes(code))
//         normalizedValue = (1-(0.6*(upperBound-kpiValue))/(upperBound-lowerBound));

//         else
//         normalizedValue = (kpiValue - lowerBound) / (upperBound - lowerBound);
//     }
//     else if (type === "2") {
//         // console.log(kpiValue, lowerBound, upperBound);
//         // if (kpiValue < lowerBound)
//         //     normalizedValue = 1

//         // else if (kpiValue > upperBound)
//         //     normalizedValue = 0

//         // else
//         //     normalizedValue=(1-(0.6*(J2-M2))/(J2-K2))

//         if(listCode.includes(code))
//             normalizedValue = (1-(0.6*(lowerBound-kpiValue))/(lowerBound-upperBound));

//         else
//         normalizedValue = (kpiValue - upperBound) / (lowerBound - upperBound);
//     }
//     else if (type == "Binary") {
//         normalizedValue = kpiValue;
//     }
//     else if (type == "V shape") {
//         if (kpiValue < middleBound) {
//             normalizedValue = (kpiValue - lowerBound) / (middleBound - lowerBound);
//         }
//         else {
//             normalizedValue = (kpiValue - upperBound) / (middleBound - upperBound);
//         }

//     }

//     normalizedValue = parseFloat(normalizedValue.toFixed(2));
//     let score = normalizedValue * weight;
//     score = parseFloat(score.toFixed(2));

//     return {
//         score: score,
//         normalizedValue: normalizedValue,
//         kpiValue: kpiValue
//     }
// }


const caluteOtherValues = async (kpiValue, code) => {
    console.log(kpiValue, code, "code");

    if (kpiValue == null || kpiValue === "") {
        return {
            score: 0,
            normalizedValue: 0,
            kpiValue: null
        };
    }

    const parameterConfig = await ParameterConfig.findOne({ code: code });
    console.log(parameterConfig, "parameterConfig");

    const listCode = ['B1', 'B2', 'B3', 'B4', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'];


    kpiValue = parseFloat(kpiValue.toFixed(3));

    const { weight, type, lowerBound, upperBound, middleBound } = parameterConfig;
    let normalizedValue;



    if (code === 'E9' && type === "1") {
        if (kpiValue == null || kpiValue === "") {
            normalizedValue = 0;
        } else {
            const calculatedValue = 1 - (0.6 * (upperBound - kpiValue)) / (upperBound - lowerBound);
            if (calculatedValue > 1) {
                normalizedValue = 1;
            } else if (calculatedValue < 0.4) {
                normalizedValue = 0.4;
            } else {
                normalizedValue = calculatedValue;
            } 
        }
    } else if (code === 'S7' && type === "2") {
        if (kpiValue == null || kpiValue === "") {
            normalizedValue = 0;
        } else {
            const calculatedValue = (kpiValue - upperBound) / (lowerBound - upperBound);
            if (calculatedValue > 1) {
                normalizedValue = 1;
            } else if (calculatedValue < 0) {
                normalizedValue = 0;
            } else {
                normalizedValue = calculatedValue;
            }
        }
    } else if (type === "1") {
        if (kpiValue == null || kpiValue === "") {
            normalizedValue = 0;
        } else {
            const calculatedValue = (kpiValue - lowerBound) / (upperBound - lowerBound);
            if (calculatedValue > 1) {
                normalizedValue = 1;
            } else if (calculatedValue < 0) {
                normalizedValue = 0;
            } else {
                normalizedValue = calculatedValue;
            }
        }
    } else if (type === "2") {
        if (kpiValue == null || kpiValue === "") {
            normalizedValue = 0;
        } else {
            const calculatedValue = (1 - (0.6 * (lowerBound - kpiValue)) / (lowerBound - upperBound));
            if (calculatedValue > 1) {
                normalizedValue = 1;
            } else if (calculatedValue < 0.4) {
                normalizedValue = 0.4;
            } else {
                normalizedValue = calculatedValue;
            }
        }
    } else if (type == "Binary") {
        if (kpiValue == 1) {
            normalizedValue = 1;
        } else if (kpiValue == null || kpiValue === "") {
            normalizedValue = 0;
        } else {
            normalizedValue = 0;
        }
    } else if (type == "V shape") {
        if (kpiValue == null || kpiValue === "") {
            normalizedValue = 0;
        } else if (kpiValue < middleBound) {
            const calculatedValue = (kpiValue - lowerBound) / (middleBound - lowerBound);
            if (calculatedValue > 1) {
                normalizedValue = 1;
            } else if (calculatedValue < 0) {
                normalizedValue = 0;
            } else {
                normalizedValue = calculatedValue;
            }
        } else {
            const calculatedValue = (kpiValue - upperBound) / (middleBound - upperBound);
            if (calculatedValue > 1) {
                normalizedValue = 1;
            } else if (calculatedValue < 0) {
                normalizedValue = 0;
            } else {
                normalizedValue = calculatedValue;
            }
        }
    }

    normalizedValue = parseFloat(normalizedValue.toFixed(3));
    console.log(normalizedValue, "normalizedValue");
    let score = normalizedValue * weight;
    score = parseFloat(score.toFixed(3));

    return {
        score: score,
        normalizedValue: normalizedValue,
        kpiValue: kpiValue
    };
};



const calculationE1 = async (data) => {
    const { E1: E1Data } = data;

    const { scope1Emissions, scope2Emissions } = E1Data;
    if (scope1Emissions?.value==null || scope2Emissions?.value==null)
        return await caluteOtherValues(null, "E1");

    const kpiValue = scope1Emissions.value + scope2Emissions.value;
    return await caluteOtherValues(kpiValue, "E1");
}

const calculationE2 = async (data) => {
    const { E2: E2Data } = data;

    const { scope3Emissions } = E2Data;
    if (scope3Emissions?.value==null)
        return await caluteOtherValues(null, "E2");

    const kpiValue = scope3Emissions.value;
    return await caluteOtherValues(kpiValue, "E2");
}

const calculationE3 = async (data) => {
    const { E3: E3Data } = data;

    const { waterConsumed } = E3Data;
    if (waterConsumed?.value==null)
        return await caluteOtherValues(null, "E3");

    const kpiValue = waterConsumed.value;
    return await caluteOtherValues(kpiValue, "E3");
}

//Doubt
const calculationE4 = async (data,totalHazardousWaste,totalNonHazardousWaste) => {
    const { E4: E4Data } = data;

    const { wasteToLandfill } = E4Data;
    if (wasteToLandfill?.value==null || totalHazardousWaste.value==null || totalNonHazardousWaste.value==null || totalHazardousWaste.value+totalNonHazardousWaste.value==0)
        return await caluteOtherValues(null, "E4");

    const kpiValue = (wasteToLandfill.value*100)/(totalHazardousWaste.value+totalNonHazardousWaste.value);
    console.log(kpiValue,"kpiValue11111");
    return await caluteOtherValues(kpiValue, "E4");
}

const calculationE5 = async (data) => {
    const { E5: E5Data } = data;

    const { noxReleased } = E5Data;
    if (noxReleased?.value==null)
        return await caluteOtherValues(null, "E5");

    const kpiValue = noxReleased.value;
    return await caluteOtherValues(kpiValue, "E5");
}

const calculationE6 = async (data) => {
    const { E6: E6Data } = data;

    const { soxReleased } = E6Data;
    if (soxReleased?.value==null)
        return await caluteOtherValues(null, "E6");

    const kpiValue = soxReleased.value;
    return await caluteOtherValues(kpiValue, "E6");
}

const calculationE7 = async (data) => {
    const { E7: E7Data } = data;

    const { h2sConcentration } = E7Data;
    if (h2sConcentration?.value==null)
        return await caluteOtherValues(null, "E7");

    const kpiValue = h2sConcentration.value;
    return await caluteOtherValues(kpiValue, "E7");
}

const calculationE8 = async (data) => {
    const { E8: E8Data } = data;

    const { noiseLevel } = E8Data;
    if (noiseLevel?.value==null)
        return await caluteOtherValues(null, "E8");

    const kpiValue = noiseLevel.value;
    return await caluteOtherValues(kpiValue, "E8");
}

const calculationE9 = async (data) => {
    const { E9: E9Data } = data;

    const { wasteWaterTreated, totalWasteWater } = E9Data;
    if (wasteWaterTreated?.value==null || totalWasteWater?.value==null || totalWasteWater.value == 0)
        return await caluteOtherValues(null, "E9");

    const kpiValue = (wasteWaterTreated.value * 100) / totalWasteWater.value;
    return await caluteOtherValues(kpiValue, "E9");
}

const calculationS1 = async (data) => {
    const { S1: S1Data } = data;
    const { totalMen, totalWomen, totalNonBinary } = S1Data;
    if (totalMen?.value==null || totalWomen?.value==null ||  totalMen.value + totalWomen.value==0)
        return await caluteOtherValues(null, "S1");

    const totalEmployees = totalMen.value + totalWomen.value;
    const kpiValue = totalMen.value / totalEmployees;
    return await caluteOtherValues(kpiValue, "S1");
}

const calculationS2 = async (data) => {
    const { S2: S2Data, S1: S1Data } = data;
    const { foreignEmployees } = S2Data;
    const { totalMen, totalWomen } = S1Data;
    if (foreignEmployees?.value==null || totalMen?.value==null || totalWomen?.value==null || totalMen.value + totalWomen.value + foreignEmployees.value==0)
        return await caluteOtherValues(null, "S2");

    const kpiValue = (foreignEmployees.value * 100) / (totalMen.value + totalWomen.value + foreignEmployees.value);
    return await caluteOtherValues(kpiValue, "S2");
}

const calculationS3 = async (data) => {
    const { S3: S3Data } = data;
    const { directEmployees, indirectEmployees } = S3Data;
    if (directEmployees?.value==null || indirectEmployees?.value==null || indirectEmployees.value==0)
        return await caluteOtherValues(null, "S3");

    const kpiValue = directEmployees.value / indirectEmployees.value;
    return await caluteOtherValues(kpiValue, "S3");
}

const calculationS4 = async (data) => {
    const { S4: S4Data } = data;
    const { averageTenure } = S4Data;
    if (averageTenure?.value==null)
        return await caluteOtherValues(null, "S4");

    const kpiValue = averageTenure.value;
    return await caluteOtherValues(kpiValue, "S4");
}

const calculationS5 = async (data) => {
    const { S5: S5Data } = data;
    const { trainingHours } = S5Data;
    if (trainingHours?.value==null)
        return await caluteOtherValues(null, "S5");

    const kpiValue = trainingHours.value;
    return await caluteOtherValues(kpiValue, "S5");
}

const calculationS6 = async (data) => {
    const { S6: S6Data } = data;
    const { nonDiscriminatoryPolicy } = S6Data;
    if (nonDiscriminatoryPolicy?.value == null)
        return await caluteOtherValues(null, "S6");

    const kpiValue = nonDiscriminatoryPolicy.value ? 1 : 0;
    return await caluteOtherValues(kpiValue, "S6");
}

const calculationS7 = async (data) => {
    const { S7: S7Data } = data;
    const { trir } = S7Data;
    if (trir?.value==null)
        return await caluteOtherValues(null, "S7");

    const kpiValue = trir.value;
    return await caluteOtherValues(kpiValue, "S7");
}

const calculationS8 = async (data) => {
    const { S8: S8Data } = data;
    const { campusHires } = S8Data;
    if (campusHires?.value==null)
        return await caluteOtherValues(null, "S8");

    const kpiValue = campusHires.value;
    return await caluteOtherValues(kpiValue, "S8");
}


const calculationG1 = async (data) => {
    const { G1: G1Data } = data;
    const { taxReliefReceived } = G1Data;
    if (taxReliefReceived?.value==null)
        return await caluteOtherValues(null, "G1");

    const kpiValue = taxReliefReceived.value ? 0 : 1;
    return await caluteOtherValues(kpiValue, "G1");
}

const calculationG2 = async (data) => {
    const { G2: G2Data } = data;
    const { pensionContribution } = G2Data;
    if (pensionContribution?.value == null)
        return await caluteOtherValues(null, "G2");

    const kpiValue = pensionContribution.value;
    return await caluteOtherValues(kpiValue, "G2");
}

const calculationG3 = async (data, grossRevenue) => {
    const { G3: G3Data } = data;
    const { localSuppliersSpending } = G3Data;
    if (localSuppliersSpending?.value==null || grossRevenue?.value==null || grossRevenue.value==0)
        return await caluteOtherValues(null, "G3");

    const kpiValue = (localSuppliersSpending.value * 100) / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "G3");
}

const calculationG4 = async (data, grossRevenue) => {
    const { G4: G4Data } = data;
    const { newSuppliersSpending } = G4Data;
    if (newSuppliersSpending?.value==null || grossRevenue?.value==null || grossRevenue.value==0)
        return await caluteOtherValues(null, "G4");

    const kpiValue = (newSuppliersSpending.value * 100) / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "G4");
}

const calculationG5 = async (data, grossRevenue) => {
    const { G5: G5Data } = data;
    const { localCommunitiesSpending } = G5Data;
    if (localCommunitiesSpending?.value==null || grossRevenue?.value==null || grossRevenue.value==0)
        return await caluteOtherValues(null, "G5");

    const kpiValue = (localCommunitiesSpending.value * 100) / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "G5");
}

const calculationG6 = async (data, grossRevenue) => {
    const { G6: G6Data } = data;
    const { innovativeTechnologiesSpending } = G6Data;
    if (innovativeTechnologiesSpending?.value==null || grossRevenue?.value==null || grossRevenue.value==0)
        return await caluteOtherValues(null, "G6");

    const kpiValue = (innovativeTechnologiesSpending.value * 100) / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "G6");
}

const calculationG7 = async (data) => {
    const { G7: G7Data } = data;
    const { ethicsPolicyInPlace } = G7Data;
    if (ethicsPolicyInPlace.value == null)
        return await caluteOtherValues(null, "G7");

    const kpiValue = ethicsPolicyInPlace.value ? 1 : 0;
    return await caluteOtherValues(kpiValue, "G7");
}

const calculationG8 = async (data) => {
    const { G8: G8Data } = data;
    const { totalComplaints, resolvedComplaints } = G8Data;
    if (totalComplaints?.value==null || resolvedComplaints?.value==null || totalComplaints.value == 0)
    {
        // Special case: if both are zero, set KPI value to 100
        if (totalComplaints?.value === 0 && resolvedComplaints?.value === 0) {
            return await caluteOtherValues(100, "G8");
        }
        return await caluteOtherValues(null, "G8");
    }
    const kpiValue = (resolvedComplaints.value * 100) / totalComplaints.value;
    return await caluteOtherValues(kpiValue, "G8");
}

const calculationG9 = async (data) => {
    const { G9: G9Data } = data;
    const { boardMembers } = G9Data;
    if (boardMembers?.value==null)
        return await caluteOtherValues(null, "G9");

    const kpiValue = boardMembers.value;
    return await caluteOtherValues(kpiValue, "G9");
}

const calculationG10 = async (data, grossRevenue) => {
    const { G10: G10Data } = data;
    const { csrSpending } = G10Data;
    if (csrSpending?.value==null || grossRevenue?.value==null || grossRevenue.value==0)
        return await caluteOtherValues(null, "G10");

    const kpiValue = (csrSpending.value * 100) / grossRevenue.value;
    return await caluteOtherValues(kpiValue, "G10");
}

export const sectionBScoreCard = async (data,Country,year) => {

    const B1Score = await calculationB1(data);
    const B2Score = await calculationB2(data);
    const B3Score = await calculationB3(data);
    const B4Score = await calculationB4(data);
    const B5Score = await calculationB5(data);
    const B6Score = await calculationB6(data,Country,year);  

    const sectionScore = B1Score.score + B2Score.score + B3Score.score + B4Score.score + B5Score.score + B6Score.score;
    const sectionGrade = getGrade(sectionScore);

    data.B1 = { ...data.B1, ...B1Score };
    data.B2 = { ...data.B2, ...B2Score };
    data.B3 = { ...data.B3, ...B3Score };
    data.B4 = { ...data.B4, ...B4Score };
    data.B5 = { ...data.B5, ...B5Score };
    data.B6 = { ...data.B6, ...B6Score };
    data.score = sectionScore;
    data.grade = sectionGrade;

    return data;
}

export const sectionEScoreCard = async (data,totalHazardousWaste,totalNonHazardousWaste) => {

    const E1Score = await calculationE1(data);
    const E2Score = await calculationE2(data);
    const E3Score = await calculationE3(data);
    const E4Score = await calculationE4(data,totalHazardousWaste,totalNonHazardousWaste);
    const E5Score = await calculationE5(data);
    const E6Score = await calculationE6(data);
    const E7Score = await calculationE7(data);
    const E8Score = await calculationE8(data);
    const E9Score = await calculationE9(data);

    const sectionScore = E1Score.score + E2Score.score + E3Score.score + E4Score.score +
        E5Score.score + E6Score.score + E7Score.score + E8Score.score + E9Score.score;

    const sectionGrade = getGrade(sectionScore);

    data.E1 = { ...data.E1, ...E1Score };
    data.E2 = { ...data.E2, ...E2Score };
    data.E3 = { ...data.E3, ...E3Score };
    data.E4 = { ...data.E4, ...E4Score };
    data.E5 = { ...data.E5, ...E5Score };
    data.E6 = { ...data.E6, ...E6Score };
    data.E7 = { ...data.E7, ...E7Score };
    data.E8 = { ...data.E8, ...E8Score };
    data.E9 = { ...data.E9, ...E9Score };
    data.score = sectionScore;
    data.grade = sectionGrade;

    return data;
}

export const sectionSScoreCard = async (data) => {
    const S1Score = await calculationS1(data);
    const S2Score = await calculationS2(data);
    const S3Score = await calculationS3(data);
    const S4Score = await calculationS4(data);
    const S5Score = await calculationS5(data);
    const S6Score = await calculationS6(data);
    const S7Score = await calculationS7(data);
    const S8Score = await calculationS8(data);

    const sectionScore = S1Score.score + S2Score.score + S3Score.score + S4Score.score +
        S5Score.score + S6Score.score + S7Score.score + S8Score.score;

    const sectionGrade = getGrade(sectionScore);

    data.S1 = { ...data.S1, ...S1Score };
    data.S2 = { ...data.S2, ...S2Score };
    data.S3 = { ...data.S3, ...S3Score };
    data.S4 = { ...data.S4, ...S4Score };
    data.S5 = { ...data.S5, ...S5Score };
    data.S6 = { ...data.S6, ...S6Score };
    data.S7 = { ...data.S7, ...S7Score };
    data.S8 = { ...data.S8, ...S8Score };
    data.score = sectionScore;
    data.grade = sectionGrade;

    return data;
}

export const sectionGScoreCard = async (data, grossRevenue) => {
    const G1Score = await calculationG1(data);
    const G2Score = await calculationG2(data);
    const G3Score = await calculationG3(data, grossRevenue);
    const G4Score = await calculationG4(data, grossRevenue);
    const G5Score = await calculationG5(data, grossRevenue);
    const G6Score = await calculationG6(data, grossRevenue);
    const G7Score = await calculationG7(data);
    const G8Score = await calculationG8(data);
    const G9Score = await calculationG9(data);
    const G10Score = await calculationG10(data, grossRevenue);

    const sectionScore = G1Score.score + G2Score.score + G3Score.score + G4Score.score +
        G5Score.score + G6Score.score + G7Score.score + G8Score.score + G9Score.score + G10Score.score;

    const sectionGrade = getGrade(sectionScore);

    data.G1 = { ...data.G1, ...G1Score };
    data.G2 = { ...data.G2, ...G2Score };
    data.G3 = { ...data.G3, ...G3Score };
    data.G4 = { ...data.G4, ...G4Score };
    data.G5 = { ...data.G5, ...G5Score };
    data.G6 = { ...data.G6, ...G6Score };
    data.G7 = { ...data.G7, ...G7Score };
    data.G8 = { ...data.G8, ...G8Score };
    data.G9 = { ...data.G9, ...G9Score };
    data.G10 = { ...data.G10, ...G10Score };
    data.score = sectionScore;
    data.grade = sectionGrade;

    return data;
}

export const getGrade = (marks) => {
    marks = typeof marks === 'string' ? parseFloat(marks) : marks;

    if (isNaN(marks) || typeof marks !== 'number')
        return "FF";

    if (marks > 75) return "AA";
    if (marks > 70) return "AB";
    if (marks > 65) return "BB";
    if (marks > 60) return "BC";
    if (marks > 55) return "CC";
    if (marks > 50) return "CD";
    if (marks > 40) return "DD";
    return "FF";
}