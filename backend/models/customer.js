import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
      	required: true
    },
    phonenum: {
        type: String,
        required: true
    },
    bankAccountNo: {
        type: String,        
    },
    bankAccountName: {
        type: String
    },
    bankName: {
        type: String,
    },
    discount: {
        type: Number,
        default: 0
    },
    bonusDiscount: {
        type: Number,
        default: 0
    },
    del: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Customers', customerSchema);