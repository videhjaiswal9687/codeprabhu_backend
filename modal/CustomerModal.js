import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
    id: {
    type: Number,
    unique: true,
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

const CustomerModal = mongoose.model('Customer', customerSchema);


export default CustomerModal;   