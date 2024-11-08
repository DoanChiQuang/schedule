import { sign } from '../../services/jwt.js';
import { User } from '../../models/user.js';
import { compare } from '../../services/bcrypt.js';

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }

        let user = await User.findOne({ email: email, del: 0 });
        if (!user) {
            res.status(401).send({ msg: 'User not found' });
            return;
        }

        let isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).send({ msg: 'Invalid credentials' });
            return;
        }

        const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
        const TOKEN_LIFE = process.env.TOEKN_LIFE;
        const payload = { sub: user._id };
        const token = sign(payload, TOKEN_SECRET_KEY, TOKEN_LIFE);
        if (!token) {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }

        res.cookie('token', token, {
            httpOnly: true,
            SameSite: 'Lax',
            secure: true,
        });

        user = user?.toObject();
        delete user.password;

        const message = {
            msg: 'Signin successful',
            data: {
                user,
            },
        };
        res.send(message);
    } catch (err) {
        next(err);
    }
};
