const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const router = express.Router();

// =========================================
// REGISTER USER
// =========================================

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, phone, password, confirmPassword } =
      req.body;

    // Required fields
    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Reserve admin username
    if (username.toLowerCase() === "admin") {
      return res.status(400).json({
        message: "This username is reserved.",
      });
    }

    // Check username
    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists.",
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);

    return res.status(500).json({
      message: "Unable to create account.",
    });
  }
});

// =========================================
// UNIFIED LOGIN
// =========================================

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // =========================================
    // ADMIN LOGIN
    // =========================================

    if (normalizedUsername === "admin") {
      const admin = await Admin.findOne({
        username: normalizedUsername,
      });

      if (!admin) {
        return res.status(401).json({
          message: "Invalid username or password.",
        });
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid username or password.",
        });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          username: admin.username,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return res.status(200).json({
        message: "Login successful.",
        token,
        role: "admin",
        user: {
          id: admin._id,
          username: admin.username,
        },
      });
    }

    // =========================================
    // USER LOGIN
    // =========================================

    const user = await User.findOne({
      username: normalizedUsername,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      role: "user",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("User login error:", error);

    return res.status(500).json({
      message: "Unable to login.",
    });
  }
});

module.exports = router;
