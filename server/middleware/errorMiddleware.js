const { body, validationResult } = require("express-validator");

const cleanUpFilesOnError = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      try {
        await Promise.all(
          Object.values(req.files)
            .flat()
            .map((file) => fs.promises.unlink(file.path).catch(console.error))
        );
      } catch (err) {
        console.error("Error cleaning up files:", err);
      }
    }
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  const errorResponse = {
    success: false,
    error:
      process.env.NODE_ENV === "development" ? message : "Something went wrong",
  };
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }
  res.status(statusCode).json(errorResponse);
};

module.exports = {
  cleanUpFilesOnError,
  errorHandler,
};
