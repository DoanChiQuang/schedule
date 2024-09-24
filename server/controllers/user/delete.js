import { ObjectId } from 'mongodb';
import User from '../../models/user.js';

export const remove = async (req, res, next) => {
    try {
        const { id } = req.body;
        if(!id) {
            const error = new Error('Không có tài khoản nào để xóa.')
            error.statusCode = 400
            next(error)
            return
        }        

        // const QWhere = { _id: new ObjectId(id) };
        // const QUpdate = {
        //     $set: {
        //         del: 1
        //     }
        // }

        const result = await User.updateOne({_id: id}, {del: 1});

        return res.json({
            status: 200,
            message: "Xóa tài khoản thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}