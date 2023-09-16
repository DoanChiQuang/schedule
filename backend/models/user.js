import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
      	required: true,
      	min: 10,
      	max: 10,
      	unique: true,
    },
    password: {
      	type: String,
      	required: true      	
    },
	name: {
		type: String,
		required: true,
		default: ""
	},
    role: {
        type: String,
        default: "admin"
    }
});

export default mongoose.model('Users', userSchema);