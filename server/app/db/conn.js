import mongoose from 'mongoose';
const URI_CONN = process.env.URI_CONN || '';

const connect = async () => await mongoose.connect(URI_CONN);

connect()
    .then(() => {
        console.log('[Info]: DB connected');
    })
    .catch((error) => {
        console.error('[Error]: ' + error.message);
    });

export default mongoose;
