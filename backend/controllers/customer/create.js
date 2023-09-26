import Customer from '../../models/customer.js';
import { phoneRegExp } from '../../utils/RegexValidate.js';

export const create = async (req, res, next) => {
    try {
        const { name, phonenum, bankAccountNo, bankAccountName, bankName, discount } = req.body;
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
        if(await Customer.findOne({phonenum: phonenum, del: 0})) {
            const error = new Error('Số điện thoại người dùng đã tồn tại.')
            error.statusCode = 400
            next(error)
            return
        }
		const customer = await Customer.create({
            name,
            phonenum,
            bankAccountNo,
            bankAccountName,
            bankName,
            discount: discount || 0
		});

        return res.json({
            status: 200,
            message: "Thêm khách hàng thành công.",
            success: true,                
            data: {}
        });		
	} 
	catch (error) {
		next(error);
	}
}