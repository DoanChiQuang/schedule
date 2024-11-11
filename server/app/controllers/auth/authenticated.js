import { verify } from '../../services/jwt.js';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

export const authenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(400).send({ msg: 'Phiên đăng nhập hết hạn.' });
            return;
        }

        const verified = verify(token, TOKEN_SECRET_KEY);
        if (!verified) {
            throw new Error();
        }

        res.status(200).send({ msg: 'Xác thực thành công.' });
    } catch (error) {
        next(error);
    }
};
