function convertESGMetrics(inputJson) {
    const input = inputJson;
    const parsedInput = typeof input === 'string' ? JSON.parse(input) : input;
    const output = {
        environmentKPI: {},
        basicSectorSpecificKPI: {},
        socialKPI: {},
        governanceKPI: {}
    };

    // Helper function to set a nested value
    function setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = { value: value };
    }

    // Mapping of old keys to new structure
    const mapping = {
        "Scope 1 Emission (tCO2e)": ["environmentKPI.E1.scope1Emissions", "basicSectorSpecificKPI.B1.scope1Emissions"],
        "Scope 2 Emission (tCO2e)": ["environmentKPI.E1.scope2Emissions", "basicSectorSpecificKPI.B1.scope2Emissions"],
        "Scope 3 Emission (tCO2e)": "environmentKPI.E2.scope3Emissions",
        "Gross Revenue (million USD)": "basicSectorSpecificKPI.B1.grossRevenue",
        "Total Water Consumption (m3)": ["environmentKPI.E3.waterConsumed", "basicSectorSpecificKPI.B2.totalWaterConsumption"],
        "Total Hazardous Waste Produced (tonnes)": "basicSectorSpecificKPI.B3.totalHazardousWaste",
        "Total Non-hazardous Waste Produced (tonnes)": "basicSectorSpecificKPI.B4.totalNonHazardousWaste",
        "Revenue Allocated for Site Cleanup in the Previous 3 Years (2020, 2021, 2023 in %)": ["basicSectorSpecificKPI.B5.Y1", "basicSectorSpecificKPI.B5.Y2", "basicSectorSpecificKPI.B5.Y3"],
        "Total Electricity Consumption (TEC in MWh or kWh)": "basicSectorSpecificKPI.B6.totalElectricityConsumption",
        "Electricity Consumed from the Grid (ECG in MWh or kWh)": "basicSectorSpecificKPI.B6.electricityFromGrid",
        "Renewable Energy Certificates (REC) Purchased for Electricity (REC in MWh or kWh)": "basicSectorSpecificKPI.B6.recPurchased",
        "Electricity from Renewables (ER in MWh or kWh)": "basicSectorSpecificKPI.B6.electricityFromRenewables",
        "Amount of Waste Disposed to Landfill (tonnes)": "environmentKPI.E4.wasteToLandfill",
        "Amount of NOx Released into the Environment (tonnes)": "environmentKPI.E5.noxReleased",
        "Amount of SOx Released into the Environment (tonnes)": "environmentKPI.E6.soxReleased",
        "Threshold H2S Concentration for the Flare Technology in Use (ppm)": "environmentKPI.E7.h2sConcentration",
        "LA90 Noise Level (dB)": "environmentKPI.E8.noiseLevel",
        "Total Waste Water Generated (tonnes or m3)": "environmentKPI.E9.totalWasteWater",
        "Total Waste Water Treated Before Disposal (tonnes or m3)": "environmentKPI.E9.wasteWaterTreated",
        "Total Number of Men in the Workforce (Number)": "socialKPI.S1.totalMen",
        "Total Number of Women in the Workforce (Number)": "socialKPI.S1.totalWomen",
        "Total Number of People in the Workforce who Identify as Non-binary (Number)": "socialKPI.S1.totalNonBinary",
        "Number of Foreign Nationals in Workforce (Number)": "socialKPI.S2.foreignEmployees",
        "Number of Direct Employees (Number)": "socialKPI.S3.directEmployees",
        "Number of Indirect Employees like Contractors, Outsourced, etc. (Number)": "socialKPI.S3.indirectEmployees",
        "Average Tenure of Employees in the Organization (years)": "socialKPI.S4.averageTenure",
        "Hours of Training Provided to Employees (hours/year/employee)": "socialKPI.S5.trainingHours",
        "Do you have a Non-discriminatory Policy in Place? (Yes / No)": "socialKPI.S6.nonDiscriminatoryPolicy",
        "Total Recordable Incident Rate (Incidents per 200,000 hours worked)": "socialKPI.S7.trir",
        "Total Number of Employees Hired through Campus Placements (Number)": "socialKPI.S8.campusHires",
        "Does your Company/Product Receive Tax Relief/Incentives/Subsidies from the Government? (Yes / No)": "governanceKPI.G1.taxReliefReceived",
        "Percentage of Pension Salary Contributed by Employer (percentage)": "governanceKPI.G2.pensionContribution",
        "Amount Spent on Local Suppliers (million USD)": "governanceKPI.G3.localSuppliersSpending",
        "Amount Spent on Suppliers Having Registered Business Less Than 5 Years (million USD)": "governanceKPI.G4.newSuppliersSpending",
        "Amount Spent on Local Communities (million USD)": "governanceKPI.G5.localCommunitiesSpending",
        "Amount Spent on Innovative Technologies (million USD)": "governanceKPI.G6.innovativeTechnologiesSpending",
        "Do you have an Ethics Policy in Place? (Yes / No)": "governanceKPI.G7.ethicsPolicyInPlace",
        "Total Number of Complaints (Number)": "governanceKPI.G8.totalComplaints",
        "Total Number of Complaints Resolved (Number)": "governanceKPI.G8.resolvedComplaints",
        "Number of Board Members (Number)": "governanceKPI.G9.boardMembers",
        "Amount Spent on CSR Activities (million USD)": "governanceKPI.G10.csrSpending"
    };

    // Helper function to convert Yes/No to boolean
    function convertYesNoToBoolean(value) {
        return value.toLowerCase() == "yes" ? true : false;
    }

    const yesNoKeys = ["Do you have an Ethics Policy in Place? (Yes / No)", "Do you have a Non-discriminatory Policy in Place? (Yes / No)", "Do you have a Non-discriminatory Policy in Place? (Yes / No)"];
    // Convert values
    for (const [key, value] of Object.entries(parsedInput)) {

        if (value !== "NONE" && mapping[key]) {
            if (Array.isArray(mapping[key])) {
                mapping[key].forEach((path, index) => {
                    // For the revenue allocated for site cleanup, we split the value
                    if (key === "Revenue Allocated for Site Cleanup in the Previous 3 Years (2020, 2021, 2023 in %)") {
                        const years = value.split(',').map(v => v.trim());
                        setNestedValue(output, path, parseFloat(years[index]) || 0);
                    } else {
                        setNestedValue(output, path, isNaN(parseFloat(value)) ? value : parseFloat(value));
                    }
                });
            } else {
                let parsedValue;
                if (yesNoKeys.includes(key)) {
                    parsedValue = convertYesNoToBoolean(value);
                } else {
                    parsedValue = isNaN(parseFloat(value)) ? value : parseFloat(value);
                }
                setNestedValue(output, mapping[key], parsedValue);
            }
        }
    }

    // Remove empty objects
    for (const category in output) {
        for (const kpi in output[category]) {
            if (Object.keys(output[category][kpi]).length === 0) {
                delete output[category][kpi];
            }
        }
        if (Object.keys(output[category]).length === 0) {
            delete output[category];
        }
         return output;
    }
}


export default convertESGMetrics;
