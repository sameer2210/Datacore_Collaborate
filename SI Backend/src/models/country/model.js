import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    currency: {
        type: String,
        required: true,
        trim: true
    },
    // cleanElectricityFactor: {
    //     type: Number,
    //     default:1,
    // },

    cleanElectricityFactor: [
        {
            year: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        }
    ]
});

const defaultCountry = [
    {
        "name": "India",
        "currency": "INR"
    },
    {
        "name": "USA",
        "currency": "USD"
    },
    {
        "name": "Canada",
        "currency": "CAD"
    },
    {
        "name": "Austria",
        "currency": "EUR"
    },
    {
        "name": "Belgium",
        "currency": "EUR"
    },
    {
        "name": "Bulgaria",
        "currency": "BGN"
    },
    {
        "name": "Croatia",
        "currency": "EUR"
    },
    {
        "name": "Cyprus",
        "currency": "EUR"
    },
    {
        "name": "Czech Republic",
        "currency": "CZK"
    },
    {
        "name": "Denmark",
        "currency": "DKK"
    },
    {
        "name": "Estonia",
        "currency": "EUR"
    },
    {
        "name": "Finland",
        "currency": "EUR"
    },
    {
        "name": "France",
        "currency": "EUR"
    },
    {
        "name": "Germany",
        "currency": "EUR"
    },
    {
        "name": "Greece",
        "currency": "EUR"
    },
    {
        "name": "Hungary",
        "currency": "HUF"
    },
    {
        "name": "Ireland",
        "currency": "EUR"
    },
    {
        "name": "Italy",
        "currency": "EUR"
    },
    {
        "name": "Latvia",
        "currency": "EUR"
    },
    {
        "name": "Lithuania",
        "currency": "EUR"
    },
    {
        "name": "Luxembourg",
        "currency": "EUR"
    },
    {
        "name": "Malta",
        "currency": "EUR"
    },
    {
        "name": "Netherlands",
        "currency": "EUR"
    },
    {
        "name": "Poland",
        "currency": "PLN"
    },
    {
        "name": "Portugal",
        "currency": "EUR"
    },
    {
        "name": "Romania",
        "currency": "RON"
    },
    {
        "name": "Slovakia",
        "currency": "EUR"
    },
    {
        "name": "Slovenia",
        "currency": "EUR"
    },
    {
        "name": "Spain",
        "currency": "EUR"
    },
    {
        "name": "Switzerland",
        "currency": "CHF"
    },
    {
        "name": "UAE",
        "currency": "AED"
    },
    {
        "name": "Qatar",
        "currency": "QAR"
    },
    {
        "name": "Saudi Arabia",
        "currency": "SAR"
    },
    {
        "name": "Oman",
        "currency": "OMR"
    },
    {
        "name": "Egypt",
        "currency": "EGP"
    },
    {
        "name": "Kuwait",
        "currency": "KWD"
    },
    {
        "name": "Turkey",
        "currency": "TRY"
    }
]







const Country = mongoose.model('Country', countrySchema);

const defaultEntry = async function () {
    try {

        const count = await Country.countDocuments();

        if (count === 0) {
            await Country.insertMany(defaultCountry);
        }
    } catch (error) {
        console.log(error);
    }
};

defaultEntry();

export default Country; 
