require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
connectDB();

const allowedOrigins = [
  "https://student-1-r27d.onrender.com",
  "http://student-1-vqir.onrender.com",
  "http://localhost:3000",
  "https://student-30a2.onrender.com", // Added backend URL
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Set-Cookie", "Authorization"],
    optionsSuccessStatus: 204,
  })
);
// app.options("*", (req, res) => {
//   res.sendStatus(204);
// });
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  console.log(`Incoming route: ${req.method} ${req.path}`);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
