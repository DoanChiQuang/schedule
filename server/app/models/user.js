import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        default: 'User',
    },
    roles: {
        type: Array,
        default: ['user'],
    },
    del: {
        type: Number,
        default: 0,
    },
});

export const User = mongoose.model('User', userSchema);