import { timeStamp } from "console";
import { verify } from "crypto";
import mongoose, { Mongoose } from "mongoose";
import { type } from "os";


// ... existing code ...

const actionableInsightSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    actionableInsights: [{
        type: String,
        trim: true
    }]
});

export const ActionableInsight = mongoose.model('ActionableInsight', actionableInsightSchema);


const kpis = [
    {
        "code": "B1",
        "name": "GHG emissions intensity",
        "actionableInsights": [
            "Implement high-efficiency motors (IE3 & IE4) to reduce energy consumption and emissions.",
            "Optimize boiler operations with smart control systems to minimize unnecessary energy use and associated emissions.",
            "Involve specialists in Equipment-sizing"
        ]
    },
    {
        "code": "B2",
        "name": "Water Intensity",
        "actionableInsights": [
            "Involve specialist in equipment selection to reduce water consumption intensity",
            "Use smart metering and IoT sensors for real-time water use monitoring and leak detection.",
            "Upgrade to water-efficient appliances and fixtures in all facilities."
        ]
    },
    {
        "code": "B3",
        "name": "Hazardous Waste Intensity",
        "actionableInsights": [
            "Transition to less hazardous materials in operations to reduce hazardous waste generation.",
            "Implement better separation and on-site treatment solutions to minimize waste volume.",
            "Enhance waste tracking systems to properly manage and dispose of hazardous waste."
        ]
    },
    {
        "code": "B4",
        "name": "Non-hazardous Waste Intensity",
        "actionableInsights": [
            "Increase recycling programs and partnerships with recycling facilities.",
            "Conduct waste audits to identify reduction opportunities and optimize waste streams.",
            "Encourage waste minimization practices among employees and operations."
        ]
    },
    {
        "code": "B5",
        "name": "Percentage of Revenue Allocated for Clean-up and Site Remediation",
        "actionableInsights": [
            "Implement preventive maintenance and regular inspection to reduce unexpected cleanup costs.",
            "Use environmentally friendly materials and processes to minimize potential contamination.",
            "Develop and enforce stricter site management protocols to prevent environmental incidents."
        ]
    },
    {
        "code": "B6",
        "name": "Percentage of Electricity Consumed from Clean Sources",
        "actionableInsights": [
            "Increase investment in onsite renewable energy projects like solar and wind.",
            "Purchase Renewable Energy Certificates (RECs) to offset non-renewable energy use."
        ]
    },
    {
        "code": "E1",
        "name": "Scope 1 and Scope 2 - CO2e Emissions",
        "actionableInsights": [
            "Upgrade to energy-efficient machinery and equipment to reduce direct emissions from operations.",
            "Improve building insulation and HVAC systems to reduce energy demands and associated emissions."
        ]
    },
    {
        "code": "E2",
        "name": "Scope 3 - CO2e Emissions",
        "actionableInsights": [
            "Collaborate with suppliers to reduce through sustainable sourcing and logistics.",
            "Encourage customers to adopt sustainable product use and disposal practices."
        ]
    },
    {
        "code": "E3",
        "name": "Amount of Water Consumed",
        "actionableInsights": [
            "Implement water-saving initiatives such as xeriscaping and efficient irrigation systems in company properties.",
            "Retrofit water systems with advanced technologies like variable frequency drives (VFDs) on pumps."
        ]
    },
    {
        "code": "E4",
        "name": "Percentage of Total Waste Disposed to Landfill",
        "actionableInsights": [
            "Enhance waste sorting and segregation to increase recycling rates.",
            "Explore alternative uses or selling waste materials as by-products."
        ]
    },
    {
        "code": "E5",
        "name": "NOx Released into the Environment",
        "actionableInsights": [
            "Install advanced emission control technologies like SCR (Selective Catalytic Reduction) for NOx and flue gas desulfurization for SOx.",
            "Regularly maintain and service machinery to ensure optimal operation and minimal emissions."
        ]
    },
    {
        "code": "E6",
        "name": "SOx Released in the Environment",
        "actionableInsights": [
            "Install advanced emission control technologies like SCR (Selective Catalytic Reduction) for NOx and flue gas desulfurization for SOx.",
            "Regularly maintain and service machinery to ensure optimal operation and minimal emissions."
        ]
    },
    {
        "code": "E7",
        "name": "Threshold H2S Concentration for Flare Technology",
        "actionableInsights": [
            "Upgrade flare systems to those that can curb even lower H2S concentrations.",
            "Regularly monitor and maintain flare systems to ensure compliance with H2S concentration limits."
        ]
    },
    {
        "code": "E8",
        "name": "LA90 Noise Level",
        "actionableInsights": [
            "Conduct regular noise surveys to identify and mitigate noise pollution sources.",
            "Implement noise control measures such as sound barriers and quieter machinery."
        ]
    },
    {
        "code": "E9",
        "name": "Percentage of Wastewater Treated Before Being Disposed",
        "actionableInsights": [
            "Upgrade to wastewater treatment in-house or send to external facilities to increase treatment capacity",
            "Implement advanced treatment technologies such as membrane bioreactors (MBRs) for higher purification levels."
        ]
    },
    {
        "code": "S1",
        "name": "Gender Ratio",
        "actionableInsights": [
            "Implement targeted recruitment strategies to attract diverse candidates and achieve a balanced gender ratio.",
            "Promote inclusive workplace policies and support gender diversity initiatives.",
            "Provide leadership development programs to encourage gender diversity in management roles."
        ]
    },
    {
        "code": "S2",
        "name": "Percentage of Foreign Employees",
        "actionableInsights": [
            "Cultivate a global talent acquisition strategy to enhance workforce diversity.",
            "Offer language training and cultural assimilation programs to support international employees.",
            "Allow for work across offices in various geographical-locations"
        ]
    },
    {
        "code": "S3",
        "name": "Percentage of Direct to Indirect Employees",
        "actionableInsights": [
            "Evaluate the benefits of converting qualified indirect employees to direct hires to improve workforce stability."
        ]
    },
    {
        "code": "S4",
        "name": "Average Tenure of Employees in the Organisation",
        "actionableInsights": [
            "Foster employee engagement and satisfaction through career development opportunities and competitive benefits",
            "Implement retention strategies focused on work-life balance and employee wellness programs."
        ]
    },
    {
        "code": "S5",
        "name": "Hours of Training Provided to Employees",
        "actionableInsights": [
            "Develop comprehensive training programs that align with business goals and employee career paths.",
            "Leverage online platforms for scalable and accessible employee training.",
            "Regularly update training content to reflect the latest industry standards and technologies."
        ]
    },
    {
        "code": "S6",
        "name": "Non-discriminatory Policy in Place",
        "actionableInsights": [
            "Regularly review and update non-discrimination policies to comply with legal standards and best practices.",
            "Conduct workshops and training sessions to promote awareness and enforcement of these policies.",
            "Include Examples of Discriminatory Behaviors, Reporting and Investigation Procedures in the policy"
        ]
    },
    {
        "code": "S7",
        "name": "TRIR (Total Recordable Incident Rate)",
        "actionableInsights": [
            "Strengthen safety protocols and conduct regular safety audits to identify and mitigate workplace hazards.",
            "Promote a culture of safety through continuous employee training and empowerment to report unsafe conditions."
        ]
    },
    {
        "code": "S8",
        "name": "Total Number of Employees Hired Through Campus Placements",
        "actionableInsights": [
            "Strengthen relationships with educational institutions to enhance recruitment from campus placements.",
            "Develop internship programs that serve as a pipeline for full-time positions."
        ]
    },
    {
        "code": "G1",
        "name": "Tax Relief/Incentives/Subsidies Received from the Government",
        "actionableInsights": [
            "Actively seek government incentives for sustainability projects and energy-efficient upgrades.",
            "Maintain compliance with all eligibility requirements to continue receiving fiscal benefits."
        ]
    },
    {
        "code": "G2",
        "name": "Percentage of Pension Salary Contributed by Employer",
        "actionableInsights": [
            "Regularly review and adjust pension contributions to ensure competitive and equitable benefits for employees.",
            "Offer optional employee education sessions on financial planning and retirement savings."
        ]
    },
    {
        "code": "G3",
        "name": "Amount Spent on Local Suppliers as a Percentage of Gross Revenue",
        "actionableInsights": [
            "Develop policies to prioritize and increase procurement from local suppliers.",
            "Assess the economic impact of local sourcing and adjust strategies to maximize community benefits."
        ]
    },
    {
        "code": "G4",
        "name": "Amount Spent on Suppliers Having Registered Business Less Than 5 Years",
        "actionableInsights": [
            "Implement supplier development programs to support and elevate newly established suppliers.",
            "Set specific procurement goals for engaging with emerging businesses."
        ]
    },
    {
        "code": "G5",
        "name": "Amount Spent on Local Communities as a Percentage of Gross Revenue",
        "actionableInsights": [
            "Enhance community engagement strategies to address local needs effectively.",
            "Increase investments in community projects that align with corporate social responsibility goals."
        ]
    },
    {
        "code": "G6",
        "name": "Amount Spent on Innovative Technologies as a Percentage of Gross Revenue",
        "actionableInsights": [
            "Allocate a dedicated budget for research and development in emerging technologies.",
            "Pursue partnerships and collaborations that foster innovation and access to cutting-edge solutions."
        ]
    },
    {
        "code": "G7",
        "name": "Ethics Policy in Place",
        "actionableInsights": [
            "Regularly review and enhance the ethics policy to address new ethical challenges and ensure clarity and comprehensiveness.",
            "Foster an ethical corporate culture through continuous training and clear communication of ethical standards."
        ]
    },
    {
        "code": "G8",
        "name": "Percentage of Resolved Complaints",
        "actionableInsights": [
            "Enhance the complaint resolution process to ensure timely and fair handling of all grievances.",
            "Implement a transparent tracking system for complaint resolution progress."
        ]
    },
    {
        "code": "G9",
        "name": "Number of Board Members",
        "actionableInsights": [
            "Ensure the board's composition reflects diverse expertise and perspectives to enhance governance effectiveness."
        ]
    },
    {
        "code": "G10",
        "name": "Amount Spent on CSR Activities as a Percentage of Gross Revenue",
        "actionableInsights": [
            "Strategically plan CSR initiatives to align with core business objectives and stakeholder expectation"
        ]
    }
]

const defaultAdd = async () => {
    try {
        await ActionableInsight.insertMany(kpis);
    } catch (error) {
        console.error("Error adding default data:", error);
    }
}

defaultAdd();





// ... existing code ...

export const supportFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    key: {
        type: String,
        required: true,
        trim: true
    }
});

export const approvalSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['approved', 'rejected', 'pending'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    senderForVerification: {
        type: mongoose.Schema.Types.ObjectId,
    }
}, { timestamps: true });

export const assignSchema = new mongoose.Schema({
    assignMembers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    comments: {
        type: [{
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            attachments: [String],
            message: {
                type: String,
                trim: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    }
});

const sendForApprovalSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', "inProgress", 'approved', 'rejected']
    },
    type: {
        type: String,
        enum: ['submit', 'resubmit']
    }
}, { timestamps: true });

const reportSchema = new mongoose.Schema({
    reportNo: {
        type: String,
        require: true
    },
    name: { type: String, required: true },
    year: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                const currentYear = new Date().getFullYear();
                return value >= currentYear - 50 && value <= currentYear;
            },
            message: props => `${props.value} is not within the last three years`
        }
    },
    period: {
        type: String,
        enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"]
    },
    segment: {
        type: String,
        required: true,
        //enum: ["Q1", "Q2", "Q3", "Q4"]
    },
    organizationDetails: {
        organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
        license: { type: String },
        totalSiteArea: { type: Number, required: true },
        unitsProduced: {
            value: { type: Number, required: true },
            unit: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Unit" }
        },
        rawMaterialConsumption: {
            value: { type: Number },
            unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" }
        },
    },
    score: { type: Number },
    grade: { type: String },
    basicSectorSpecificKPI: { type: mongoose.Schema.Types.ObjectId, ref: "BasicSectorSpecificKPI" },
    environmentKPI: { type: mongoose.Schema.Types.ObjectId, ref: "EnvironmentKPI" },
    governanceKPI: { type: mongoose.Schema.Types.ObjectId, ref: "GovernmentKPI" },
    socialKPI: { type: mongoose.Schema.Types.ObjectId, ref: "SocialKPI" },
    status: { type: String, default: "draft", enum: ['draft', 'ready', "sendForVerification", 'vetted', "rejected"] },
    completedStatus: {
        total: Number,
        done: Number,
    },
    approveDate: {
        type: Date
    },
    sendForApproval: [sendForApprovalSchema],
    sendForVerificationDate: {
        type: Date
    },
    last6YearsReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
    assignUsers: [{
        type: String,
        trim: true
    }],
    supportingDocuments: [supportFileSchema],
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;