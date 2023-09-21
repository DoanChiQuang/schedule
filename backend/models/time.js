import mongoose from "mongoose";

const timeDetailSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
});

const timeSchema = new mongoose.Schema({
    name: {
        type: String,
      	required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    period: {
        type: Number,
        require: true
    },
    default: {
        type: Boolean,
        default: true
    },
    timeDetail: timeDetailSchema
});

export default mongoose.model('Times', timeSchema);