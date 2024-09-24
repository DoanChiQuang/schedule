import BookingCal from '../../models/bookingCalendar.js';

export const getAll = async (req, res, next) => {
    try {
        const {startDate, endDate} = req.body;
        if(!startDate) {
            const error = new Error('Thời gian bắt đầu không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }

        if(!startDate) {
            const error = new Error('Thời gian kết thúc không hợp lệ.')
            error.statusCode = 400
            next(error)
            return
        }
        const yearStart = new Date(startDate).getFullYear();
        const yearEnd = new Date(endDate).getFullYear();
        const monthStart = new Date(startDate).getMonth();
        const monthEnd = new Date(endDate).getMonth();
        const dateStart = new Date(startDate).getDate();
        const dateEnd = new Date(endDate).getDate();


        const fetchAllCalendars = await BookingCal.find({startDate: {'$gte': new Date(Date.UTC(yearStart, monthStart-1, 1, 0, 0, 0)), '$lte': new Date(endDate)}});

        const allBookingCal = [];
        fetchAllCalendars.forEach(async cal => {
            const year = new Date(cal.startDate).getFullYear();
            const month = new Date(cal.startDate).getMonth();
            let startNum = new Date(startDate).getDate();
            let endNum = new Date(Date.UTC(year, month+1, 0, 0, 0, 0)).getDate();
            let detailsCal = [];

            if(cal.isCustomer && cal.type){
                let eDateCheck = cal.endDate
                if(!cal.endDate) {
                    eDateCheck = new Date(Date.UTC(year, month+1, 0, 0, 0, 0));
                }
                if(new Date(startDate).getTime() < new Date(eDateCheck).getTime()){
                    if(dateStart > dateEnd && month == monthEnd) {
                        endNum = new Date(endDate).getDate();
                        startNum = 1;
                    }
                    if(cal.endDate && new Date(cal.endDate).getDate() < endNum) {
                        endNum = new Date(cal.endDate).getDate();
                    }
                    if(dateStart < dateEnd) {
                        endNum = new Date(endDate).getDate();
                        if(dateEnd > new Date(eDateCheck).getDate()){
                            endNum = new Date(eDateCheck).getDate();
                        }
                    }

                    cal.details.forEach(da => {
                        let detailsDate = [];
                        for(let dateNum = startNum; dateNum <= endNum; dateNum++) {
                            if(da.day == new Date(Date.UTC(year, month, dateNum, 0, 0, 0)).getDay()) {
                                // detailsDate.push(new Date(Date.UTC(year, month, dateNum, 0, 0, 0)));
                                detailsCal.push({
                                    date: new Date(Date.UTC(year, month, dateNum, 0, 0, 0)),
                                    yard: da.yard,
                                    periodTime: da.periodTime
                                });
                            }
                        }

                        // if (detailsDate){
                        //     detailsCal.push({
                        //         date: detailsDate,
                        //         yard: da.yard,
                        //         periodTime: da.periodTime
                        //     });
                        // }
                    });
                }
            }else{
                cal.details.forEach(da => {
                    detailsCal.push({
                        date: new Date(da.date),
                        yard: da.yard,
                        periodTime: da.periodTime
                    });
                });
            }
            // let payCheck = cal.isPay;
            // let dateNowZ = new Date();
            // const dateNow = new Date(Date.UTC(dateNowZ.getFullYear(), dateNowZ.getMonth(), dateNowZ.getDate(), 0, 0, 0));

            // if((cal.endDate.getTime() - dateNow.getTime()) <= 86400000 && cal.isPay != 2) {
            //     payCheck = 4;
            // };
            if(detailsCal.length){
                allBookingCal.push({
                    id: cal._id,
                    startDate: cal.startDate,
                    endDate: cal.endDate,
                    details: detailsCal,
                    isCustomer: cal.isCustomer,
                    customerId: cal.customerId,
                    customerName: cal.customerName,
                    customerPhone: cal.customerPhone,
                    isPay: cal.isPay,
                    note: cal.note,
                    type: cal.type,
                    bonus: cal.bonus,
                    cashier: cal.cashier,
                    total: cal.total,
                });
            }
        })

        return res.json({ 
            status: 200,
            message: "Thành công.",
            success: true,
            data: allBookingCal
        });
    } catch (error) {
        next(error)
    }
}