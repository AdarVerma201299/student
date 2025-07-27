// models/Counter.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
// const validator = require("validator");
// const { User, Student } = require("./User");
// const ShiftFee = require("./ShiftFee");
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
