import { Schedule } from '../../models/schedule.js';

export default create = async (req, res, next) => {
    try {
        const { title, weekday, dtstart, until, duration, customerId } =
            req.body;

        const schedule = await Schedule.create({
            title,
            weekday,
            dtstart,
            until,
            duration,
            customerId,
        });
    } catch (error) {
        next(error);
    }
};
