const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "mysecretkey"; 

// home
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "student@gmail.com" && password === "000000") {
    const token = jwt.sign(
      { email: email, role: "student" },
      SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  }

  if (email === "admin@gmail.com" && password === "111111") {
    const token = jwt.sign(
      { email: email, role: "college_admin" },
      SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
//verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

//👩‍🎓 Student here👇
app.get("/student-dashboard", verifyToken, (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied ❌ try again 🥺" });
  }

  res.json({ message: "Welcome Student 😁!" });
});
// 🧑‍💼 Admin here👇
app.get("/admin-dashboard", verifyToken, (req, res) => {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ message: "Access denied ❌ try again 🥺" });
  }

  res.json({ message: "Welcome Admin🙏!" });
});

