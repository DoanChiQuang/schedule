import express from 'express';
import 'dotenv/config';
import './db/conn.js';
import startup from './routes/index.js';

const app = express();
startup(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Info]: Listening on port ${PORT}`));
