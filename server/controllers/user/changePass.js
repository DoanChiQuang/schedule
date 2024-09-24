import { ObjectId } from 'mongodb';
import User from '../../models/user.js';
import bcrypt from 'bcrypt';

export const changePass = async (req, res, next) => {
    try {
        const { id, password, newpass, newpassconf} = req.body;
        if(!id) {
            const error = new Error('Không có tài khoản nào cần cập nhật.')
            error.statusCode = 400
            next(error)
            return
        }
        const user = await User.findById(id);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            const error = new Error('Mật khẩu cũ không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }
        if(newpass.length < 6) {
            const error = new Error('Mật khẩu mới phải lớn hơn 6 ký tự.')
            error.statusCode = 400
            next(error)
            return
        }
        if(newpass !== newpassconf) {
            const error = new Error('Mật khẩu mới và mật khẩu xác nhận không khớp.')
            error.statusCode = 400
            next(error)
            return
        }
        const hashedPassword = await bcrypt.hash(newpass, 10);
        const result = await User.updateOne({_id: id}, {
            password: hashedPassword,
        });

        return res.json({
            status: 200,
            message: "Cập nhật mật khẩu thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}