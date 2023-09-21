import mongoose from 'mongoose';
import Time from '../../models/time.js';
import TimeDetail from '../../models/timeDetail.js';

export const create = async (req, res, next) => {
    try {
        const { name, startTime, endTime, period } = req.body;
        if(!name) {
            const error = new Error('Tên không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }

        if(!startTime) {
            const error = new Error('Thời gian bắt đầu không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }

        if(!endTime) {
            const error = new Error('Thời gian kết thúc không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }

        if(!period) {
            const error = new Error('Khoảng thời gian không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }

        const QWhere = { default: true };
        const QUpdate = { $set: { default: false } };
        
        const result = await Time.updateMany(QWhere, QUpdate);

        const startTimeInMinute = convertToMinute(startTime);
        const startEndInMinute = convertToMinute(endTime);
        const periodConverted = parseInt(period);

        const TimeDetails = [];
        for (let index = startTimeInMinute; index < startEndInMinute; index+=periodConverted) {            
            const timeDetail = new TimeDetail({ 
                _id: new mongoose.Types.ObjectId(),
                startTime: convertToHour(index), 
                endTime: convertToHour(index + periodConverted) 
            });
            TimeDetails.push(timeDetail);
        }

        await TimeDetail.insertMany(TimeDetails);
                
		const time = await Time.create({
            name: name,
            startTime: startTime,
            endTime: endTime,
            period: period,
            timeDetail: TimeDetails.map(item => item._id)
        });

        return res.json({
            status: 200,
            message: "Thành công.",
            success: true,                
            data: []
        });
	} 
	catch (error) {
		next(error);
	}
}

const convertToMinute = (hour) => {
    var hourArr = hour.split(':');
    var Hour = parseInt(hourArr[0], 10);
    var Minute = parseInt(hourArr[1], 10);
    var MinuteTotal = (Hour * 60) + Minute;
    return MinuteTotal;
}

function convertToHour(minute) {
    var Hour = Math.floor(parseInt(minute) / 60);
    var Minute = parseInt(minute) % 60;
    var HourTotal = Hour.toString().padStart(2, '0') + ':' + Minute.toString().padStart(2, '0');
    return HourTotal;
}