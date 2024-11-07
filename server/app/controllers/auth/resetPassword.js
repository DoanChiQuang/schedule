import { User } from '../../models/user.js';
import { hash } from '../../services/bcrypt.js';
import { verify } from '../../services/jwt.js';

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            res.status(401).send({ msg: 'Token or Password not found' });
            return;
        }

        const RESET_PASSWORD_SECRET_KEY = process.env.RESET_PASSWORD_SECRET_KEY;
        const verified = verify(token, RESET_PASSWORD_SECRET_KEY);
        if (!verified) {
            throw new Error('');
        }

        const userId = verified.sub;
        const hashed = await hash(password);

        await User.findOneAndUpdate({ _id: userId }, { password: hashed });

        res.send({ msg: 'Reset password successful' });
    } catch (error) {
        next(error);
    }
};
