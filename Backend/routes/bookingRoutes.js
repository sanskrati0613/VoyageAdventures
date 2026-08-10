const protectAdmin = require('../middleware/authMiddleware');
const protectUser = require('../middleware/userAuthMiddleware');
const mongoose = require('mongoose');
const express = require('express');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const sendBookingEmail = require('../config/bookingEmail');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {

    const session = await mongoose.startSession();

    try {
        console.log("BOOKING REQUEST STARTED");

        let loggedInUserId = null;

const authHeader = req.headers.authorization;

if (
    authHeader &&
    authHeader.startsWith("Bearer ")
) {
    try {

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role === "user") {
            loggedInUserId = decoded.id;
        }

    } catch (error) {

        console.log(
            "Optional user authentication failed."
        );

    }
}

        const {
            customerName,
            customerEmail,
            customerPhone,
            specialRequest,
            bookingReference,
            destinationId,
            departureId,
            travelers,
            package: tripPackage,
            pricePerPerson,
            totalPrice
        } = req.body;

        const travelerCount = Number(travelers);

        // =====================================================
        // BASIC VALIDATION
        // =====================================================

        if (
            !destinationId ||
            !departureId ||
            !travelers
        ) {
            return res.status(400).json({
                message:
                    'Destination, departure and travelers are required.'
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(destinationId) ||
            !mongoose.Types.ObjectId.isValid(departureId)
        ) {
            return res.status(400).json({
                message:
                    'Invalid destination or departure.'
            });
        }

        if (
            !Number.isInteger(travelerCount) ||
            travelerCount < 1
        ) {
            return res.status(400).json({
                message:
                    'Invalid number of travelers.'
            });
        }


        // =====================================================
        // TRANSACTION
        // =====================================================

        let booking;
        let bookingDeparture;
console.log("BOOKING TRANSACTION STARTED");

        await session.withTransaction(async () => {

            // -------------------------------------------------
            // Find destination
            // -------------------------------------------------
console.log("Finding destination...");
            const destination =
                await Destination.findById(
                    destinationId
                ).session(session);
console.log("Destination found");
            if (!destination) {
                throw new Error(
                    'Destination not found.'
                );
            }


            // -------------------------------------------------
            // Find selected departure
            // -------------------------------------------------

            const departure =
                destination.departures.id(
                    departureId
                );

            if (!departure) {
                throw new Error(
                    'Selected departure is no longer available.'
                );
            }


            // -------------------------------------------------
            // Check available seats
            // -------------------------------------------------

            const availableSeats =
                departure.totalSeats -
                departure.bookedSeats;

            if (travelerCount > availableSeats) {

                const error =
                    new Error(
                        `Only ${availableSeats} seats are available for this departure.`
                    );

                error.code = 'INSUFFICIENT_SEATS';
                error.availableSeats = availableSeats;

                throw error;
            }


            // -------------------------------------------------
            // Reserve seats
            // -------------------------------------------------

            departure.bookedSeats += travelerCount;
console.log("Saving destination...");
            await destination.save({
                session
            });
console.log("Destination saved");

            // -------------------------------------------------
            // Create booking
            // -------------------------------------------------

            booking =
                new Booking({

                    customerName,

                    customerEmail,

                    customerPhone,

                    specialRequest,

                    bookingReference,

                    destination:
                        destination.name,

                    departureId,

                    userId: loggedInUserId,

                    travelers:
                        travelerCount,

                    package:
                        tripPackage,

                    // Dates come from the admin departure
                    startDate:
                        departure.startDate,

                    endDate:
                        departure.endDate,

                    pricePerPerson,

                    totalPrice

                });

console.log("Saving booking...");
            await booking.save({
                session
            });
console.log("Booking saved");

            bookingDeparture = {
                startDate:
                    departure.startDate,

                endDate:
                    departure.endDate,

                totalSeats:
                    departure.totalSeats,

                bookedSeats:
                    departure.bookedSeats,

                availableSeats:
                    departure.totalSeats -
                    departure.bookedSeats
            };

        });
console.log("BOOKING TRANSACTION COMPLETED");
// =====================================================
// EMAIL
// =====================================================

sendBookingEmail(
    booking,
    'created'
)
    .then(() => {
        console.log(
            `Booking email sent to ${booking.customerEmail}`
        );
    })
    .catch((emailError) => {
        console.error(
            'Booking email failed:',
            emailError.message
        );
    });


// =====================================================
// SUCCESS RESPONSE
// =====================================================

res.status(201).json({

    message:
        'Booking created successfully',

    booking,

    departure:
        bookingDeparture

});


    } catch (error) {

        console.error(
            'Booking creation failed:',
            error.message
        );


        // -----------------------------------------------------
        // NOT ENOUGH SEATS
        // -----------------------------------------------------

        if (
            error.code ===
            'INSUFFICIENT_SEATS'
        ) {

            return res.status(400).json({

                message:
                    error.message,

                availableSeats:
                    error.availableSeats

            });

        }


        // -----------------------------------------------------
        // GENERAL ERROR
        // -----------------------------------------------------

        res.status(500).json({

            message:
                'Failed to create booking'

        });

    } finally {

        await session.endSession();

    }

});

// Get all bookings
router.get('/', protectAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error.message);

        res.status(500).json({
            message: 'Failed to fetch bookings'
        });
    }
});

// Customer: look up booking by reference and email
router.post('/lookup', async (req, res) => {
    try {
        const { bookingReference, email } = req.body;

        if (!bookingReference || !email) {
            return res.status(400).json({
                message: 'Booking reference and email are required'
            });
        }

        const booking = await Booking.findOne({
            bookingReference: bookingReference.trim().toUpperCase(),
            customerEmail: email.trim().toLowerCase()
        });

        if (!booking) {
            return res.status(404).json({
                message: 'No booking found with these details'
            });
        }

        res.json({
            bookingReference: booking.bookingReference,
            destination: booking.destination,
            startDate: booking.startDate,
            endDate: booking.endDate,
            travelers: booking.travelers,
            package: booking.package,
            pricePerPerson: booking.pricePerPerson,
            totalPrice: booking.totalPrice,
            status: booking.status,
            specialRequest: booking.specialRequest
        });

    } catch (error) {
        console.error('Booking lookup failed:', error.message);

        res.status(500).json({
            message: 'Unable to look up booking'
        });
    }
});

// =========================================
// GET LOGGED-IN USER'S BOOKINGS
// =========================================

router.get('/my', protectUser, async (req, res) => {

    try {

        const bookings = await Booking
            .find({
                userId: req.user.id
            })
            .sort({
                createdAt: -1
            });

        res.json(bookings);

    } catch (error) {

        console.error(
            'Failed to fetch user bookings:',
            error.message
        );

        res.status(500).json({
            message: 'Failed to fetch your bookings'
        });
    }
});

// Get a single booking
router.get('/:id', protectAdmin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        res.json(booking);

    } catch (error) {
        console.error('Failed to fetch booking:', error.message);

        res.status(500).json({
            message: 'Failed to fetch booking'
        });
    }
});

// Update booking status
router.put('/:id/status', protectAdmin, async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const { status } = req.body;

        const allowedStatuses = [
            'Pending',
            'Confirmed',
            'Cancelled'
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: 'Invalid booking status'
            });

        }


        let booking;
        let shouldSendCancellationEmail = false;
        let shouldSendConfirmationEmail = false;


        await session.withTransaction(async () => {

            // =====================================================
            // FIND BOOKING
            // =====================================================

            booking = await Booking.findById(
                req.params.id
            ).session(session);


            if (!booking) {

                const error =
                    new Error('Booking not found');

                error.code = 'BOOKING_NOT_FOUND';

                throw error;

            }


            const oldStatus = booking.status;


            // =====================================================
            // NOTHING TO DO IF STATUS IS ALREADY THE SAME
            // =====================================================

            if (oldStatus === status) {
                return;
            }


            // =====================================================
            // RELEASE SEATS WHEN CANCELLED
            // =====================================================

            if (
                status === 'Cancelled' &&
                oldStatus !== 'Cancelled'
            ) {

                // Old bookings created before the
                // departure system may not have a departureId.

                if (booking.departureId) {

                    const destination =
                        await Destination.findOne({

                            'departures._id':
                                booking.departureId

                        }).session(session);


                    if (destination) {

                        const departure =
                            destination.departures.id(
                                booking.departureId
                            );


                        if (departure) {

                            departure.bookedSeats =
                                Math.max(
                                    0,
                                    departure.bookedSeats -
                                    booking.travelers
                                );


                            await destination.save({
                                session
                            });

                        }

                    }

                }

                shouldSendCancellationEmail = true;

            }


            // =====================================================
            // UPDATE BOOKING STATUS
            // =====================================================

            booking.status = status;

            await booking.save({
                session
            });


            // =====================================================
            // CONFIRMATION EMAIL
            // =====================================================

            if (status === 'Confirmed') {

                shouldSendConfirmationEmail = true;

            }

        });


        // =====================================================
        // SEND STATUS EMAIL
        // =====================================================

        if (shouldSendConfirmationEmail) {

            try {

                await sendBookingEmail(
                    booking,
                    'confirmed'
                );

                console.log(
                    `Status email sent to ${booking.customerEmail}`
                );

            } catch (emailError) {

                console.error(
                    'Status email failed:',
                    emailError.message
                );

            }

        }


        if (shouldSendCancellationEmail) {

            try {

                await sendBookingEmail(
                    booking,
                    'cancelled'
                );

                console.log(
                    `Status email sent to ${booking.customerEmail}`
                );

            } catch (emailError) {

                console.error(
                    'Status email failed:',
                    emailError.message
                );

            }

        }


        res.json({

            message:
                'Booking status updated successfully',

            booking

        });


    } catch (error) {

        console.error(
            'Failed to update booking status:',
            error.message
        );


        if (
            error.code ===
            'BOOKING_NOT_FOUND'
        ) {

            return res.status(404).json({
                message: 'Booking not found'
            });

        }


        res.status(500).json({

            message:
                'Failed to update booking status'

        });

    } finally {

        await session.endSession();

    }

});

// Cancel a booking
router.put('/:id/cancel', protectAdmin, async (req, res) => {
    try {

        const booking = await Booking.findById(
            req.params.id
        );

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({
                message: 'Booking is already cancelled'
            });
        }

        booking.status = 'Cancelled';

        await booking.save();

        try {

            await sendBookingEmail(
                booking,
                'cancelled'
            );

            console.log(
                `Cancellation email sent to ${booking.customerEmail}`
            );

        } catch (emailError) {

            console.error(
                'Cancellation email failed:',
                emailError.message
            );
        }

        res.json({
            message: 'Booking cancelled successfully',
            booking
        });

    } catch (error) {

        console.error(
            'Failed to cancel booking:',
            error.message
        );

        res.status(500).json({
            message: 'Failed to cancel booking'
        });
    }
});

module.exports = router;