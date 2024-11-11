import { User } from '../../models/user.js';
import { hash } from '../../services/bcrypt.js';
import { verify } from '../../services/jwt.js';

const RESET_PASSWORD_SECRET_KEY = process.env.RESET_PASSWORD_SECRET_KEY;

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            throw new Error();
        }

        const verified = verify(token, RESET_PASSWORD_SECRET_KEY);
        if (!verified) {
            res.status(400).send({
                msg: 'Yêu cầu đổi mật khẩu đã hết hạn hoặc xác thực không thành công.',
            });
            return;
        }

        const hashed = await hash(password);
        await User.findOneAndUpdate(
            { _id: verified.sub },
            { password: hashed, resetPassToken: '' },
        );
        res.send({ msg: 'Thay đổi mật khẩu thành công.' });
    } catch (error) {
        next(error);
    }
};
