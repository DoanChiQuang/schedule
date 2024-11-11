import { sign } from '../../services/jwt.js';
import { User } from '../../models/user.js';
import { compare } from '../../services/bcrypt.js';

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error();
        }

        let user = await User.findOne({ email: email, del: 0 });
        if (!user) {
            res.status(401).send({ msg: 'Tài khoản chưa được đăng ký.' });
            return;
        }

        let isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).send({ msg: 'Xác thực không thành công.' });
            return;
        }

        const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
        const TOKEN_LIFE = process.env.TOEKN_LIFE;
        const payload = { sub: user._id };
        const token = sign(payload, TOKEN_SECRET_KEY, TOKEN_LIFE);
        if (!token) {
            throw new Error();
        }

        res.cookie('token', token, {
            httpOnly: true,
            SameSite: 'Lax',
            secure: true,
        });

        user = user?.toObject();
        delete user.password;

        const message = {
            msg: 'Đăng nhập thành công.',
            data: {
                user,
            },
        };
        res.send(message);
    } catch (err) {
        next(err);
    }
};
