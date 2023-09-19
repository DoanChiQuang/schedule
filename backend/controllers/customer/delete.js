import { ObjectId } from 'mongodb';
import Customer from '../../models/customer.js';

export const remove = async (req, res, next) => {
    try {
        const { id } = req.body;
        if(!id) {
            const error = new Error('Không có khách hàng nào để xóa.')
            error.statusCode = 400
            next(error)
            return
        }        

        const QWhere = { _id: new ObjectId(id) };
        const QWpdate = {
            $set: {
                del: 1
            }
        }

        const result = await Customer.updateOne(QWhere, QWpdate);

        return res.json({
            status: 200,
            message: "Xóa khách hàng thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}