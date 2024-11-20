import mongoose from 'mongoose';
const { Schema } = mongoose;

const timeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    del: {
        type: Number,
        default: 0,
    },
});

export const Time = mongoose.model('Time', timeSchema);
