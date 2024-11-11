import { verify } from '../services/jwt.js';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export const auth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(400).send({ msg: 'Không có quyền truy cập.' });
        return;
    }

    const verified = verify(token, TOKEN_SECRET_KEY);
    if (!verified) {
        res.status(400).send({ msg: 'Không có quyền truy cập.' });
        return;
    }
    next();
};
