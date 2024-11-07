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
            throw new Error();
        }

        const userId = verified.sub;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            res.status(401).send({ msg: 'User not found' });
            return;
        }

        if (user.resetPasswordToken != token) {
            res.status(400).send({ msg: 'Bad Request' });
            return;
        }

        const hashed = await hash(password);

        await User.updateOne({ _id: userId }, { password: hashed, resetPasswordToken: '' });

        res.send({ msg: 'Reset password successful' });
    } catch (error) {
        next(error);
    }
};
