import User from '../../models/user.js';
import bcrypt from 'bcrypt';
export const create = async (req, res, next) => {
	try {
		const {username, name} = req.body;
		const hashedPassword = await bcrypt.hash('123456', 10);
		
		const user = await User.create({
            name: name,
			username: username,
			password: hashedPassword,		
			role: 'staff',		
		});
		// delete user.password;
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