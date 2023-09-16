import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DBConnect from "./config/DBConnect.js";
import AuthRoute from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

const connection = DBConnect;

app.use("/api/auth", AuthRoute);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
});


const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port: ${port}`));