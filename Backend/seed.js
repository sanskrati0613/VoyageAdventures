const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Destination = require('./models/Destination');

dotenv.config();

const destinations = [
    {
        name: 'Kashmir',
        location: 'Kashmir, India',
        image: 'assets/KASHMIR.jpg',
        rating: 4.8,
        price: 12999,
        duration: '5 Days / 4 Nights',
        bestTime: 'April – October',
        type: 'Mountain Adventure',

        description:
            'Discover the breathtaking beauty of Kashmir through peaceful lakes, snow-capped mountains, beautiful valleys and unforgettable Himalayan experiences.',

        highlights: [
            'Dal Lake Shikara Ride',
            'Gulmarg Exploration',
            'Pahalgam Valley',
            'Sonamarg Visit',
            'Local Kashmiri Cuisine',
            'Scenic Mountain Trails'
        ],

        departures: [
            {
                startDate: new Date('2026-09-20'),
                endDate: new Date('2026-09-24'),
                totalSeats: 10,
                bookedSeats: 0
            },
            {
                startDate: new Date('2026-10-15'),
                endDate: new Date('2026-10-19'),
                totalSeats: 15,
                bookedSeats: 0
            }
        ]
    },

    {
        name: 'Varanasi',
        location: 'Varanasi, India',
        image: 'assets/varanasi.jpg',
        rating: 4.7,
        price: 8999,
        duration: '4 Days / 3 Nights',
        bestTime: 'October – March',
        type: 'Cultural Experience',

        description:
            'Experience the spiritual heart of India through ancient ghats, mesmerizing Ganga Aarti ceremonies, historic temples and the vibrant streets of Varanasi.',

        highlights: [
            'Ganga Aarti',
            'Sunrise Boat Ride',
            'Kashi Vishwanath Temple',
            'Historic Ghats',
            'Local Food Walk',
            'Cultural Experiences'
        ],

        departures: [
            {
                startDate: new Date('2026-09-15'),
                endDate: new Date('2026-09-18'),
                totalSeats: 10,
                bookedSeats: 0
            },
            {
                startDate: new Date('2026-10-10'),
                endDate: new Date('2026-10-13'),
                totalSeats: 15,
                bookedSeats: 0
            }
        ]
    },

    {
        name: 'Manali',
        location: 'Manali, Himachal Pradesh',
        image: 'assets/mountain.jpg',
        rating: 4.9,
        price: 10999,
        duration: '5 Days / 4 Nights',
        bestTime: 'March – June',
        type: 'Adventure',

        description:
            'Escape into the Himalayas and experience spectacular mountain scenery, adventurous activities, peaceful valleys and the unique charm of Manali.',

        highlights: [
            'Solang Valley',
            'Rohtang Pass',
            'River Rafting',
            'Mountain Trekking',
            'Old Manali',
            'Local Himalayan Cuisine'
        ],

        departures: [
            {
                startDate: new Date('2026-09-25'),
                endDate: new Date('2026-09-29'),
                totalSeats: 10,
                bookedSeats: 0
            },
            {
                startDate: new Date('2026-10-20'),
                endDate: new Date('2026-10-24'),
                totalSeats: 15,
                bookedSeats: 0
            }
        ]
    }
];


const seedDatabase = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log('MongoDB connected');


        for (const destination of destinations) {

            await Destination.findOneAndUpdate(

                {
                    name: destination.name
                },

                {
                    $set: destination
                },

                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }

            );

            console.log(
                `${destination.name} updated successfully`
            );
        }


        console.log(
            'Destinations updated successfully'
        );


        await mongoose.connection.close();

    } catch (error) {

        console.error(
            'Seeding failed:',
            error.message
        );

        process.exit(1);

    }
};


seedDatabase();