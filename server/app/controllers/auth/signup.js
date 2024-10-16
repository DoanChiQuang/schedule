import bcrypt from 'bcrypt';
import { User } from '../../models/user.js';

export const signup = async (req, res, next) => {
    try {
        const SALT_ROUND = parseInt(process.env.SALT_ROUND) || 10;
        const hashedString = await bcrypt.hash('123456', SALT_ROUND);

        let user = await User.create({
            email: 'admin@gmail.com',
            password: hashedString,
            name: 'admin',
            roles: ['admin'],
        });

        delete user.password;

        res.send({
            msg: 'Your account has been created',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
