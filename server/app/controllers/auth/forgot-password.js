import { User } from '../../models/user.js';
import { sign, verify } from '../../services/jwt.js';
import { prepareHtml, send } from '../../services/mailer.js';

const RESET_PASSWORD_SECRET_KEY = process.env.RESET_PASSWORD_SECRET_KEY;
const RESET_PASSWORD_LIFE = process.env.RESET_PASSWORD_LIFE;

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error();
        }

        let user = await User.findOne({ email: email, del: 0 });
        if (!user) {
            res.status(401).send({ msg: 'Tài khoản chưa được đăng ký.' });
            return;
        }

        if (user.resetPassToken) {
            const verified = verify(
                user.resetPassToken,
                RESET_PASSWORD_SECRET_KEY,
            );
            if (verified) {
                res.status(400).send({
                    msg: 'Thay đổi mật khẩu đang được thực hiện.',
                });
                return;
            }
        }

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
        const subject = 'Thay đổi mật khẩu Schedule';
        const url = `http://localhost:5173/reset-password/${token}`;
        const html = prepareHtml({
            title: 'Thay đổi mật khẩu Schedule',
            content: 'Thay đổi mật khẩu Schedule',
            bodyTitle: 'Đổi mật khẩu',
            bodyUser: user.name,
            bodyMessage:
                'Để đăng nhập vào Schedule, bạn cần phải thay đổi mật khẩu.',
            bodyUrl: url,
            bodyButtonText: 'Đổi mật khẩu',
        });

        send({ receipients, subject, html })
            .then(async () => {
                await User.findOneAndUpdate(
                    { _id: user._id },
                    { resetPassToken: token },
                );
                const response = {
                    msg: 'Đã gửi yêu cầu.',
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
