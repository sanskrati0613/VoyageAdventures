const { sendEmail } = require('../config/mail');


async function sendBookingEmail(booking, type) {

    let subject;
    let title;
    let message;


    // =====================================================
    // BOOKING CREATED
    // =====================================================

    if (type === 'created') {

        subject =
            `Booking Request Received - ${booking.bookingReference}`;

        title =
            'Booking Request Received';

        message = `
            Thank you for choosing Voyage Adventures.
            We have received your booking request and it is
            currently awaiting confirmation.
        `;

    }


    // =====================================================
    // BOOKING CONFIRMED
    // =====================================================

    if (type === 'confirmed') {

        subject =
            `Booking Confirmed - ${booking.bookingReference}`;

        title =
            'Booking Confirmed!';

        message = `
            Great news! Your Voyage Adventures booking has
            been confirmed.
        `;

    }


    // =====================================================
    // BOOKING CANCELLED
    // =====================================================

    if (type === 'cancelled') {

        subject =
            `Booking Cancelled - ${booking.bookingReference}`;

        title =
            'Booking Cancelled';

        message = `
            Your Voyage Adventures booking has been cancelled.
            Please contact us if you have any questions.
        `;

    }


    // =====================================================
    // EMAIL CONTENT
    // =====================================================

    const html = `

        <div style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            color: #18324a;
        ">

            <h2>
                ${title}
            </h2>


            <p>
                Hello ${booking.customerName},
            </p>


            <p>
                ${message}
            </p>


            <h3>
                Booking Details
            </h3>


            <p>
                <strong>Booking Reference:</strong>
                ${booking.bookingReference}
            </p>


            <p>
                <strong>Destination:</strong>
                ${booking.destination}
            </p>


            <p>
                <strong>Travelers:</strong>
                ${booking.travelers}
            </p>


            <p>
                <strong>Package:</strong>
                ${booking.package}
            </p>


            <p>
                <strong>Start Date:</strong>
                ${booking.startDate
                    .toISOString()
                    .split('T')[0]}
            </p>


            <p>
                <strong>End Date:</strong>
                ${booking.endDate
                    .toISOString()
                    .split('T')[0]}
            </p>


            <p>
                <strong>Price per Person:</strong>
                ₹${booking.pricePerPerson
                    .toLocaleString('en-IN')}
            </p>


            <p>
                <strong>Total Price:</strong>
                ₹${booking.totalPrice
                    .toLocaleString('en-IN')}
            </p>


            <p>
                <strong>Status:</strong>
                ${booking.status}
            </p>


            <h3>
                Special Request
            </h3>


            <p>
                ${booking.specialRequest || 'None'}
            </p>


            <hr>


            <p>
                We look forward to helping you have
                an amazing trip!
            </p>


            <p>
                — Voyage Adventures
            </p>

        </div>

    `;


    // =====================================================
    // SEND EMAIL
    // =====================================================

    await sendEmail({

        to: booking.customerEmail,

        subject,

        html

    });

}


module.exports = sendBookingEmail;