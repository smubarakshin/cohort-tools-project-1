const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");
const router = express.Router();
const isAuth = require("../middleware/jwt.middleware.js");

const salts = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { email, name, password } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Please provide email, name, and password." });
    }

    const user = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 8 characters and contain at least one number, one lowercase, one uppercase letter and a special character.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(salts);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!(email || username) || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User does not exist." });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }
    delete user._doc.password;
    const jwtToken = jwt.sign(
      {
        payload: { user },
      },
      process.env.TOKEN_SIGN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "6h",
      }
    );
    res.json({ user, authToken: jwtToken });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
});

router.get("/verify", isAuth, async (req, res) => {
  try {
    console.log("Logged user in verify: ", req.user);
    res.json({ message: "Logged in.", user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
