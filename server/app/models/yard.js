import mongoose from 'mongoose';
const { Schema } = mongoose;

const yardSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

export const Yard = mongoose.model('Yard', yardSchema);
