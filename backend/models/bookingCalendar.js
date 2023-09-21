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
    }
});

export default mongoose.model('BookingCalendars', bookingCalendarSchema);