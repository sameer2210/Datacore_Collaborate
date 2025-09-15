import mongoose from 'mongoose';
import { dataBaseUrl } from './config.js';

let connectionResponse = null;
export const connection = async () => {
    try {
        if (dataBaseUrl == null) {
            throw new Error('DATABASE_URL is undefined');
        }

        mongoose.set('strictQuery', true);
        connectionResponse = await mongoose.connect(dataBaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected: ${connectionResponse.connection.host}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectionResponse;

