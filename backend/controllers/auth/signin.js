import { accessTokenLifeTemp, accessTokenSecretTemp } from '../../contants/jwt.js';
import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../services/jwt.js';

export const signin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const fetchUser = await User.findOne({ username });
        const user = fetchUser?.toObject();
        if(!user) {
            const error = new Error('Tài khoản hoặc mật khẩu không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            const error = new Error('Tài khoản hoặc mật khẩu không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }
        delete user.password;

        const accessTokenLife 	= process.env.ACCESS_TOKEN_LIFE || accessTokenLifeTemp;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || accessTokenSecretTemp;

        const dataForAccessToken = {
            username: user.username
        };
        const accessToken = await generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife
        );

        if (!accessToken) {
            return res.json({
                status: 401,
                message: "Token hết hạn.",
                success: false,                
                data: {}
            });			
        }
        
        return res.json({ 
            status: 200,
            message: "Đăng nhập thành công.",
            success: true,
            data: {
                token: accessToken,
                user: user,
            }            
        });
    } catch(error) {
        next(error);
    }
};