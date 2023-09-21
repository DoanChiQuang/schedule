import { ObjectId } from 'mongodb';
import BookingCal from '../../models/bookingCalendar.js';

export const remove = async (req, res, next) => {
    try{
        const { id } = req.body;
        const cal = await BookingCal.findById(id);

        if(!id || !cal) {
            const error = new Error('Không có lịch đặt để xóa.')
            error.statusCode = 400
            next(error)
            return
        }
        
        const delBook = await BookingCal.deleteMany({_id: id});
        
        return res.json({
            status: 200,
            message: "Xóa lịch đặt thành công.",
            success: true,
            data: {}
        });
    }
    catch(error){
        next(error);
    }
}