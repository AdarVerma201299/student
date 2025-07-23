// models/AuditLog.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const auditSchema = new Schema(
  {
    action: { type: String, required: true }, // 'create', 'update', 'delete'
    model: { type: String, required: true }, // 'User', 'ShiftFee'
    documentId: { type: Schema.Types.ObjectId },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changes: { type: Schema.Types.Mixed }, // Track modified fields
    ipAddress: { type: String },
  },
  { timestamps: true }
);
