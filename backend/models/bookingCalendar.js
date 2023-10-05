import mongoose from "mongoose";

const bookingCalendarSchema = new mongoose.Schema({
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    details: {
        type: Array,
    },
    isCustomer: {
        type: Number,
    },
    customerId: {
        type: String,
    },
    customerName: {
        type: String,
    },
    customerPhone: {
        type: String,
    },
    isPay: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
    },
    price: {
        type: Number,
        default: 80000
    },
    bonus: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    cashier: {
        type: String
    }
});

export default mongoose.model('BookingCalendars', bookingCalendarSchema);