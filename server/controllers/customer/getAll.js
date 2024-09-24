import Customer from '../../models/customer.js';

export const getAll = async (req, res, next) => {
    try {
        await Customer.createIndexes({_id: 1});
        const fetchCustomer = await Customer.find({del: 0}, {_id: 1, name: 1, phonenum: 1, bankAccountNo: 1, bankAccountName: 1, bankName: 1, discount: 1, del: 1});
        return res.json({ 
            status: 200,
            message: "Thành công.",
            success: true,
            data: fetchCustomer
        });
    } catch (error) {
        next(error)
    }
}