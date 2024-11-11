import mongoose from 'mongoose';
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    weekday: {
        type: Array,
        default: [],
    },
    dateTimeStart: {
        type: Date,
        default: Date.now,
    },
    until: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: String,
        default: '01:00',
    },
    customerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);
