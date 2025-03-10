import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoute from './routes/auth.js';

const startup = (app) => {
    app.use(
        cors({
            origin: 'http://localhost:5173',
            credentials: true,
        }),
    );
    app.use(cookieParser());
    app.use(express.json());

    app.use('/api/auth', AuthRoute);

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            msg:
                err.message ||
                'Lỗi không xác định. Vui lòng liên hệ chúng tôi: support@email.com.',
        });
    });

    app.use((req, res) => {
        res.status(404);
        res.send({ msg: 'Yêu cầu không tồn tại.' });
    });
};

export default startup;
