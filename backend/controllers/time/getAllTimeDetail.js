import Time from '../../models/time.js';

export const getAllTimeDetail = async (req, res, next) => {
    try {
        const times = await Time.find({ default: true }).populate("timeDetail");
        
        const timeSlots = [];
        times.forEach((time) => {
            time.timeDetail.forEach((detail) => {                
                const startTime = detail.startTime;
                const endTime = detail.endTime;
                const formattedTime = `${startTime} - ${endTime}`;                                
                timeSlots.push({ name: formattedTime, id: detail._id.toString() });
            });
        });
        return res.json({ 
            status: 200,
            message: "Thành công.",
            success: true,
            data: timeSlots
        });
    } catch (error) {
        next(error)
    }
}