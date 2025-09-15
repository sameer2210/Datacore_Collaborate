import AWS from "aws-sdk";
import convertESGMetrics from "./parserAIOutput.js";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_BUCKET_REGION,
});

const lambda = new AWS.Lambda();

export const fetchDataPointsFromAI = async (files, year) => {
    const params = {
        FunctionName: "Ai_kpi_extraction",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            body: {
                file_keys: files,
                year: year
            },
        }),
    };


    try {
        const response = await new Promise((resolve, reject) => {
            lambda.invoke(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const payload = JSON.parse(data?.Payload);

                    if (!payload || !payload.body) {
                        reject(new Error("No payload or body found in Lambda response"));
                    } else {
                        const body = payload.body;
                        const result = convertESGMetrics(body);
                        resolve(result);
                    }
                }
            });
        });

        return response;
    } catch (error) {
        console.error("Error invoking Lambda function: ", error);
        throw error;
    }
};

