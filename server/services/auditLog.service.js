const AuditLog = require("../models/AuditLog");

class AuditLogService {
  static async logAction({
    action,
    model,
    documentId,
    changedBy,
    changes,
    ipAddress,
    userAgent,
    session = null,
  }) {
    try {
      const auditLog = await AuditLog.create(
        [
          {
            action,
            model,
            documentId,
            changedBy,
            changes,
            ipAddress,
            userAgent,
          },
        ],
        session ? { session } : {}
      );

      return auditLog[0];
    } catch (error) {
      console.error("Audit log failed:", error);
      // Fail silently to not break main operations
      return null;
    }
  }
}

module.exports = AuditLogService;
