import Time from '../../models/time.js';

export const getAll = async (req, res, next) => {
    try {
        await Time.createIndexes({_id: 1});
        const fetchTime = await Time.find({}, {_id: 1, name: 1, startTime: 1, endTime: 1, period: 1, default: 1});
        return res.json({ 
            status: 200,
            message: "Thành công.",
            success: true,
            data: fetchTime
        });
    } catch (error) {
        next(error)
    }
}