import mongoose from 'mongoose';
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    weekday: {
        type: Array,
        default: [],
    },
    dateTimeStart: {
        type: Date,
        default: Date.now,
    },
    dateTimeUntil: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: String,
        default: '01:00',
    },
    status: {
        type: Number,
        default: 0,
    },
    customerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    timeId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    yardId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);
