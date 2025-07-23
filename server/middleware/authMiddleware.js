const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log("from verifyToken", req.query);
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    try {
      // Debugging logs
      // console.log("Authorization check for:", req.originalUrl);
      // console.log("User:", req.user ? req.user._id : "No user");
      // console.log("User role:", req.user?.role);

      // Validate user exists
      if (!req.user) {
        throw createError(401, "Authentication required");
      }

      // Validate roles array
      if (!Array.isArray(roles)) {
        throw createError(500, "Invalid roles configuration");
      }

      // Check authorization
      if (!roles.includes(req.user.role)) {
        throw createError(
          403,
          `Role ${req.user.role} is not authorized for this action. ` +
            `Required roles: ${roles.join(", ")}`
        );
      }

      // console.log("Authorization granted for", req.user.role);
      next();
    } catch (error) {
      console.error("Authorization error:", error.message);
      next(error);
    }
  };
};

module.exports = {
  verifyToken,
  authorizeRole,
};
