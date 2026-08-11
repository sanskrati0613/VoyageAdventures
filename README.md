✈️ Bon Voyage Adventures

Full-Stack Travel Planning, Booking & Payment Platform

Bon Voyage Adventures is a modern, responsive full-stack adventure travel platform designed to simplify the discovery, planning, booking, and payment of unique travel experiences.

The project started as a frontend-focused travel planning application and has evolved into a complete web application with a Node.js/Express backend, MongoDB database, user authentication, personalized bookings, an administrative dashboard, cloud image storage, email notifications, online payments, and cloud deployment.

Built as part of an IBM SkillsBuild Internship Project, the application demonstrates practical experience in frontend development, backend API development, database integration, authentication, CRUD operations, payment integration, cloud storage, responsive UI design, and deployment.

🌐 Live Demo

🚀 Live Website:https://voyage-adventures.vercel.app/

Frontend is deployed using Vercel and the backend is deployed using Render.

🗂️ GitHub Repository

https://github.com/sanskrati0613/VoyageAdventures

✨ Features

🧭 Destination Discovery

Browse available travel destinations.

View destination details, pricing, images, categories, regions, and descriptions.

Dynamically load destinations from the backend.

Filter destinations based on available travel options.

Display available departure dates and seat availability.

Destination images are now stored using Cloudinary, allowing uploaded images to work independently of the local/server filesystem.

🔎 Dynamic Destination Filtering

Users can explore trips using dynamic filtering functionality based on:

🌎 Region

🏷️ Travel category

💰 Price

🧗 Adventure type

Other destination attributes

The frontend dynamically processes and displays relevant destinations to improve the browsing experience.

🗓️ Departure & Availability Management

Each destination can contain multiple travel departures.

The platform supports:

Start and end dates

Total seats

Booked seats

Remaining seat availability

Selecting a specific departure while booking

Preventing bookings when insufficient seats are available

This allows the booking system to manage departure capacity rather than treating every booking as independent.

👤 User Authentication

The application includes a complete user authentication system.

User Registration

Users can create an account using:

Name

Username

Email

Phone number

Password

Confirm password

Passwords are securely hashed using bcrypt before being stored in MongoDB.

User Login

The platform supports:

User login

Admin login

Password verification

JWT-based authentication

Persistent login sessions using browser local storage

Separate user and administrator roles

Authentication is handled through the backend API.

👤 User Profile

Authenticated users have access to a personalized profile section.

Users can view:

Name

Username

Email

Phone number

Profile Menu

For authenticated users:

Profile
├── My Profile
├── My Bookings
└── Logout

For logged-out users:

Profile
├── Login
└── Create Account

🧾 Booking System

Bon Voyage Adventures includes a complete booking workflow.

Users can:

Select a destination

Select an available departure

Choose number of travelers

Select a travel package

Enter traveler information

Add special requests

View booking pricing

Proceed to payment

Complete payment through Razorpay

Have the payment verified by the backend

Receive a confirmed booking

Receive a unique booking reference

Receive a booking confirmation email

Each booking is stored in MongoDB.

💳 Razorpay Payment Integration

The booking process now includes an online payment gateway using Razorpay.

Payment Flow

Select Destination
        ↓
Select Departure
        ↓
Choose Travelers & Package
        ↓
Enter Traveler Details
        ↓
Review Booking
        ↓
Pay Now
        ↓
Razorpay Checkout
        ↓
Payment Completed
        ↓
Backend Payment Verification
        ↓
Booking Confirmed
        ↓
Booking Reference Generated
        ↓
Confirmation Email Sent

The booking is not treated as confirmed simply because the user opens the payment screen.

The backend verifies the Razorpay payment before confirming the booking.

Payment Data

The booking system can maintain payment-related information such as:

Payment status

Razorpay order ID

Razorpay payment ID

Razorpay signature

Booking status

Development / Testing

The current implementation uses Razorpay Test Mode so the payment workflow can be tested without charging real money.

Never commit Razorpay secret credentials to GitHub. Store them in environment variables.

📩 Booking Confirmation Emails

After a successfully verified payment and confirmed booking, the backend can send a booking confirmation email.

The email workflow is integrated using Nodemailer with Gmail SMTP/App Password configuration.

The confirmation process is designed to occur after successful payment verification rather than before payment.

👤 User-Specific Bookings

Bookings are associated with authenticated users using their MongoDB user ID.

This allows the application to distinguish between bookings made by different users.

JWT authentication is used to identify the logged-in user when creating and retrieving bookings.

🎫 Booking Reference

Every confirmed booking receives a unique booking reference.

Example:

VA123456

This reference can be used to identify a booking and provide a smoother booking management experience.

🧑‍💼 Admin Dashboard

The application includes an administrative dashboard for managing the platform.

Admin Features

🔐 Admin authentication

📊 Booking management

🧭 Destination management

📅 Departure management

👥 View booking information

🔎 Search bookings

🏷️ Filter bookings

📈 Booking statistics

🔄 Refresh booking data

✏️ Add and edit destinations

🖼️ Upload destination images

✏️ Add and edit departures

🗑️ Delete destinations/departures

🚪 Secure admin logout

Destination images uploaded through the admin panel are stored in Cloudinary rather than relying on the backend server's local filesystem.

☁️ Cloudinary Image Storage

Destination image uploads use Cloudinary.

Image Flow

Admin Dashboard
       ↓
Select Destination Image
       ↓
Multer Upload Middleware
       ↓
Cloudinary
       ↓
Cloudinary Image URL
       ↓
MongoDB Destination Document
       ↓
Frontend
       ↓
Destination Image

This solves the problem of local /uploads/... files disappearing or becoming unavailable after a cloud deployment/restart.

New destination records store a Cloudinary URL such as:

https://res.cloudinary.com/...

instead of depending on:

/uploads/destinations/...

📊 Booking Management

The admin dashboard provides booking statistics including:

Total bookings

Pending bookings

Confirmed bookings

Cancelled bookings

Administrators can also search and filter bookings based on available booking information.

💬 Testimonials

The platform includes a testimonial system for displaying traveler feedback.

Testimonials are loaded dynamically through the backend and displayed throughout the application to improve trust and social proof.

Testimonials can be managed through the backend/admin functionality.

📩 Contact System

The website includes a contact section where users can submit their inquiries.

Contact submissions are sent to the backend API and can be handled through the administrative system.

The frontend uses the deployed backend API rather than a hardcoded localhost endpoint in production.

📱 Responsive Design

Bon Voyage Adventures is designed to work across different screen sizes.

The interface supports:

💻 Desktop

💻 Laptop

📱 Mobile

📲 Tablet

The navigation system also includes a responsive mobile menu for smaller screens.

🎨 User Experience

The application focuses on providing a clean and intuitive travel booking experience.

Key UX considerations include:

Clear navigation

Destination-focused interface

Responsive layouts

Interactive booking forms

Validation before submitting forms

Dynamic loading states

User-friendly error messages

Authentication-aware navigation

Payment status feedback

Clear booking confirmation

Seat availability feedback

Responsive testimonial cards

Admin-friendly content management

🛠️ Technology Stack

Frontend

Technology

Purpose

HTML5

Page structure and semantic markup

CSS3

Styling and responsive layouts

JavaScript

Frontend functionality and DOM manipulation

Fetch API

Communication with backend APIs

Razorpay Checkout

Payment interface

Backend

Technology

Purpose

Node.js

Backend runtime environment

Express.js

REST API and server framework

MongoDB

Database

Mongoose

MongoDB object modeling

bcrypt.js

Password hashing

JSON Web Token (JWT)

Authentication and authorization

CORS

Cross-origin API communication

dotenv

Environment variable management

Multer

File upload handling

Cloudinary

Cloud image storage

Nodemailer

Email delivery

Razorpay SDK/API

Payment order creation and verification

Deployment & Cloud Services

Platform / Service

Purpose

Vercel

Frontend deployment

Render

Backend deployment

MongoDB Atlas

Cloud database

Cloudinary

Destination image storage

Razorpay

Online payment gateway

Gmail SMTP

Booking/contact email delivery

🏗️ Application Architecture

The project follows a client-server architecture with external cloud services for database, image storage, payment, and email functionality.

                         ┌─────────────────────┐
                         │      Frontend       │
                         │                     │
                         │   HTML / CSS / JS    │
                         │       Vercel         │
                         └──────────┬──────────┘
                                    │
                               REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Backend       │
                         │                     │
                         │  Node.js + Express  │
                         │       Render        │
                         └───────┬─┬─┬─┬───────┘
                                 │ │ │ │
                ┌────────────────┘ │ │ └────────────────┐
                │                  │ │                  │
                ▼                  ▼ ▼                  ▼
       ┌────────────────┐   ┌──────────────┐   ┌──────────────┐
       │ MongoDB Atlas  │   │  Cloudinary  │   │   Razorpay   │
       │                │   │              │   │              │
       │ Users          │   │ Destination  │   │ Payments     │
       │ Bookings       │   │ Images       │   │ Orders       │
       │ Destinations   │   └──────────────┘   │ Verification │
       │ Testimonials   │                      └──────────────┘
       │ Contacts       │
       │ Admins         │
       └────────────────┘

                              │
                              ▼
                       ┌──────────────┐
                       │   Nodemailer │
                       │ Gmail SMTP   │
                       │              │
                       │ Confirmation │
                       │ Emails       │
                       └──────────────┘

🔌 Backend API

The backend exposes REST API endpoints for different application features.

Destinations

/api/destinations

Used for retrieving and managing travel destinations, destination images, and departures.

Bookings

/api/bookings

Used for creating, verifying, confirming, and managing bookings and payment-related booking operations.

Users

/api/users

Used for user authentication:

POST /api/users/register
POST /api/users/login

Admin

/api/admin

Used for administrator functionality and protected operations.

Testimonials

/api/testimonials

Used for loading and managing testimonial data.

Contact

/api/contact

Used for handling contact form submissions.

🔐 Security

The application implements several security practices:

Passwords are hashed using bcrypt.

Passwords are never stored as plain text.

JWT tokens are used for authentication.

User and admin roles are separated.

Protected backend operations require authentication.

Payment verification is performed on the backend.

Environment variables are used for sensitive configuration.

MongoDB credentials are not hardcoded into the application.

Razorpay secrets are not hardcoded into the application.

Cloudinary API secrets are not hardcoded into the application.

.env files are excluded from Git.

Example environment variables:

PORT=5000

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_gmail_app_password

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Never commit .env files, API secrets, database credentials, payment secrets, or Cloudinary secrets to GitHub.

📁 Project Structure

VoyageAdventures/
│
├── Backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── mail.js
│   │   └── razorpay.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   ├── Destination.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── contactRoutes.js
│   │   └── testimonialRoutes.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── index.html
│   ├── my-bookings.html
│   ├── admin.html
│   ├── admin-login.html
│   ├── script.js
│   ├── my-bookings.js
│   ├── admin.js
│   ├── style.css
│   └── assets/
│
└── README.md

The exact structure may continue to evolve as the project develops.

🚀 Getting Started

Prerequisites

Before running the project locally, make sure you have:

Node.js

npm

MongoDB / MongoDB Atlas account

Git

A modern web browser

Cloudinary account for destination image uploads

Razorpay account for payment testing

Gmail account/App Password if email functionality is required

1️⃣ Clone the Repository

git clone https://github.com/sanskrati0613/VoyageAdventures.git
cd VoyageAdventures

2️⃣ Backend Setup

Navigate to the backend:

cd Backend

Install dependencies:

npm install

Create a .env file containing the required environment variables.

Start the backend:

node server.js

For development, if nodemon is installed:

nodemon server.js

The backend will run locally on:

http://localhost:5000

3️⃣ Frontend Setup

Open the Frontend folder.

The frontend can be served using a local development server such as Live Server in VS Code.

For local development, the frontend can communicate with:

http://localhost:5000

For production, the frontend communicates with the deployed Render backend.

☁️ Deployment

The application uses a separate frontend and backend deployment architecture.

Frontend

Vercel

Backend

Render

Database

MongoDB Atlas

Images

Cloudinary

Payments

Razorpay Test Mode

Email

Gmail SMTP through Nodemailer

The frontend and backend operate independently while communicating through REST APIs.

🧪 Testing

The application can be tested through the following workflows.

User Flow

Create Account
      ↓
Login
      ↓
View Profile
      ↓
Browse Destinations
      ↓
Select Destination
      ↓
Select Departure
      ↓
Choose Package
      ↓
Enter Traveler Details
      ↓
Review Booking
      ↓
Pay Now
      ↓
Razorpay Test Checkout
      ↓
Payment Verification
      ↓
Booking Confirmed
      ↓
Booking Reference
      ↓
Confirmation Email
      ↓
View My Booking

Admin Flow

Admin Login
      ↓
Admin Dashboard
      ↓
View Bookings
      ↓
Search / Filter
      ↓
Manage Destinations
      ↓
Upload Destination Image
      ↓
Cloudinary Storage
      ↓
Manage Departures

Payment Testing

Razorpay should be tested using Test Mode credentials/test payment methods.

No real-money transaction is required for development testing.

🎯 Project Goals

The primary goals of Bon Voyage Adventures are to:

Create an intuitive travel discovery experience.

Simplify the travel booking process.

Provide secure user authentication.

Store booking information using a database.

Provide administrators with tools to manage the platform.

Provide reliable cloud-based destination image storage.

Integrate an online payment workflow.

Verify payments before confirming bookings.

Send booking confirmation emails.

Build a responsive experience across devices.

Demonstrate practical full-stack development skills.

🗺️ Future Scope

Although the application now includes authentication, booking, administration, cloud image storage, email communication, and payment processing, several enhancements can be added in future versions.

🤖 AI-Powered Recommendations

Use AI to recommend destinations and packages based on:

User preferences

Previous bookings

Budget

Travel interests

Browsing behavior

⭐ Reviews & Ratings

Allow authenticated users to:

Rate destinations

Submit reviews

View traveler ratings

❤️ Saved Destinations

Allow users to save destinations to a personalized wishlist.

📊 Advanced User Dashboard

Expand the profile system into a complete dashboard containing:

Upcoming trips

Previous bookings

Saved destinations

Reviews

Account information

🌎 Multilingual Support

Add multiple languages to make the platform accessible to a wider international audience.

📧 Advanced Automated Notifications

Expand notifications for:

Account registration

Booking confirmation

Payment confirmation

Booking status updates

Travel reminders

Departure reminders

📱 Progressive Web App

Convert the application into a Progressive Web App (PWA) for an improved mobile experience.

💳 Production Payment Configuration

The current payment integration uses Razorpay Test Mode. A future production release can switch to Razorpay Live Mode after completing the required merchant/account setup and production testing.

💡 What I Learned

This project provided practical experience in:

Frontend web development

Responsive UI design

JavaScript DOM manipulation

REST API development

Node.js and Express

MongoDB and Mongoose

CRUD operations

User authentication

JWT authorization

Password hashing

Role-based access

Database relationships

Booking management

Payment gateway integration

Payment verification

Cloudinary image storage

Email integration with Nodemailer

API integration

Deployment

Debugging production applications

Git and GitHub workflow

👩‍💻 Developer

Sanskrati Jain

🎓 Computer Science Engineering💻 Full-Stack / Web Developer

📧 Email: sanskratijain88@gmail.com

💼 LinkedIn:https://www.linkedin.com/in/sanskrati-jain-295b65271/

🏆 Internship Project

This project was developed as part of the:

IBM SkillsBuild Internship

The project provided an opportunity to apply web development concepts to a practical, real-world application while progressively expanding the project from a frontend travel website into a full-stack travel discovery, booking, payment, and administration platform.

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub!

📜 License

This project is developed for educational and portfolio purposes.