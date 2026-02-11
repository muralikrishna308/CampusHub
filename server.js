const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const PORT = 5000;
const SECRET_KEY = "mysecretkey";   // Later move to .env

// --------------------
// 1️⃣ Home Route
// --------------------
app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});

// --------------------
// 2️⃣ Register Route (Password Hashing)
// --------------------
app.get("/register", async (req, res) => {
  try {
    const password = "123456";   // Testing password

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    res.json({
      message: "Password encrypted successfully",
      hashedPassword: hashedPassword
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Error encrypting password" });
  }
});

// --------------------
// 3️⃣ Login Route (Compare + JWT)
// --------------------
app.get("/login", async (req, res) => {
  try {
    const enteredPassword = "123456";  // Testing login password

    // Simulate stored hashed password (normally from DB)
    const storedHashedPassword = await bcrypt.hash("123456", 10);

    // Compare password
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: "12345", role: "student" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Login error" });
  }
});

// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
