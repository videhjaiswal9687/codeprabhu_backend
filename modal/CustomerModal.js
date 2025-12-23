import mongoose from "mongoose";

/* ================================
   COUNTER SCHEMA (MERGED)
================================ */
const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

/* Prevent model overwrite error */
const CounterModel =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

/* ================================
   CUSTOMER SCHEMA
================================ */
const customerSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  msg: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

/* ================================
   AUTO-INCREMENT ID LOGIC
================================ */
customerSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "customer_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.id = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

/* ================================
   CUSTOMER MODEL
================================ */
const CustomerModel =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default CustomerModel;
