import { verify } from '../lib/jwt.js';

export const auth = async (req, res, next) => {
    const tokenCookie = req.cookies.access_token;
    if (!tokenCookie) {
        res.status(401).send({ msg: 'Request missing Authorization Data' });
        return;
    }

    const token = tokenCookie.split(' ')[1];
    const verified = verify(token);
    if (!verified) {
        res.status(401).send({ msg: 'Unauthorized' });
        return;
    }
    next();
};
