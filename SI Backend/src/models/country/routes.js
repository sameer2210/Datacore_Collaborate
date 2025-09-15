import express from 'express';
import { getAllCountries } from './controller.js';
import Country from './model.js';

const router = express.Router();

router.get('/', getAllCountries);


const countryData = [
    {
        name: "Austria",
        cleanElectricityFactor: [
            { year: 2020, value: 80.3 },
            { year: 2021, value: 79.1 },
            { year: 2022, value: 78.1 },
            { year: 2023, value: 84.5 }
        ]
    },
    {
        name: "Belgium",
        cleanElectricityFactor: [
            { year: 2020, value: 65.6 },
            { year: 2021, value: 73.5 },
            { year: 2022, value: 72.4 },
            { year: 2023, value: 73.6 }
        ]
    },
    {
        name: "Bulgaria",
        cleanElectricityFactor: [
            { year: 2020, value: 60 },
            { year: 2021, value: 56.8 },
            { year: 2022, value: 51.8 },
            { year: 2023, value: 66.3 }
        ]
    },
    {
        name: "Canada",
        cleanElectricityFactor: [
            { year: 2020, value: 81.7 },
            { year: 2021, value: 81.1 },
            { year: 2022, value: 81.4 },
            { year: 2023, value: 80.1 }
        ]
    },
    {
        name: "Croatia",
        cleanElectricityFactor: [
            { year: 2020, value: 64.6 },
            { year: 2021, value: 69.7 },
            { year: 2022, value: 63.8 },
            { year: 2023, value: 69 }
        ]
    },
    {
        name: "Cyprus",
        cleanElectricityFactor: [
            { year: 2020, value: 12.4 },
            { year: 2021, value: 15.2 },
            { year: 2022, value: 16.7 },
            { year: 2023, value: 20.2 }
        ]
    },
    {
        name: "Czech Republic",
        cleanElectricityFactor: [
            { year: 2020, value: 50.4 },
            { year: 2021, value: 49.5 },
            { year: 2022, value: 49.9 },
            { year: 2023, value: 54.8 }
        ]
    },
    {
        name: "Denmark",
        cleanElectricityFactor: [
            { year: 2020, value: 82.1 },
            { year: 2021, value: 79.3 },
            { year: 2022, value: 81.4 },
            { year: 2023, value: 87.6 }
        ]
    },
    {
        name: "Egypt",
        cleanElectricityFactor: [
            { year: 2020, value: 12.4 },
            { year: 2021, value: 11.8 },
            { year: 2022, value: 11.9 },
            { year: 2023, value: 11.8 }
        ]
    },
    {
        name: "Estonia",
        cleanElectricityFactor: [
            { year: 2020, value: 48.8 },
            { year: 2021, value: 39.9 },
            { year: 2022, value: 31.7 },
            { year: 2023, value: 44.3 }
        ]
    },
    {
        name: "Finland",
        cleanElectricityFactor: [
            { year: 2020, value: 85.5 },
            { year: 2021, value: 85.7 },
            { year: 2022, value: 88.6 },
            { year: 2023, value: 94.4 }
        ]
    },
    {
        name: "France",
        cleanElectricityFactor: [
            { year: 2020, value: 90.8 },
            { year: 2021, value: 91.1 },
            { year: 2022, value: 87.1 },
            { year: 2023, value: 91.6 }
        ]
    },
    {
        name: "Germany",
        cleanElectricityFactor: [
            { year: 2020, value: 55.7 },
            { year: 2021, value: 52.2 },
            { year: 2022, value: 50.4 },
            { year: 2023, value: 54.1 }
        ]
    },
    {
        name: "Greece",
        cleanElectricityFactor: [
            { year: 2020, value: 36.9 },
            { year: 2021, value: 40.8 },
            { year: 2022, value: 43.5 },
            { year: 2023, value: 50.1 }
        ]
    },
    {
        name: "Hungary",
        cleanElectricityFactor: [
            { year: 2020, value: 61.8 },
            { year: 2021, value: 63.4 },
            { year: 2022, value: 65.6 },
            { year: 2023, value: 70.2 }
        ]
    },
    {
        name: "India",
        cleanElectricityFactor: [
            { year: 2020, value: 22.8 },
            { year: 2021, value: 22 },
            { year: 2022, value: 23 },
            { year: 2023, value: 22 }
        ]
    },
    {
        name: "Ireland",
        cleanElectricityFactor: [
            { year: 2020, value: 42.1 },
            { year: 2021, value: 36.7 },
            { year: 2022, value: 38.8 },
            { year: 2023, value: 43.7 }
        ]
    },
    {
        name: "Italy",
        cleanElectricityFactor: [
            { year: 2020, value: 42.2 },
            { year: 2021, value: 40.7 },
            { year: 2022, value: 35.8 },
            { year: 2023, value: 43.7 }
        ]
    },
    {
        name: "Kuwait",
        cleanElectricityFactor: [
            { year: 2020, value: 0.3 },
            { year: 2021, value: 0.2 },
            { year: 2022, value: 0.2 },
            { year: 2023, value: 0.2 }
        ]
    },
    {
        name: "Latvia",
        cleanElectricityFactor: [
            { year: 2020, value: 63.6 },
            { year: 2021, value: 63.6 },
            { year: 2022, value: 75.8 },
            { year: 2023, value: 76.6 }
        ]
    },
    {
        name: "Lithuania",
        cleanElectricityFactor: [
            { year: 2020, value: 54.7 },
            { year: 2021, value: 60.9 },
            { year: 2022, value: 75.2 },
            { year: 2023, value: 74.4 }
        ]
    },
    {
        name: "Luxembourg",
        cleanElectricityFactor: [
            { year: 2020, value: 79.5 },
            { year: 2021, value: 80.5 },
            { year: 2022, value: 85.6 },
            { year: 2023, value: 92.1 }
        ]
    },
    {
        name: "Malta",
        cleanElectricityFactor: [
            { year: 2020, value: 79.4 },
            { year: 2021, value: 79.4 },
            { year: 2022, value: 79.4 },
            { year: 2023, value: 79.4 }
        ]
    },
    {
        name: "Netherlands",
        cleanElectricityFactor: [
            { year: 2020, value: 30.2 },
            { year: 2021, value: 36.55 },
            { year: 2022, value: 43.7 },
            { year: 2023, value: 51.1 }
        ]
    },
    {
        name: "Oman",
        cleanElectricityFactor: [
            { year: 2020, value: 0.5 },
            { year: 2021, value: 0.6 },
            { year: 2022, value: 0.6 },
            { year: 2023, value: 0.6 }
        ]
    },
    {
        name: "Poland",
        cleanElectricityFactor: [
            { year: 2020, value: 8 },
            { year: 2021, value: 7.9 },
            { year: 2022, value: 9.8 },
            { year: 2023, value: 12.2 }
        ]
    },
    {
        name: "Portugal",
        cleanElectricityFactor: [
            { year: 2020, value: 58.6 },
            { year: 2021, value: 64.1 },
            { year: 2022, value: 59.6 },
            { year: 2023, value: 72.8 }
        ]
    },
    {
        name: "Qatar",
        cleanElectricityFactor: [
            { year: 2020, value: 0.3 },
            { year: 2021, value: 0.3 },
            { year: 2022, value: 0.3 },
            { year: 2023, value: 0.3 }
        ]
    },
    {
        name: "Romania",
        cleanElectricityFactor: [
            { year: 2020, value: 65.35 },
            { year: 2021, value: 64.2 },
            { year: 2022, value: 63.4 },
            { year: 2023, value: 70.3 }
        ]
    },
    {
        name: "Saudi Arabia",
        cleanElectricityFactor: [
            { year: 2020, value: 0.1 },
            { year: 2021, value: 0.2 },
            { year: 2022, value: 0.2 },
            { year: 2023, value: 1.4 }
        ]
    },
    {
        name: "Slovakia",
        cleanElectricityFactor: [
            { year: 2020, value: 78.2 },
            { year: 2021, value: 75.76 },
            { year: 2022, value: 81.9 },
            { year: 2023, value: 84.8 }
        ]
    },
    {
        name: "Slovenia",
        cleanElectricityFactor: [
            { year: 2020, value: 70.6 },
            { year: 2021, value: 71.5 },
            { year: 2022, value: 72.5 },
            { year: 2023, value: 75.8 }
        ]
    },
    {
        name: "Spain",
        cleanElectricityFactor: [
            { year: 2020, value: 66.3 },
            { year: 2021, value: 67.34 },
            { year: 2022, value: 66.1 },
            { year: 2023, value: 71.1 }
        ]
    },
    {
        name: "Switzerland",
        cleanElectricityFactor: [
            { year: 2020, value: 97.3 },
            { year: 2021, value: 97.3 },
            { year: 2022, value: 97.2 },
            { year: 2023, value: 97.6 }
        ]
    },
    {
        name: "Turkey",
        cleanElectricityFactor: [
            { year: 2020, value: 42.16 },
            { year: 2021, value: 35.4 },
            { year: 2022, value: 41.9 },
            { year: 2023, value: 42 }
        ]
    },
    {
        name: "UAE",
        cleanElectricityFactor: [
            { year: 2020, value: 5 },
            { year: 2021, value: 11.3 },
            { year: 2022, value: 17.5 },
            { year: 2023, value: 27.9 }
        ]
    },
    {
        name: "USA",
        cleanElectricityFactor: [
            { year: 2020, value: 39.9 },
            { year: 2021, value: 39.5 },
            { year: 2022, value: 40.3 },
            { year: 2023, value: 40.9 }
        ]
    }
];


router.post('/add_countries_data', async (req, res) => {
    try {
        for (const data of countryData) {
            const existingCountry = await Country.findOne({ name: data.name });
            console.log(existingCountry);

            if (existingCountry) {
                existingCountry.cleanElectricityFactor = data.cleanElectricityFactor;
                await existingCountry.save();
            } else {
                console.log(data);
                const newCountry = new Country(data);
                await newCountry.save();
            }
        }

        res.status(200).json({ message: 'Countries added/updated successfully' });
    } catch (error) {
        console.error('Error adding countries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
