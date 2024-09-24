import User from '../../models/user.js';
import bcrypt from 'bcrypt';
export const signup = async (req, res, next) => {
	try {		
		const hashedPassword = await bcrypt.hash('123456', 10);
		
		const user = await User.create({
            name: 'admin',
			username: 'admin',
			password: hashedPassword,			
		});
		delete user.password;
        return res.json({
            status: 200,
            message: "Đăng ký tài khoản thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
};