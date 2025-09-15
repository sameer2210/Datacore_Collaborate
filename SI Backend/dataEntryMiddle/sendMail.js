import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
  },
});

const sendEmail = async (to, from, subject, text, html) => {
  try {
    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: {
          Html: { Charset: "UTF-8", Data: html },
          Text: { Charset: "UTF-8", Data: text },
        },
        Subject: { Charset: "UTF-8", Data: subject },
      },
      Source: from,
    };

    await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

export default sendEmail;
