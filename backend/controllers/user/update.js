import { ObjectId } from 'mongodb';
import User from '../../models/user.js';
import bcrypt from 'bcrypt';

export const update = async (req, res, next) => {
    try {
        const { id, username, password, name } = req.body;
        if(!id) {
            const error = new Error('Không có tài khoản nào cần cập nhật.')
            error.statusCode = 400
            next(error)
            return
        }
        if(!password) {
            if(!username) {
                const error = new Error('Tên tài khoản không hợp lệ.')
                error.statusCode = 400
                next(error)
                return
            }

            if(!name) {
                const error = new Error('Tên không hợp lệ.')
                error.statusCode = 400
                next(error)
                return
            }

            const result = await User.updateOne({_id: id}, {
                username: username,
                name: name
            });
        }else{
            if(password.length < 6) {
                const error = new Error('Mật khẩu phải lớn hơn 6 ký tự.')
                error.statusCode = 400
                next(error)
                return
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.updateOne({_id: id}, {
                password: hashedPassword,
            });
        }	

        return res.json({
            status: 200,
            message: "Cập nhật tài khoản thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}