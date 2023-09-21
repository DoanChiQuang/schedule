import Time from '../../models/time.js';

export const create = async (req, res, next) => {
    try {
        // const { name, startTime, endTime, period } = req.body;
        // if(!name) {
        //     const error = new Error('Tên không hợp lệ.')
        //     error.statusCode = 400
        //     next(error)
        //     return
        // }

        // if(!startTime) {
        //     const error = new Error('Thời gian bắt đầu không hợp lệ.')
        //     error.statusCode = 400
        //     next(error)
        //     return
        // }

        // if(!endTime) {
        //     const error = new Error('Thời gian kết thúc không hợp lệ.')
        //     error.statusCode = 400
        //     next(error)
        //     return
        // }

        // if(!period) {
        //     const error = new Error('Khoảng thời gian không hợp lệ.')
        //     error.statusCode = 400
        //     next(error)
        //     return
        // }

        const startTime = '9:00';
        const endTime = '22:00';
        const period = parseInt('30');

        const startTimeInMinute = convertToMinute(startTime);
        const startEndInMinute = convertToMinute(endTime);        

        const TimeDetail = [];
        for (let index = startTimeInMinute; index < startEndInMinute; index+=period) {            
            TimeDetail.push({startTime: convertToHour(index), endTime: convertToHour(index+period)});
        }
                
		// const customer = await Customer.create({
        //     name,
        //     phonenum,
        //     bankAccountNo,
        //     bankAccountName,
        //     bankName,
        //     discount: discount || 0
		// });

        return res.json({
            status: 200,
            message: "Thêm khách hàng thành công.",
            success: true,                
            data: TimeDetail
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