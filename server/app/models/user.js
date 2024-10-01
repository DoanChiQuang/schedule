import mongoose from 'mongoose'
const { Schema } = mongoose

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
    del: {
        type: Number,
        default: 0,
    },
})

export default mongoose.model('User', userSchema)
