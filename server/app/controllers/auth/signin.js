import { sign } from '../../lib/jwt.js';
import { User } from '../../models/user.js';
import bcrypt from 'bcrypt';

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // 1. Validate Undefined email and password
        if (!email || !password) {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }

        // 2. Fetch User by Email and Del from DB with findOne
        let user = await User.findOne({ email: email, del: 0 });
        if (!user) {
            res.status(401).send({ msg: 'User not found' });
            return;
        }

        // 3. Compare Client password with DB password
        let isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).send({ msg: 'Invalid credentials' });
            return;
        }

        // 4. Generate JWT
        const payload = { sub: user._id };
        const token = sign(payload);
        if (!token) {
            res.status(401).send({ msg: 'Unauthorized' });
            return;
        }

        // 5. SetCookie for JWT and Logged State
        res.cookie('token', token, {
            httpOnly: true,
            SameSite: 'Lax',
            secure: true,
        });

        // 6. Prepare response data
        user = user?.toObject();
        delete user.password;

        // 7. Send to Client
        const message = {
            msg: 'Login successful',
            data: {
                user,
            },
        };
        res.send(message);
    } catch (err) {
        next(err);
    }
};
