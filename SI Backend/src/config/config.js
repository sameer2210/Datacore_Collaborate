import dotenv from 'dotenv';
dotenv.config();

export const portNumber = process.env.PORT_NUMBER || 8000;
export const dataBaseUrl = process.env.DATABASE_URL;
export const awsBucketName = process.env.AWS_BUCKET_NAME;
export const awsBucketRegion = process.env.AWS_BUCKET_REGION;
export const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
export const awsAccessSecret = process.env.AWS_ACCESS_SECRET;
export const sendgridApiKey = process.env.SENDGRID_API_KEY;
export const senderVerifiedEmial = process.env.SENDER_VERIFIED_EMAIL;
export const forgotPasswordJwtKey = process.env.FORGOT_PASSWORD_JWT_TOKEN;