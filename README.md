# ✈️ Bon Voyage Adventures

### Full-Stack Travel Planning & Booking Platform

Bon Voyage Adventures is a modern, responsive **full-stack adventure travel platform** designed to simplify the discovery, planning, and booking of unique travel experiences.

The project started as a frontend-focused travel planning application and has evolved into a complete web application with a **Node.js/Express backend, MongoDB database, user authentication, personalized bookings, an administrative dashboard, and cloud deployment**.

Built as part of an **IBM SkillsBuild Internship Project**, the application demonstrates practical experience in frontend development, backend API development, database integration, authentication, CRUD operations, responsive UI design, and deployment.

---

## 🌐 Live Demo

🚀 **Live Website:**  
https://voyage-adventures.vercel.app/

> Frontend deployed using Vercel and backend deployed using Render.

---

## 📂 Repository

🗂️ **GitHub Repository:**  
https://github.com/sanskrati0613/VoyageAdventures

---

# ✨ Features

## 🧭 Destination Discovery

- Browse available destinations.
- View destination details, pricing, images, categories, and regions.
- Dynamically load destinations from the backend.
- Filter destinations based on available travel options.
- Display available departure dates and seat availability.

## 🔎 Dynamic Destination Filtering

Users can explore trips using dynamic filtering functionality based on:

- 🌎 Region
- 🏷️ Travel category
- 💰 Price
- 🧗 Adventure type
- Other destination attributes

The frontend dynamically processes and displays relevant destinations to improve the browsing experience.

## 🗓️ Departure & Availability Management

Each destination can contain multiple travel departures.

The platform supports:

- Start and end dates
- Total seats
- Booked seats
- Remaining seat availability
- Selecting a specific departure while booking
- Preventing bookings when insufficient seats are available

This allows the booking system to manage actual departure capacity rather than treating every booking as independent.

---

# 👤 User Authentication

The application includes a complete user authentication system.

### User Registration

Users can create an account using:

- Name
- Username
- Email
- Phone number
- Password
- Confirm password

Passwords are securely hashed using **bcrypt** before being stored in MongoDB.

### User Login

The platform supports:

- User login
- Admin login
- Password verification
- JWT-based authentication
- Persistent login sessions using browser local storage
- Separate user and administrator roles

Authentication is handled through the backend API.

---

# 👤 User Profile

Authenticated users have access to a personalized profile section.

Users can view:

- Name
- Username
- Email
- Phone number

The profile interface dynamically changes depending on whether the user is logged in or logged out.

### Profile Menu

For authenticated users:

```text
Profile
├── My Profile
├── My Bookings
└── Logout
```

For logged-out users:

```text
Profile
├── Login
└── Create Account
```

---

# 🧾 Booking System

Bon Voyage Adventures includes a complete booking workflow.

Users can:

1. Select a destination
2. Select an available departure
3. Choose number of travelers
4. Select a travel package
5. Enter traveler information
6. Add special requests
7. View booking pricing
8. Confirm the booking
9. Receive a unique booking reference

Each booking is stored in MongoDB.

### Booking Information

Bookings contain information such as:

- Customer name
- Customer email
- Customer phone
- Destination
- Destination ID
- Departure ID
- Number of travelers
- Package
- Price per person
- Total price
- Special requests
- Booking reference
- User ID
- Booking status

---

# 🔐 User-Specific Bookings

Bookings are associated with authenticated users using their MongoDB user ID.

This allows the application to distinguish between bookings made by different users.

JWT authentication is used to identify the logged-in user when creating and retrieving bookings.

---

# 🎫 Booking Reference

Every booking receives a unique booking reference.

Example:

```text
VA123456
```

This reference can be used to identify a booking and provide a smoother booking management experience.

---

# 🧑‍💼 Admin Dashboard

The application includes an administrative dashboard for managing the platform.

### Admin Features

- 🔐 Admin authentication
- 📊 Booking management
- 🧭 Destination management
- 📅 Departure management
- 👥 View booking information
- 🔎 Search bookings
- 🏷️ Filter bookings
- 📈 Booking statistics
- 🔄 Refresh booking data
- ✏️ Add and edit departures
- 🗑️ Delete departures
- 🚪 Secure admin logout

---

# 📊 Booking Management

The admin dashboard provides booking statistics including:

- Total bookings
- Pending bookings
- Confirmed bookings
- Cancelled bookings

Administrators can also search and filter bookings based on available booking information.

---

# 💬 Testimonials

The platform includes a testimonial system for displaying traveler feedback.

Testimonials are loaded dynamically through the backend and displayed throughout the application to improve trust and social proof.

---

# 📩 Contact System

The website includes a contact section where users can submit their inquiries.

Contact submissions are handled through the backend API and stored for administrative access.

---

# 📱 Responsive Design

Bon Voyage Adventures is designed to work across different screen sizes.

The interface supports:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📲 Tablet

The navigation system also includes a responsive mobile menu for smaller screens.

---

# 🎨 User Experience

The application focuses on providing a clean and intuitive travel booking experience.

Key UX considerations include:

- Clear navigation
- Destination-focused interface
- Responsive layouts
- Interactive booking forms
- Validation before submitting forms
- Dynamic loading states
- User-friendly error messages
- Authentication-aware navigation
- Clear booking confirmation
- Seat availability feedback

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling and responsive layouts |
| JavaScript | Frontend functionality and DOM manipulation |
| Fetch API | Communication with backend APIs |

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Backend runtime environment |
| Express.js | REST API and server framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| bcrypt.js | Password hashing |
| JSON Web Token (JWT) | Authentication and authorization |
| CORS | Cross-origin API communication |
| dotenv | Environment variable management |

## Deployment

| Platform | Purpose |
|----------|---------|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |

---

# 🏗️ Application Architecture

The project follows a client-server architecture.

```text
                 ┌─────────────────────┐
                 │      Frontend       │
                 │                     │
                 │ HTML / CSS / JS     │
                 │      Vercel         │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Backend       │
                 │                     │
                 │ Node.js + Express   │
                 │      Render         │
                 └──────────┬──────────┘
                            │
                         Mongoose
                            │
                            ▼
                 ┌─────────────────────┐
                 │      MongoDB        │
                 │                     │
                 │ Users               │
                 │ Bookings            │
                 │ Destinations        │
                 │ Testimonials        │
                 │ Contacts            │
                 │ Admins              │
                 └─────────────────────┘
```

---

# 🔌 Backend API

The backend exposes REST API endpoints for different application features.

### Destinations

```text
/api/destinations
```

Used for retrieving and managing travel destinations and departures.

### Bookings

```text
/api/bookings
```

Used for creating and managing bookings.

### Users

```text
/api/users
```

Used for user authentication:

```text
POST /api/users/register
POST /api/users/login
```

### Admin

```text
/api/admin
```

Used for administrator functionality and protected operations.

### Testimonials

```text
/api/testimonials
```

Used for loading testimonial data.

### Contact

```text
/api/contact
```

Used for handling contact form submissions.

---

# 🔐 Security

The application implements several security practices:

- Passwords are hashed using bcrypt.
- Passwords are never stored as plain text.
- JWT tokens are used for authentication.
- User and admin roles are separated.
- Protected backend operations require authentication.
- Environment variables are used for sensitive configuration.
- MongoDB credentials and JWT secrets are not hardcoded into the application.

Example environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never commit `.env` files or database credentials to GitHub.

---

# 📁 Project Structure

The project is organized into separate frontend and backend sections.

```text
Bon-Voyage-Adventures/
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Booking.js
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
```

> The exact file structure may change as the project continues to evolve.

---

# 🚀 Getting Started

## Prerequisites

Before running the project locally, make sure you have:

- Node.js
- npm
- MongoDB / MongoDB Atlas account
- Git
- A modern web browser

## 1️⃣ Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd Bon-Voyage-Adventures
```

## 2️⃣ Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
node server.js
```

For development, if you have nodemon installed:

```bash
nodemon server.js
```

The backend will run on:

```text
http://localhost:5000
```

## 3️⃣ Frontend Setup

Open the `Frontend` folder.

The frontend can be served using a local development server such as **Live Server** in VS Code.

Make sure the frontend API configuration points to your backend URL.

For local development:

```text
http://localhost:5000
```

For production:

```text
https://your-render-backend-url
```

---

# ☁️ Deployment

The application is deployed using a separate frontend and backend architecture.

### Frontend

```text
Vercel
```

### Backend

```text
Render
```

### Database

```text
MongoDB Atlas
```

This allows the frontend and backend to operate independently while communicating through REST APIs.

---

# 🧪 Testing

The application can be tested through the following workflows.

### User Flow

```text
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
Create Booking
      ↓
View Booking
```

### Admin Flow

```text
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
Manage Departures
```

---

# 🎯 Project Goals

The primary goals of Bon Voyage Adventures are to:

- Create an intuitive travel discovery experience.
- Simplify the travel booking process.
- Provide secure user authentication.
- Store real booking information using a database.
- Provide administrators with tools to manage the platform.
- Build a responsive experience across devices.
- Demonstrate practical full-stack development skills.

---

# 🗺️ Future Scope

Although the application currently provides a complete travel discovery and booking workflow, several enhancements can be added in future versions.

### 💳 Secure Online Payments

Integrate payment gateways such as Razorpay or Stripe to allow users to complete payments directly through the platform.

### 🤖 AI-Powered Recommendations

Use AI to recommend destinations and packages based on:

- User preferences
- Previous bookings
- Budget
- Travel interests
- Browsing behavior

### ⭐ Reviews & Ratings

Allow authenticated users to:

- Rate destinations
- Submit reviews
- View traveler ratings

### ❤️ Saved Destinations

Allow users to save destinations to a personalized wishlist.

### 📊 Advanced User Dashboard

Expand the profile system into a complete dashboard containing:

- Upcoming trips
- Previous bookings
- Saved destinations
- Reviews
- Account information

### 🌎 Multilingual Support

Add multiple languages to make the platform accessible to a wider international audience.

### 📧 Automated Notifications

Add email notifications for:

- Account registration
- Booking confirmation
- Booking status updates
- Travel reminders

### 📱 Progressive Web App

Convert the application into a Progressive Web App (PWA) for an improved mobile experience.

---

# 💡 What I Learned

This project provided practical experience in:

- Frontend web development
- Responsive UI design
- JavaScript DOM manipulation
- REST API development
- Node.js and Express
- MongoDB and Mongoose
- CRUD operations
- User authentication
- JWT authorization
- Password hashing
- Role-based access
- Database relationships
- Booking management
- API integration
- Deployment
- Debugging production applications
- Git and GitHub workflow

---

# 👩‍💻 Developer

### Sanskrati Jain

🎓 Computer Science Engineering  
💻 Full-Stack / Web Developer

📧 **Email:** sanskratijain88@gmail.com

💼 **LinkedIn:**  
https://www.linkedin.com/in/sanskrati-jain-295b65271/

---

# 🏆 Internship Project

This project was developed as part of the:

### IBM SkillsBuild Internship

The project provided an opportunity to apply web development concepts to a practical, real-world application while progressively expanding the project from a frontend travel website into a full-stack booking platform.

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub!

---

## 📜 License

This project is developed for educational and portfolio purposes.
