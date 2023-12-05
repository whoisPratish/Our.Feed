const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../database/models/user");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(401).render("login", {
        alert: "Invalid credentials ",
      });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate a JWT token
      const token = jwt.sign({ username: user.username }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true, secure: false });
      // Send the token in the response
      res.redirect("/feed");
    } else {
      return res.status(401).render("login", {
        alert: "Invalid Password!",
      });
    }
  } catch (error) {
    return res.status(500).render("login", {
      alert: "Server Error! Please Try Again",
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, email });

    // Save the user to the database
    await newUser.save();

    res.status(201).render("login", {
      alert: "Register Successful! Please Login!",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
