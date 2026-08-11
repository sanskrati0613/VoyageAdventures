const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
    timeoutInSeconds: 15,
    maxRetries: 0
});

const FROM_EMAIL = process.env.EMAIL_USER;
const FROM_NAME = "Voyage Adventures";

const ADMIN_EMAIL =
    process.env.CONTACT_RECEIVER_EMAIL ||
    process.env.EMAIL_USER;


async function sendEmail({
    to,
    subject,
    html,
    replyTo
}) {

    try {

        const result =
            await brevo.transactionalEmails.sendTransacEmail({

                sender: {
                    email: FROM_EMAIL,
                    name: FROM_NAME
                },

                to: [
                    {
                        email: to
                    }
                ],

                subject,

                htmlContent: html,

                ...(replyTo
                    ? {
                        replyTo: {
                            email: replyTo
                        }
                    }
                    : {})
            });


        console.log(
            "Brevo email sent successfully:",
            result.messageId
        );


        return result;

    } catch (error) {

        console.error(
            "Brevo email failed:",
            error.message
        );

        throw error;

    }

}


module.exports = {
    sendEmail,
    ADMIN_EMAIL,
    FROM_EMAIL
};