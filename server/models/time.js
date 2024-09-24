import mongoose from "mongoose";

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
    timeDetail: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeDetails'
    }]
});

export default mongoose.model('Times', timeSchema);