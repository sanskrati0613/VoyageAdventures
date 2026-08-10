const express = require('express');

const Testimonial =
    require('../models/Testimonial');

const protectAdmin =
    require('../middleware/authMiddleware');

const router = express.Router();


// ==========================================
// GET ALL TESTIMONIALS
// Public
// ==========================================

router.get('/', async (req, res) => {

    try {

        const testimonials =
            await Testimonial.find()
                .sort({
                    createdAt: -1
                });

        res.json(testimonials);

    } catch (error) {

        console.error(
            'Failed to fetch testimonials:',
            error.message
        );

        res.status(500).json({
            message:
                'Failed to fetch testimonials'
        });

    }

});


// ==========================================
// ADD TESTIMONIAL
// Admin only
// ==========================================

router.post(
    '/',
    protectAdmin,
    async (req, res) => {

        try {

            const {
                name,
                role,
                review,
                image,
                rating
            } = req.body;


            if (
                !name ||
                !role ||
                !review
            ) {

                return res.status(400).json({
                    message:
                        'Name, role and review are required.'
                });

            }


            const testimonial =
                await Testimonial.create({

                    name,
                    role,
                    review,
                    image:
                        image || '',
                    rating:
                        Number(rating) || 5

                });


            res.status(201).json({

                message:
                    'Testimonial added successfully',

                testimonial

            });

        } catch (error) {

            console.error(
                'Failed to add testimonial:',
                error.message
            );

            res.status(500).json({
                message:
                    'Failed to add testimonial'
            });

        }

    }
);


// ==========================================
// UPDATE TESTIMONIAL
// Admin only
// ==========================================

router.put(
    '/:id',
    protectAdmin,
    async (req, res) => {

        try {

            const testimonial =
                await Testimonial.findById(
                    req.params.id
                );


            if (!testimonial) {

                return res.status(404).json({
                    message:
                        'Testimonial not found'
                });

            }


            const {
                name,
                role,
                review,
                image,
                rating
            } = req.body;


            if (name !== undefined) {
                testimonial.name = name;
            }

            if (role !== undefined) {
                testimonial.role = role;
            }

            if (review !== undefined) {
                testimonial.review = review;
            }

            if (image !== undefined) {
                testimonial.image = image;
            }

            if (rating !== undefined) {
                testimonial.rating =
                    Number(rating);
            }


            await testimonial.save();


            res.json({

                message:
                    'Testimonial updated successfully',

                testimonial

            });

        } catch (error) {

            console.error(
                'Failed to update testimonial:',
                error.message
            );

            res.status(500).json({
                message:
                    'Failed to update testimonial'
            });

        }

    }
);


// ==========================================
// DELETE TESTIMONIAL
// Admin only
// ==========================================

router.delete(
    '/:id',
    protectAdmin,
    async (req, res) => {

        try {

            const testimonial =
                await Testimonial.findById(
                    req.params.id
                );


            if (!testimonial) {

                return res.status(404).json({
                    message:
                        'Testimonial not found'
                });

            }


            await testimonial.deleteOne();


            res.json({

                message:
                    'Testimonial deleted successfully'

            });

        } catch (error) {

            console.error(
                'Failed to delete testimonial:',
                error.message
            );

            res.status(500).json({
                message:
                    'Failed to delete testimonial'
            });

        }

    }
);


module.exports = router;