const AuditLogService = require("../services/auditLog.service");

function auditLogMiddleware(modelName) {
  return async (req, res, next) => {
    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Intercept the response to log after operation completes
    res.json = async (body) => {
      try {
        // Only log successful operations (2xx status)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          await AuditLogService.logAction({
            action:
              req.method === "POST"
                ? "create"
                : req.method === "PUT" || req.method === "PATCH"
                ? "update"
                : req.method === "DELETE"
                ? "delete"
                : "other",
            model: modelName,
            documentId: body._id || req.params.id,
            changedBy: req.user?.id,
            changes: req.method !== "GET" ? req.body : undefined,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            session: req.session, // Pass through if using transactions
          });
        }
      } catch (error) {
        console.error("Audit log middleware error:", error);
      } finally {
        // Call original response method
        originalJson.call(res, body);
      }
    };

    next();
  };
}

module.exports = auditLogMiddleware;
