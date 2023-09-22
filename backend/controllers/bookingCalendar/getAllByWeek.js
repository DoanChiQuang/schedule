import BookingCal from '../../models/bookingCalendar.js';
import Customer from '../../models/customer.js';

export const getAll = async (req, res, next) => {
    try {
        const {startDate, endDate} = req.body;
        const yearStart = new Date(startDate).getFullYear();
        const yearEnd = new Date(endDate).getFullYear();
        const monthStart = new Date(startDate).getMonth();
        const monthEnd = new Date(endDate).getMonth();
        const dateStart = new Date(startDate).getDate();
        const dateEnd = new Date(endDate).getDate();


        const fetchAllCalendars = await BookingCal.find({startDate: {'$gte': new Date(Date.UTC(yearStart, monthStart, 1, 0, 0, 0)), '$lte': new Date(endDate)}});

        const allBookingCal = [];
        fetchAllCalendars.forEach(async cal => {
            const year = new Date(cal.startDate).getFullYear();
            const month = new Date(cal.startDate).getMonth();
            let startNum = new Date(startDate).getDate();
            let endNum = new Date(Date.UTC(year, month+1, 0, 0, 0, 0)).getDate();
            let detailsCal = [];

            if(cal.isCustomer){
                if(dateStart > dateEnd && month == monthEnd) {
                    endNum = new Date(endDate).getDate();
                    startNum = 1;
                }
                if(dateStart < dateEnd) {
                    endNum = new Date(endDate).getDate();
                }

                cal.details.forEach(da => {
                    let detailsDate = [];
                    for(let dateNum = startNum; dateNum <= endNum; dateNum++) {
                        if(da.day == new Date(year, month, dateNum).getDay()) {
                            detailsDate.push(new Date(Date.UTC(year, month, dateNum, 0, 0, 0)));
                        }
                    }

                    if (detailsDate.length){
                        detailsCal.push({
                            date: detailsDate,
                            yard: da.yard,
                            periodTime: da.periodTime
                        });
                    }
                });
            }else{
                detailsCal.push({
                    date: new Date(cal.startDate),
                    yard: cal.details[0].yard,
                    periodTime: cal.details[0].periodTime
                });
            }
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