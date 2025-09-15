import AWS from 'aws-sdk';
import crypto from 'crypto';
import { awsAccessKey, awsBucketName, awsAccessSecret, awsBucketRegion } from '../config/config.js';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: awsAccessKey,
    secretAccessKey: awsAccessSecret,
    region: awsBucketRegion,
});

const s3 = new AWS.S3();

async function uploadFileToS3(file, folder_name) {
    let fileName = file.originalname.split(".")[0];
    fileName = fileName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "_");
    const extension = file.originalname.split(".")[1];

    const uploadParams = {
        Bucket: awsBucketName,
        Body: file.buffer,
        Key: `${folder_name}/${fileName}_${crypto.randomBytes(24).toString("hex")}.${extension}`,
        ContentType: file.mimetype,
    };

    const uploadedFile = await s3.upload(uploadParams).promise();
    return { key: uploadedFile.Key,name: file.originalname };
}

async function deleteFileFromS3(fileKey) {
    const deleteParams = {
        Bucket: awsBucketName,
        Key: fileKey,
    };

    return await s3.deleteObject(deleteParams).promise();
}

async function getFileFromS3(fileKey) {
    const getParams = {
        Bucket: awsBucketName,
        Key: fileKey,
    };

    const data = await s3.getObject(getParams).promise();
    return {
        Body: data.Body,
        ContentType: data.ContentType,
        ContentLength: data.ContentLength,
        LastModified: data.LastModified
    };
}

export { uploadFileToS3, deleteFileFromS3, getFileFromS3 };
