import { User } from '../../models/user.js';
import { sign, verify } from '../../services/jwt.js';
import { prepareHtml, send } from '../../services/mailer.js';

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(401).send({ msg: 'Email not found' });
            return;
        }

        let user = await User.findOne({ email: email, del: 0 });
        if (!user) {
            res.status(401).send({ msg: 'User not found' });
            return;
        }

        const RESET_PASSWORD_SECRET_KEY = process.env.RESET_PASSWORD_SECRET_KEY;
        if (user.resetPasswordToken) {
            const verified = verify(user.resetPasswordToken, RESET_PASSWORD_SECRET_KEY);
            if (verified) {
                res.status(400).send({ msg: 'Reset password in progress' });
                return;
            }
        }
        
        const RESET_PASSWORD_LIFE = process.env.RESET_PASSWORD_LIFE;
        const payload = { sub: user._id };
        const token = sign(
            payload,
            RESET_PASSWORD_SECRET_KEY,
            RESET_PASSWORD_LIFE,
        );
        if (!token) {
            throw new Error();
        }

        const receipients = `${user.name} <${user.email}>`;
        const subject = 'Reset your Schedule password';
        const url = `http://localhost:5173/reset-password/${token}`;
        const html = prepareHtml({
            title: 'Reset your Schedule password',
            content: 'Reset your Schedule password',
            bodyTitle: 'Reset password',
            bodyUser: user.name,
            bodyMessage:
                'To access your Schedule account, you need to reset your password.',
            bodyUrl: url,
            bodyButtonText: 'Reset my password',
        });

        send({ receipients, subject, html })
            .then(async () => {
                await User.findOneAndUpdate({ _id: user._id }, { resetPasswordToken: token })
                const response = {
                    msg: 'Please check your mail to reset password',
                };
                res.send(response);
            })
            .catch((error) => {
                throw new Error(error);
            });
    } catch (error) {
        next(error);
    }
};
