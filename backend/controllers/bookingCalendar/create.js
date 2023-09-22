import BookingCal from '../../models/bookingCalendar.js';
import Customer from '../../models/customer.js';
import Pay from '../../models/pay.js';
import { phoneRegExp } from '../../utils/RegexValidate.js';

export const create = async (req, res, next) => {
    try {
        const {id, startDate, endDate, idCus, isCustomer, cusName, sdt, isPay, details} = req.body;
        //update status
        let dateOfDayWeek = [];
        if(id) {
            if (isPay == 2 && isCustomer) {
                // let dateOfDateWeekN = [];
                const bookCal = await BookingCal.findOne({_id: id});
                let month = bookCal.startDate.getMonth();
                let year = bookCal.startDate.getFullYear();
                let startNum = new Date(startDate).getDate();
                let endNum = new Date(endDate).getDate();
                let totalDate = 0;
                
                bookCal.details.forEach(e => {
                    let day = [];
                    for(let i = startNum; i <= endNum; i++) {
                        if(new Date(year, month, i).getDay() === e.day){
                            day.push(new Date(year, month, i+1));
                            totalDate++;
                        }
                    }
                    dateOfDayWeek.push({date: day, yard: e.yard, periodTime: e.periodTime});
                })

                const payIns = await Pay.create({
                    idBookingCal: bookCal._id,
                    month: month,
                    year: year,
                    totalDate: totalDate,
                    details: dateOfDayWeek
                })
                
                if(month === 11) {
                    year = year+1;
                    month = 0;
                }else{
                    month = month+1;
                }
              
                const createB = await BookingCal.create({
                    startDate: new Date(Date.UTC(year, month, 1, 0, 0, 0)),
                    endDate: new Date(Date.UTC(year, month+1, 0, 0, 0, 0)),
                    details: bookCal.details,
                    customerId: bookCal.customerId,
                    customerName: bookCal.customerName,
                    customerPhone: bookCal.customerPhone,
                    isCustomer: 1,
                    isPay: 0
                });
            }
            const updateB = await BookingCal.updateOne({_id: id}, {isPay: isPay});

            return res.json({
                status: 200,
                message: "Cập nhật thành công.",
                success: true,                
                data: {}
            });
        }else{
            //create
            let month = new Date(startDate).getMonth();
            let year = new Date(startDate).getFullYear();

            let dupl = false;
            for(let i = 0; i < details.length; i++){
                const month = new Date(details[i].date).getMonth();
                const year = new Date(details[i].date).getFullYear();
                const day = new Date(details[i].date).getDay();
                const fetchAllCalen = await BookingCal.find({startDate: {'$gte': new Date(Date.UTC(year, month, 1, 0, 0, 0)), '$lte': new Date(Date.UTC(year, month+1, 0, 0, 0, 0))}, "details.day": day,"details.yard": details[i].yard, "details.periodTime": { $in:details[i].periodTime}, isCustomer: 1, isPay: {$ne: 2}})
                
                if(fetchAllCalen.length > 0){
                    dupl = true;
                }
            }
            if(dupl){
                const error = new Error('Không tạo được lịch do trùng lịch với khách cố định.');
                error.statusCode = 400;
                next(error);
                return;
            }
            
            if(isCustomer) {
                let details_sch = [];
                details.forEach(d => {
                    if(d) {
                        let obj = {
                            day: new Date(d.date).getDay(),
                            yard: d.yard,
                            periodTime: d.periodTime,
                        };
                        details_sch.push(obj);
                    }
                });
                const customer = await Customer.findById({_id: idCus});

                const bookingCalIns = await BookingCal.create({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    details: details_sch,
                    customerId: idCus,
                    customerName: customer.name,
                    customerPhone: customer.phonenum,
                    isCustomer: isCustomer,
                    isPay: isPay
                });

                if(isPay == 2){
                    let startNum = new Date(startDate).getDate();
                    let endNum = new Date(endDate).getDate();
                    let totalDate = 0;
                    bookingCalIns.details.forEach(e => {
                        let day = [];
                        for(let i = startNum; i <= endNum; i++) {
                            if(new Date(year, month, i).getDay() === e.day){
                                day.push(new Date(year, month, i+1));
                                totalDate++;
                            }
                        }
                        dateOfDayWeek.push({date: day, yard: e.yard, periodTime: e.periodTime});
                    })

                    const payIns = await Pay.create({
                        idBookingCal: bookingCalIns._id,
                        month: month,
                        year: year,
                        totalDate: totalDate,
                        details: dateOfDayWeek
                    })

                    if(month == 11) {
                        year+=1;
                        month = 0;
                    }else{
                        month = month+1;
                    }

                    const bookingCalInsNextMonth = await BookingCal.create({
                        startDate: new Date(Date.UTC(year, month, 1, 0, 0, 0)),
                        endDate: new Date(Date.UTC(year, month+1, 0, 0, 0, 0)),
                        details: details_sch,
                        customerId: idCus,
                        customerName: customer.name,
                        customerPhone: customer.phonenum,
                        isCustomer: isCustomer,
                        isPay: 0
                    });
                }
            }
            else {
                // validation 
                if(!cusName) {
                    const error = new Error("Tên không hợp lệ.");
                    error.statusCode = 400;
                    next(error);
                    return;
                }
                if(!sdt || !phoneRegExp.test(sdt)) {
                    const error = new Error('Số điện thoại không hợp lệ.');
                    error.statusCode = 400;
                    next(error);
                    return;
                }  

                let details_sch = [];
                details.forEach(d => {
                    if(d) {
                        details_sch.push({
                            startDate: new Date(d.date),
                            endDate: new Date(d.date),
                            details: {
                                day: new Date(d.date).getDay(),
                                yard: d.yard,
                                periodTime: d.periodTime,
                            },
                            customerId: idCus,
                            customerName: cusName,
                            customerPhone: sdt,
                            isCustomer: isCustomer,
                            isPay: isPay
                        });
                  
                      
                    }
                });
                const booking = await BookingCal.insertMany(details_sch);
            }
            return res.json({
                status: 200,
                message: "Đặt lịch thành công.",
                success: true,                
                data: {}
            });
        }
    }
    catch(error){
        next(error);
    }
}