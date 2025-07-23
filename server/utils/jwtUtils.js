const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

// Correct way to generate token

const generateToken = (user) => {
  const payload = {
    id: user._id, // Using mongoose _id
    email: user.email,
    role: user.role || "student",
  };

  return jwt.sign(
    payload, // MUST be a plain object
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Decode JWT Token (without verification)
const decodeToken = (token) => {
  return jwt.decode(token);
};
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};
const verifyPaymentToken = async (req, res, next) => {
  try {
    // 1. Get token from secure sources only
    const token = req.cookies.paymentToken || req.get("X-Payment-Token");

    if (!token) throw new Error("Missing payment token");

    // 2. Verify token with payment-specific claims
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: "payment",
      issuer: "your-app",
    });

    // 3. Check if token was issued within last 10 minutes
    const tokenAge = Date.now() - decoded.iat * 1000;
    if (tokenAge > 10 * 60 * 1000) {
      // 10 minutes
      throw new Error("Payment token expired");
    }

    // 4. Attach to request
    req.paymentAuth = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Payment authorization failed",
      requiresReauth: true,
    });
  }
};
const verifyLoginAttempt = async (req, res, next) => {
  // 1. Device fingerprinting
  const deviceId =
    req.headers["device-id"] || req.ip + req.headers["user-agent"];

  // 2. Check if IP/device is blocked
  const isBlocked = await Blocklist.check(req.ip, deviceId);
  if (isBlocked) {
    return res.status(429).json({ error: "Too many attempts" });
  }

  next();
};
module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  verifyPaymentToken,
  verifyLoginAttempt,
};
