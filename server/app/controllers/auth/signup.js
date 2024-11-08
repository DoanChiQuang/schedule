import { User } from '../../models/user.js';
import { hash } from '../../services/bcrypt.js';

export const signup = async (req, res, next) => {
    try {
        const SALT_ROUND = parseInt(process.env.SALT_ROUND) || 10;
        const hashedString = await hash('123456', SALT_ROUND);

        let user = await User.create({
            email: 'admin@gmail.com',
            password: hashedString,
            name: 'admin',
            roles: ['admin'],
        });

        delete user.password;

        res.send({
            msg: 'Signup successful',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
