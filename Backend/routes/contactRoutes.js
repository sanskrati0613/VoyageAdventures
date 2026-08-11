const express = require('express');

const ContactMessage = require('../models/ContactMessage');
const protectAdmin = require('../middleware/authMiddleware');

const {
    sendEmail,
    ADMIN_EMAIL
} = require('../config/mail');

const router = express.Router();


// =========================================================
// SUBMIT CONTACT MESSAGE
// Public
// =========================================================

router.post('/', async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        // Basic validation

        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            return res.status(400).json({
                message: 'Please fill in all fields'
            });

        }


        // Save message in MongoDB

        const contactMessage =
            await ContactMessage.create({
                name,
                email,
                subject,
                message
            });


        // Return success immediately after saving.
        // Email is attempted separately so a slow email
        // service cannot make the contact form hang.

        res.status(201).json({
            message:
                'Your message has been sent successfully',
            contactMessage
        });


        // Send email notification to admin

        try {

            await sendEmail({

                to: ADMIN_EMAIL,

                replyTo: email,

                subject:
                    `New Contact Message: ${subject}`,

                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 650px;
                        margin: auto;
                        color: #18324a;
                    ">

                        <h2>
                            New Contact Message
                        </h2>

                        <p>
                            <strong>Name:</strong>
                            ${name}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${email}
                        </p>

                        <p>
                            <strong>Subject:</strong>
                            ${subject}
                        </p>

                        <hr>

                        <p>
                            <strong>Message:</strong>
                        </p>

                        <p>
                            ${message}
                        </p>

                    </div>
                `

            });

            console.log(
                `Contact email sent from ${email}`
            );

        } catch (emailError) {

            console.error(
                'Contact email failed:',
                emailError.message
            );

        }


    } catch (error) {

        console.error(
            'Contact submission failed:',
            error.message
        );

        return res.status(500).json({
            message:
                'Failed to send your message'
        });

    }

});


// =========================================================
// GET ALL CONTACT MESSAGES
// Admin only
// =========================================================

router.get('/', protectAdmin, async (req, res) => {

    try {

        const messages =
            await ContactMessage
                .find()
                .sort({
                    createdAt: -1
                });

        res.json(messages);

    } catch (error) {

        console.error(
            'Failed to fetch contact messages:',
            error.message
        );

        res.status(500).json({
            message:
                'Failed to fetch contact messages'
        });

    }

});


// =========================================================
// MARK MESSAGE AS READ
// Admin only
// =========================================================

router.put('/:id/status', protectAdmin, async (req, res) => {

    try {

        const { status } = req.body;


        if (
            !['New', 'Read'].includes(status)
        ) {

            return res.status(400).json({
                message:
                    'Invalid message status'
            });

        }


        const message =
            await ContactMessage.findById(
                req.params.id
            );


        if (!message) {

            return res.status(404).json({
                message:
                    'Contact message not found'
            });

        }


        message.status = status;

        await message.save();


        res.json({

            message:
                'Message status updated successfully',

            contactMessage: message

        });


    } catch (error) {

        console.error(
            'Failed to update message:',
            error.message
        );

        res.status(500).json({
            message:
                'Failed to update message'
        });

    }

});


// =========================================================
// DELETE CONTACT MESSAGE
// Admin only
// =========================================================

router.delete('/:id', protectAdmin, async (req, res) => {

    try {

        const message =
            await ContactMessage.findByIdAndDelete(
                req.params.id
            );


        if (!message) {

            return res.status(404).json({
                message:
                    'Contact message not found'
            });

        }


        res.json({

            message:
                'Contact message deleted successfully'

        });


    } catch (error) {

        console.error(
            'Failed to delete contact message:',
            error.message
        );

        res.status(500).json({
            message:
                'Failed to delete contact message'
        });

    }

});


module.exports = router;