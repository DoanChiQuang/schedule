import mongoose from "mongoose";
const URL = 'mongodb+srv://chiquang127:IRbzHKeUVadhnNGL@clustercalenderbooking.hyagn3o.mongodb.net/';

mongoose
    .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB connection successfully');
    })
    .catch((error) => {
        console.log('Error: ' + error.message);
    });

export default mongoose;