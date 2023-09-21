import mongoose from "mongoose";

const yardSchema = new mongoose.Schema({
    name: {
        type: String
    },
    branch: {
        type: Number,
    },
    del: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Yards', yardSchema);