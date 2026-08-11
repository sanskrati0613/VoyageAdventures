const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "onboarding@resend.dev";

const ADMIN_EMAIL =
    process.env.CONTACT_RECEIVER_EMAIL ||
    process.env.EMAIL_USER;

async function sendEmail({
    to,
    subject,
    html,
    replyTo
}) {
    const { data, error } = await resend.emails.send({
        from: `Voyage Adventures <${FROM_EMAIL}>`,
        to,
        subject,
        html,
        ...(replyTo ? { replyTo } : {})
    });

    if (error) {
        console.error("Resend email failed:", error);
        throw new Error(
            error.message || "Failed to send email"
        );
    }

    console.log(
        `Resend email sent successfully: ${data?.id || "unknown"}`
    );

    return data;
}

module.exports = {
    sendEmail,
    ADMIN_EMAIL,
    FROM_EMAIL
};