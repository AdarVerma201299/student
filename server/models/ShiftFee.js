const mongoose = require("mongoose");
const { Schema } = mongoose;
const { User, Student } = require("./User");
const Payment = require("./Payment");
const shiftFeeSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      validate: {
        validator: async function (studentId) {
          const user = await Student.findById(studentId);
          return user && user.role === "student";
        },
        message: "Student reference must point to a valid student user",
      },
    },
    shift: {
      type: String,
      enum: ["MORNING", "AFTERNOON", "EVENING"],
      required: true,
      uppercase: true,
      trim: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
      set: (v) => Math.round(v * 100) / 100, // Ensures 2 decimal places
    },
    academicYear: {
      type: String,
      match: [/^\d{4}-\d{4}$/, "Format: YYYY-YYYY"],
      required: true,
      index: true,
    },
    payments: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Payment",
        },
      ],
      validate: [
        {
          validator: function (paymentsArray) {
            return paymentsArray.length <= 12;
          },
          message: "Maximum 12 payments allowed per academic year",
        },
      ],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

shiftFeeSchema.index(
  { student: 1, academicYear: 1, shift: 1 },
  { unique: true }
);
shiftFeeSchema.index({ academicYear: 1, shift: 1 });

shiftFeeSchema.virtual("balance").get(function () {
  if (!this.populated("payments")) {
    return this.fee;
  }
  const paidAmount = this.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  return parseFloat((this.fee - paidAmount).toFixed(2));
});

shiftFeeSchema.virtual("status").get(function () {
  if (this.balance <= 0) return "PAID";
  if (this.balance < this.fee) return "PARTIAL";
  return "UNPAID";
});

shiftFeeSchema.pre("save", async function (next) {
  if (this.isModified("payments") && this.payments.length > 0) {
    try {
      const Payment = mongoose.model("Payment");
      const actualPayments = await Payment.countDocuments({
        _id: { $in: this.payments },
        student: this.student,
      }).session(this.$session());
      console.log(actualPayments, this.payments.length);
      if (actualPayments !== this.payments.length) {
        throw new Error("Some payments do not belong to this student");
      }
      if (this.payments.length > 12) {
        throw new Error("Maximum 12 payments allowed per academic year");
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

shiftFeeSchema.post("save", async function (doc, next) {
  try {
    console.log("[Post-save] Updating user...");
    await Student.findByIdAndUpdate(
      doc.student,
      { $addToSet: { feeRecords: doc._id } },
      { new: true }
    );
    next();
  } catch (err) {
    console.error("[Post-save] Error:", err.message);
    next(err);
  }
});
shiftFeeSchema.statics.findByStudentAndYear = function (
  studentId,
  academicYear
) {
  return this.find({ student: studentId, academicYear })
    .populate("payments")
    .populate("lastUpdatedBy", "name email");
};

module.exports = mongoose.model("ShiftFee", shiftFeeSchema);
