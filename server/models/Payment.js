const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shiftFee: {
      type: Schema.Types.ObjectId,
      ref: "ShiftFee",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ["cash", "card", "upi", "bank", "cheque"],
      required: true,
    },
    transactionId: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },
    academicYear: {
      type: String,
      match: [/^\d{4}-\d{4}$/, "Format: YYYY-YYYY"],
      required: true,
    },
    notes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add index for faster queries
paymentSchema.index({ student: 1, academicYear: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
// paymentSchema.index({ receiptNumber: 1 }, { unique: true });

// Virtual for formatted payment date
paymentSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-IN"); // Indian format DD/MM/YYYY
});

// Pre-save hook for receipt number generation
paymentSchema.pre("save", async function (next) {
  if (!this.receiptNumber) {
    const count = await mongoose.model("Payment").countDocuments();
    this.receiptNumber = `REC-${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
