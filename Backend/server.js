const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
]);

const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

const destinationRoutes = require('./routes/destinationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

const transporter = require('./config/mail');

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(
    '/uploads',
    express.static(
        path.join(
            __dirname,
            'uploads'
        )
    )
);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Voyage Adventures backend is running!'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});