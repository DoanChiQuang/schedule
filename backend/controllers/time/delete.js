import Time from '../../models/time.js';
import TimeDetail from '../../models/timeDetail.js';

export const remove = async (req, res, next) => {
    try {
        const { id } = req.body;

        if(!id) {
            const error = new Error('Không có thời gian để xóa.')
            error.statusCode = 400
            next(error)
            return
        }

        const fetchTime = await Time.findOne({ _id: id });
        const TimeDetailIds = fetchTime.timeDetail;
        await TimeDetail.deleteMany({ _id: { $in: TimeDetailIds } });
        
        await Time.deleteOne({ _id: id });

        return res.json({
            status: 200,
            message: "Xóa thời gian thành công.",
            success: true,                
            data: []
        });
	} 
	catch (error) {
		next(error);
	}
}