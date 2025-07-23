const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
// Address Schema (unchanged)
const addressSchema = new Schema(
  {
    village: { type: String, required: true },
    post: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "India" },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

// Aadhar Schema (unchanged)
const aadharSchema = new Schema(
  {
    aadhaar: {
      type: String,
      required: true,
      match: [/^\d{12}$/, "Aadhar must be 12 digits"],
    },
    frontImage: { type: String },
    backImage: { type: String },
  },
  { _id: false }
);

// Base user Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone must be 10 digits"],
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["student", "sub-admin", "super-admin"],
      required: true,
    },
    aadhar: { type: aadharSchema, required: true },
    address: {
      residential: { type: addressSchema, required: true },
      permanent: {
        type: addressSchema,
        required: function () {
          return !this.isPermanentSame;
        },
      },
    },
    isPermanentSame: { type: Boolean, default: true },
    profileImage: { type: String },
    isActive: { type: Boolean, default: false },
    lastLogin: { type: Date },
    loginHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ip: { type: String },
        action: { type: String },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

// Virtual for full address (unchanged)
userSchema.virtual("address.residential.full").get(function () {
  return `${this.address.residential.village}, ${this.address.residential.post}, ${this.address.residential.district}, ${this.address.residential.state} - ${this.address.residential.pincode}`;
});

// Pre-save hook for address (unchanged)
userSchema.pre("save", function (next) {
  if (this.isPermanentSame && this.address.residential) {
    this.address.permanent = { ...this.address.residential };
  }

  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000;
    }
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};
// Create base user model
const user = mongoose.model("user", userSchema);

const studentSchema = new Schema({
  fatherName: { type: String, required: true },
  school: { type: String, required: true },
  dob: { type: Date, required: true },

  payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
  chatThreads: [{ type: Schema.Types.ObjectId, ref: "ChatThread" }],
  refreshToken: { type: String, select: false },
  refreshTokenExpires: { type: Date, select: false },
});

const student = user.discriminator("student", studentSchema);

// admin Discriminator
const admin = user.discriminator(
  "admin",
  new Schema({
    permissions: {
      canManagestudents: { type: Boolean, default: false },
      canManagePayments: { type: Boolean, default: false },
      canManageadmins: { type: Boolean, default: false },
      allowedDepartments: [{ type: String }],
    },
    managedstudents: [{ type: Schema.Types.ObjectId, ref: "student" }],
    chatThreads: [{ type: Schema.Types.ObjectId, ref: "ChatThread" }],
  })
);

// Sub-admin discriminator (inherits from admin)
const subadmin = user.discriminator("sub-admin", new Schema({}), {
  discriminatorKey: "role",
});

// Super-admin discriminator (inherits from admin)
const superadmin = user.discriminator("super-admin", new Schema({}), {
  discriminatorKey: "role",
});

// module.exports = { user, student, admin, subadmin, superadmin };
// Change the exports at the bottom to:
module.exports = {
  User: user, // Base model
  Student: student, // Discriminator model
  Admin: admin,
  SubAdmin: subadmin,
  SuperAdmin: superadmin,
};
