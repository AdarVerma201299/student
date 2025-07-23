const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  action,
  model,
  documentId,
  changedBy,
  changes,
  ipAddress,
}) => {
  try {
    await AuditLog.create({
      action,
      model,
      documentId,
      changedBy,
      changes,
      ipAddress,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
};

module.exports = { createAuditLog };
