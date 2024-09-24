import { ObjectId } from 'mongodb';
import User from '../../models/user.js';

export const enable = async (req, res, next) => {
    try {
        const { id } = req.body;
        if(!id) {
            const error = new Error('Id không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }        

        // const QWhere = { _id: new ObjectId(id) };
        // const QUpdate = {
        //     $set: {
        //         del: 0
        //     }
        // }

        const result = await User.updateOne({_id: id}, {del: 0});		

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