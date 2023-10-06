import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DBConnect from "./config/DBConnect.js";
import AuthRoute from "./routes/auth.js";
import CustomerRoute from "./routes/customer.js";
import TimeRoute from "./routes/time.js";
import BookingCRoute from "./routes/bookingCalendar.js";
import Yard from "./routes/yard.js";
import User from "./routes/user.js";
import { isAuth } from './middleware/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

const connection = DBConnect;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticPath = __dirname + '/exports';
app.use(express.static(staticPath));

app.use("/api/auth", AuthRoute);
app.use("/api/customer", isAuth, CustomerRoute);
app.use("/api/time", isAuth, TimeRoute);
app.use("/api/booking-calendar", BookingCRoute);
app.use("/api/yard", isAuth, Yard);
app.use("/api/user", isAuth, User);

app.get('/downloads/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = join(staticPath, fileName);
    
    // Check if the file exists
    if (existsSync(filePath)) {
        res.download(filePath); // Send the file for download
    } else {
        res.status(404).json({ success: false, message: 'File not found' });
    }
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening on port: ${port}`));