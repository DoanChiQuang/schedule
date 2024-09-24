import { ObjectId } from 'mongodb';
import User from '../../models/user.js';

export const setPermission = async (req, res, next) => {
    try {
        const { id, yardList } = req.body;
        if(!id) {
            const error = new Error('Không có tài khoản nào cần cấp quyền.')
            error.statusCode = 400
            next(error)
            return
        }

        if(!yardList.length) {
            const error = new Error('Danh sách sân trống.')
            error.statusCode = 400
            next(error)
            return
        }

        // const QWhere = { _id: new ObjectId(id) };
        // const QUpdate = {
        //     $set: {
        //         name,
        //         phonenum, 
        //         bankAccountNo, 
        //         bankAccountName, 
        //         bankName, 
        //         discount: discount || 0
        //     }
        // }

        const result = await Customer.updateOne({_id: id}, {
            yardList: yardList
        });		

        return res.json({
            status: 200,
            message: "Cập quyền thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}