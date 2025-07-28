const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const { User, Student } = require("./User");
const Counter = require("./Counter");
const ShiftFee = require("./ShiftFee");
const paymentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
      validate: {
        validator: async function (studentId) {
          const student = await Student.findById(studentId);
          return student && student.role === "student";
        },
        message: "Invalid student ID or not a student",
      },
    },
    shiftFee: {
      type: Schema.Types.ObjectId,
      ref: "ShiftFee",
      required: [true, "Shift fee reference is required"],
      validate: {
        validator: async function (shiftFeeId) {
          return await ShiftFee.exists({ _id: shiftFeeId });
        },
        message: "Invalid shift fee reference",
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least 1"],
      max: [1000000, "Amount cannot exceed 1,000,000"],
    },
    date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (date) {
          return date <= new Date();
        },
        message: "Payment date cannot be in the future",
      },
    },
    method: {
      type: String,
      enum: {
        values: ["cash", "card", "upi", "bank", "cheque"],
        message: "Invalid payment method",
      },
      required: [true, "Payment method is required"],
    },
    transactionId: {
      type: String,
      validate: {
        validator: function (id) {
          if (!id) return true;
          return validator.isAlphanumeric(id) && id.length >= 6;
        },
        message:
          "Transaction ID must be alphanumeric and at least 6 characters",
      },
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "refunded"],
      default: "pending",
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: async function (userId) {
          if (!userId) return true;
          const user = await User.findById(userId);
          return user && ["admin", "sub-admin"].includes(user.role);
        },
        message: "Verifier must be an admin or sub-admin",
      },
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^REC-\d{6}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid receipt number!`,
      },
    },
    academicYear: {
      type: String,
      match: [/^\d{4}-\d{4}$/, "Academic year format should be YYYY-YYYY"],
      required: true,
      validate: {
        validator: function (year) {
          const [start, end] = year.split("-").map(Number);
          return end === start + 1;
        },
        message: "Academic year should be consecutive years (e.g., 2023-2024)",
      },
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    paymentSource: {
      type: String,
      enum: ["student-portal", "admin-portal", "mobile-app"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.index({ student: 1, academicYear: 1 });
paymentSchema.index({ status: 1, date: -1 });
paymentSchema.index({ receiptNumber: 1 }, { unique: true });

paymentSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

paymentSchema.virtual("studentDetails", {
  ref: "User",
  localField: "student",
  foreignField: "_id",
  justOne: true,
});

// Pre-save hooks
paymentSchema.pre("validate", async function (next) {
  if (!this.receiptNumber) {
    try {
      // Use the Counter collection for atomic increments
      const counter = await Counter.findOneAndUpdate(
        { _id: "paymentReceiptNumber" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, session: this.$session() }
      );

      this.receiptNumber = `REC-${counter.seq.toString().padStart(6, "0")}`;
    } catch (error) {
      // Fallback to manual counting if Counter fails
      const lastPayment = await this.constructor
        .findOne(
          {},
          {},
          {
            sort: { receiptNumber: -1 },
            session: this.$session(),
          }
        )
        .select("receiptNumber")
        .lean();

      const lastNumber = lastPayment?.receiptNumber
        ? parseInt(lastPayment.receiptNumber.split("-")[1])
        : 0;

      this.receiptNumber = `REC-${(lastNumber + 1)
        .toString()
        .padStart(6, "0")}`;
    }
  }
  next();
});

paymentSchema.post("save", async function (doc, next) {
  const session = this.$session();

  try {
    const shiftFeeUpdate = await mongoose.model("ShiftFee").updateOne(
      { _id: doc.shiftFee },
      {
        $push: { payments: doc._id },
        $inc: { paidAmount: doc.amount },
      },
      { session }
    );

    if (shiftFeeUpdate.nModified === 0) {
      throw new Error("Failed to update ShiftFee record");
    }

    await mongoose.model("AuditLog").create(
      [
        {
          action: "create",
          model: "Payment",
          documentId: doc._id,
          changedBy: doc.verifiedBy,
          changes: {
            amount: doc.amount,
            method: doc.method,
            status: doc.status,
            receiptNumber: doc.receiptNumber,
          },
          ipAddress: doc.paymentSource === "admin-portal" ? "server" : "client",
          userAgent: doc.paymentSource,
        },
      ],
      { session }
    );

    next();
  } catch (error) {
    if (!session) {
      console.error("Post-save hook error:", error);
    }
    next(error);
  }
});

paymentSchema.statics.generateReceiptNumber = async function () {
  const lastPayment = await this.findOne({}, {}, { sort: { createdAt: -1 } });
  const lastNumber = lastPayment
    ? parseInt(lastPayment.receiptNumber.split("-")[1]) || 0
    : 0;
  return `REC-${(lastNumber + 1).toString().padStart(6, "0")}`;
};
paymentSchema.statics.bulkCreateWithAudit = async function (payments, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdPayments = await this.create(payments, { session });

    // Create batch audit log
    await mongoose.model("AuditLog").create(
      createdPayments.map((payment) => ({
        action: "create",
        model: "Payment",
        documentId: payment._id,
        changedBy: userId,
        changes: {
          amount: payment.amount,
          receiptNumber: payment.receiptNumber,
        },
        ipAddress: "batch-process",
      })),
      { session }
    );

    await session.commitTransaction();
    return createdPayments;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
module.exports = mongoose.model("Payment", paymentSchema);
