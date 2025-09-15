import sgMail from "@sendgrid/mail";
import { senderVerifiedEmial, sendgridApiKey } from "../config/config.js";

// Set your SendGrid API key
sgMail.setApiKey(sendgridApiKey);

async function sendEmail(to, subject, text, html) {
    const msg = {
        to,
        from: senderVerifiedEmial, // Change to your verified sender
        subject,
        text,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.response.body);
        throw new Error("Error in sending email.");
    }
}

export async function sendOTPVerificationEmail(to, otp) {
    const subject = 'Email Verification OTP';
    const text = `Your OTP for email verification is: ${otp}`;
    const html = `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`;

    try {
        await sendEmail(to, subject, text, html);
        console.log('OTP email sent successfully');
        return { message: "OTP email sent successfully" };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
}

export async function sendOTPForgotPassword(to, otp) {
    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is: ${otp}`;
    const html = `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`;

    try {
        await sendEmail(to, subject, text, html);
        console.log('Password reset OTP email sent successfully');
        return { message: "Password reset OTP email sent successfully" };
    } catch (error) {
        console.error('Error sending password reset OTP email:', error);
        throw error;
    }
}

export async function sendResetPasswordSuccessfulNotification(to) {
    const subject = 'Password Reset Complete';
    const text = `Your password has been reset successfully.`;
    const html = `<p>Your password has been reset successfully.</p>`;

    try {
        await sendEmail(to, subject, text, html);
        console.log('Reset password notification email sent successfully');
        return { message: "Reset password notification email sent successfully" };
    } catch (error) {
        console.error('Error sending reset password notification email:', error);
        throw error;
    }
}

export async function sendCallEmailTOSITeam({ date, time, companyName, adminName, email, phoneNumber }) {
    const subject = `New Call Request from ${companyName} on ${date}`;
    const text = `Dear Business Team,

We have received a new call request through our SI web application. Please find the details below:

Date: ${date}
Time: ${time}
Company Name: ${companyName}
Admin Name: ${adminName}
Email: ${email}
Phone Number: ${phoneNumber}

Please reach out to them at your earliest convenience to discuss potential collaboration.

Best regards,
SI`;

    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Call Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            font-size: 20px;
            color: #333;
        }
        p {
            margin: 10px 0;
            color: #555;
        }
        .details {
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .details p {
            margin: 5px 0;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div>
        <p>Dear Business Team,</p>
        <p>We have received a new call request through our SI web application. Please find the details below:</p>
        <div class="details">
            <p>Date: ${date}</p>
            <p>Time: ${time}</p>
            <p>Company Name: ${companyName}</p>
            <p>Admin Name: ${adminName}</p>
            <p>Email: ${email}</p>
            <p>Phone Number: ${phoneNumber}</p>
        </div>
        <p>Please reach out to them at your earliest convenience to discuss potential collaboration.</p>
        <p>Best regards,<br>
        Lead Generation Form<br>
        SI Tool, GE3S</p>
    </div>
</body>
</html>
    `;

    const to = "punnay@growhut.in";

    try {
        await sendEmail(to, subject, text, html);
        console.log('Call request email sent successfully');
        return { message: "Call request email sent successfully" };
    } catch (error) {
        console.error('Error sending call request email:', error);
        throw error;
    }
}

export async function sendTeamMemberInvitationEmail(to, organizationName, token) {
    const subject = 'Invitation to Join Organization';
    const invitationLink = `${process.env.FRONTEND_URL}/team-profile/${token}`;
    const text = `You have been invited to join ${organizationName}. Click the following link to accept the invitation: ${invitationLink}`;
    const html = `
        <p>You have been invited to join <strong>${organizationName}</strong>.</p>
        <p>Click the following link to accept the invitation:</p>
        <a href="${invitationLink}">${invitationLink}</a>
    `;

    try {
        await sendEmail(to, subject, text, html);
        console.log('Team member invitation email sent successfully');
        return { message: "Team member invitation email sent successfully" };
    } catch (error) {
        console.error('Error sending team member invitation email:', error);
        throw error;
    }
}
