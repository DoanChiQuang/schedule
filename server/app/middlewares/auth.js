import { verify } from '../services/jwt.js';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export const auth = async (req, res, next) => {
    const tokenCookie = req.cookies.access_token;
    if (!tokenCookie) {
        res.status(400).send({ msg: 'Request missing Authorization Data' });
        return;
    }

    const token = tokenCookie.split(' ')[1];
    const verified = verify(token, TOKEN_SECRET_KEY);
    if (!verified) {
        res.status(401).send({ msg: 'Unauthorized' });
        return;
    }
    next();
};
