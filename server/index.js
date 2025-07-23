require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware - Updated allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://student-1-vqir.onrender.com",
  "https://student-1-r27d.onrender.com",
  // Add other environments as needed
];

// Enhanced CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      const originAllowed = allowedOrigins.some((allowedOrigin) => {
        // Direct match
        if (origin === allowedOrigin) return true;

        // Protocol variation match (http vs https)
        const otherProtocol = allowedOrigin.startsWith("https://")
          ? allowedOrigin.replace("https://", "http://")
          : allowedOrigin.replace("http://", "https://");

        return origin === otherProtocol;
      });

      if (originAllowed) {
        return callback(null, true);
      }

      const msg = `The CORS policy for this site does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  })
);

// Handle preflight requests globally
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Additional headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
