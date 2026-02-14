import { IAdminApproval, ICreateAccount, IResetPassword } from '../types/emailTemplate';

const createAccount = (values: ICreateAccount) => {
    const data = {
        to: values.email,
        subject: "Verify your account",
        html: `
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    
                    <!-- Logo -->
                    <img src="https://res.cloudinary.com/dabd4udau/image/upload/v1749729492/sjb7az2kprkvdllrfofi.png" alt="Project Finder Logo" style="display: block; margin: 0 auto 20px; width:150px" />

                    <!-- Greeting -->
                    <h2 style="color: #D0A933; font-size: 24px; margin-bottom: 20px;">Hey, ${values.name}!</h2>

                    <!-- Verification Instructions -->
                    <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for signing up for Project Finder . Please verify your email address to activate your account.</p>

                    <!-- OTP Section -->
                    <div style="text-align: center;">
                        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
                        <div style="background-color: #D0A933; width: 120px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
                        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                    </div>

                    <!-- Footer -->
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">If you did not sign up for Project Finder, please ignore this email.</p>
                    <p style="color: #999; font-size: 12px; text-align: center;">&copy; 2024 Project Finder. All rights reserved.</p>

                </div>
            </body>
        `,
    };

    return data;
};

const resetPassword = (values: IResetPassword) => {
    const data = {
        to: values.email,
        subject: "Reset your password",
        html: `
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <img src="https://res.cloudinary.com/dabd4udau/image/upload/v1749729492/sjb7az2kprkvdllrfofi.png" alt="Project Finder Logo" style="display: block; margin: 0 auto 20px; width:150px" />
                    <div style="text-align: center;">
                        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
                        <div style="background-color: #D0A933; width: 120px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
                        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                    </div>
                </div>
            </body>
        `,
    };
    return data;
};


const accountApproval = (values: IAdminApproval) => {
    const isApproved = values.isAdminVerified;

    const statusText = isApproved ? "approved" : "rejected";
    const statusColor = isApproved ? "#28a745" : "#dc3545";
    const message = isApproved
        ? "Your account has been successfully approved by our admin team. You can now log in and start using your dashboard."
        : "Unfortunately, your account request has been rejected by our admin team. If you believe this is a mistake, please contact support.";

    const data = {
        to: values.email,
        subject: `Account ${statusText.toUpperCase()} - Project Finder`,
        html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Account Status</title>
</head>

<body style="margin:0; padding:0; background:#f4f6f9; font-family: Arial, sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f9; padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 3px 10px rgba(0,0,0,0.08);">

<!-- HEADER -->
<tr>
<td align="center" style="padding:30px;">
<img src="https://res.cloudinary.com/dabd4udau/image/upload/v1749729492/sjb7az2kprkvdllrfofi.png"
     width="150"
     alt="Project Finder" />
</td>
</tr>

<!-- TITLE -->
<tr>
<td align="center" style="padding:0 40px;">
<h2 style="margin:0; font-size:24px; color:#333;">
Hello ${values.name},
</h2>
</td>
</tr>

<tr>
<td align="center" style="padding:15px 40px;">
<h3 style="margin:0; font-size:20px; color:${statusColor};">
Your account has been ${statusText}!
</h3>
</td>
</tr>

<!-- MESSAGE -->
<tr>
<td style="padding:20px 40px; text-align:center; color:#555; font-size:16px; line-height:1.6;">
${message}
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#f8f8f8; padding:20px; text-align:center; font-size:13px; color:#888;">
© ${new Date().getFullYear()} Project Finder <br/>
Need help? Contact info@projectfinder.es or +995501002446
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    };

    return data;
};



export const emailTemplate = {
    createAccount,
    resetPassword,
    accountApproval
};