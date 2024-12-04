const nodemailer = require('nodemailer');
require('dotenv').config(); 

exports.mailerCreate = (emailReceipt, newPassword, fullname)=>{
    // Tạo transporter (kết nối với dịch vụ email)
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
        user: process.env.SHOP_MAIL, 
        pass: process.env.SHOP_PASS,  
        },
    });

    // Cấu hình thông tin email
    const mailOptions = {
        from: process.env.SHOP_MAIL,
        to: emailReceipt,
        subject: 'RESET PASSWORD DKD SHOP',
        html: `
            <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    color: #333;
                    padding: 20px;
                    }
                    .email-container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 600px;
                    margin: auto;
                    }
                    h2 {
                    color: #007bff;
                    }
                    p {
                    font-size: 16px;
                    line-height: 1.5;
                    }
                    .password-container {
                    background-color: #f1f1f1;
                    padding: 15px;
                    font-family: monospace;
                    font-size: 16px;
                    border-radius: 5px;
                    margin-top: 20px;
                    }
                    .footer {
                    font-size: 12px;
                    color: #888;
                    text-align: center;
                    margin-top: 20px;
                    }
                </style>
                </head>
                <body>

                <div class="email-container">
                    <h2>Your New Password</h2>
                    <p>Hi ${fullname},</p>
                    <p>We have successfully reset your password. Below is your new password:</p>

                    <div class="password-container">
                    <strong>New Password: ${newPassword}</strong>
                    </div>

                    <p>If you did not request this change, please contact us immediately.</p>
                    <p>Thank you for being a part of our community!</p>
                </div>

                <div class="footer">
                    <p>This email was sent to you because we received a password reset request for your account.</p>
                    <p>If you didn't make this request, please ignore this email or contact support.</p>
                </div>

                </body>
            </html>
        ` 
    };  

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
    });
}