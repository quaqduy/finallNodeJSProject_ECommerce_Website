const nodemailer = require('nodemailer');
require('dotenv').config();

exports.mailerCreate = (emailReceipt, cartItemlist, fullname, addressUser, status, trackingNumber) => {
    // Prepare product order information
    const productOrdersInf = [];
    cartItemlist.forEach((item) => {
        productOrdersInf.push({
            productName: item.productId.name,
            productColorChose: item.color,
            productQuantityChose: item.quantity,
        });
    });

    // Create transporter (connect to email service)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SHOP_MAIL,
            pass: process.env.SHOP_PASS,
        },
    });

    // Build email content
    const htmlContent = `
    <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .order-summary { margin-top: 20px; }
                .order-summary table { width: 100%; border-collapse: collapse; }
                .order-summary th, .order-summary td { padding: 8px; text-align: left; }
                .order-summary th { background-color: #f2f2f2; }
                .order-summary tr:nth-child(even) { background-color: #f9f9f9; }
                .footer { margin-top: 30px; font-size: 12px; color: #888; }
                .track-link {
                    margin-top: 20px;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white !important;
                    border-radius: 5px;
                    text-align: center;
                    text-decoration: none;
                }
                .track-link:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h2>Hello ${fullname},</h2>
            <p>Thank you for shopping with us! Your order has been received and is currently being processed.</p>
            <p><strong>Order Details:</strong></p>
            <div class="order-summary">
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Color</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productOrdersInf.map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.productColorChose}</td>
                                <td>${item.productQuantityChose}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <p><strong>Shipping Address:</strong></p>
            <p>${addressUser}</p>
            <p><strong>Status:</strong> ${status}</p>

            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p>To track your order, click the link below:</p>
            <a href="http://localhost:${process.env.PORT}/delivery" class="track-link">Track Your Order</a>

            <p>If you have any questions, please feel free to contact us.</p>

            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} DKD Shop</p>
            </div>
        </body>
    </html>
    `;

    // Configure email options
    const mailOptions = {
        from: process.env.SHOP_MAIL,
        to: emailReceipt,
        subject: 'Order Confirmation - DKD Shop',
        html: htmlContent,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Email:', emailReceipt);
        console.log('Email sent:', info.response);
    });
};
