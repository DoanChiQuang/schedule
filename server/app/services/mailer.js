import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const prepareHtml = ({
    title,
    content,
    bodyTitle,
    bodyUser,
    bodyMessage,
    bodyUrl,
    bodyButtonText,
}) => {
    return `<!doctype html>
            <html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>${title}</title>
                    <meta name="description" content="${content}" />
                    <style>
                        html {
                            font-family: Arial, Helvetica, sans-serif;
                        }

                        body {
                            display: flex;
                            justify-content: center;
                            margin: 16px;
                        }

                        h4, p {
                            margin: 0;
                        }

                        a {
                            text-decoration: none;
                        }

                        .mt-4 {
                            margin-top: 16px;
                        }

                        .btn {
                            padding: 8px;
                            background-color: black;
                            color: white;
                            border-radius: 4px;
                        }

                        .card {
                            display: flex;
                            flex-direction: column;
                        }
                        .card__header {
                            padding: 16px;
                            border-bottom: 2px solid #ccc;
                            font-size: 20px;
                            font-weight: 500;
                            text-align: center;
                        }
                        .card__content {
                            padding: 16px;
                        }
                        .card__footer {
                            padding: 16px;
                            border-top: 2px solid #ccc;
                        }            
                    </style>
                </head>

                <body>
                    <div class="card">
                        <div class="card__header">
                            <h4>Schedule</h4>
                        </div>
                        <div class="card__content">
                            <h4>${bodyTitle}</h4>
                            <p class="mt-4">Hi ${bodyUser},</p>
                            <p class="mt-4">${bodyMessage}</p>
                            <a href="${bodyUrl}" class="btn mt-4" style="display: inline-block;">${bodyButtonText}</a>
                        </div>
                        <div class="card__footer">
                            <p>Cheers,</p>
                            <p class="mt-4">The Schedule</p>
                        </div>
                    </div>
                </body>
            </html>`;
};

export const send = async ({
    receipients,
    subject,
    message = '',
    html = '',
}) => {
    return await transporter.sendMail({
        from: 'no-reply@schedule.com',
        to: receipients,
        subject,
        text: message,
        html: html,
    });
};
