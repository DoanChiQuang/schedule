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

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

const connection = DBConnect;

app.use("/api/auth", AuthRoute);
app.use("/api/customer", isAuth, CustomerRoute);
app.use("/api/time", isAuth, TimeRoute);
app.use("/api/booking-calendar", isAuth, BookingCRoute);
app.use("/api/yard", isAuth, Yard);
app.use("/api/user", isAuth, User);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening on port: ${port}`));