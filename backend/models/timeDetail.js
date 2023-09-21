import mongoose from "mongoose";

const timeDetailSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
});

export default mongoose.model('TimeDetails', timeDetailSchema);