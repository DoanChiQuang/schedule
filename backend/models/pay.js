import mongoose from "mongoose";

const paySchema = new mongoose.Schema({
    idBookingCal: {
        type: String,
    },
    month: {
      	type: Number,
    },
	year: {
		type: Number,
	},
    totalDate: {
        type: Number,
    },
    details: {
        type: Array,
    }
});

export default mongoose.model('Pays', paySchema);