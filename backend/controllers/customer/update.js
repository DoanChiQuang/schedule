import { ObjectId } from 'mongodb';
import Customer from '../../models/customer.js';
import { phoneRegExp } from '../../utils/RegexValidate.js';

export const update = async (req, res, next) => {
    try {
        const { id, name, phonenum, bankAccountNo, bankAccountName, bankName, discount } = req.body;
        if(!id) {
            const error = new Error('Không có khách hàng nào cần cập nhật.')
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

        if(!phonenum || !phoneRegExp.test(phonenum)) {
            const error = new Error('Số điện thoại không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }

        const QWhere = { _id: new ObjectId(id) };
        const QWpdate = {
            $set: {
                name,
                phonenum, 
                bankAccountNo, 
                bankAccountName, 
                bankName, 
                discount: discount || 0
            }
        }

        const result = await Customer.updateOne(QWhere, QWpdate);		

        return res.json({
            status: 200,
            message: "Cập nhật khách hàng thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}