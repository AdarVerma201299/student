// models/AuditLog.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const auditSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "payment", "status_change"],
    },
    model: {
      type: String,
      required: true,
      enum: ["User", "Student", "Payment", "ShiftFee", "AuditLog"],
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: String,
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster querying
auditSchema.index({ documentId: 1 });
auditSchema.index({ changedBy: 1 });
auditSchema.index({ createdAt: -1 });
auditSchema.index({ model: 1, action: 1 });

// Virtual for formatted timestamp
auditSchema.virtual("timestamp").get(function () {
  return this.createdAt.toISOString();
});

module.exports = mongoose.model("AuditLog", auditSchema);
