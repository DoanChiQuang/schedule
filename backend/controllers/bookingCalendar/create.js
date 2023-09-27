import BookingCal from '../../models/bookingCalendar.js';
import Customer from '../../models/customer.js';
import Pay from '../../models/pay.js';
import { phoneRegExp } from '../../utils/RegexValidate.js';

export const create = async (req, res, next) => {
    try {
        const {id, startDate, endDate, idCustomer, isCustomer, nameCustomer, phoneCustomer, isPay, details, note} = req.body;
        //update status
        let dateOfDayWeek = [];
        if(id) {
            if(!await BookingCal.findOne({_id: id})) {
                const error = new Error("Không có lịch đặt để chỉnh sửa.");
                error.statusCode = 400;
                next(error);
                return;
            }
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
                        if(new Date(Date.UTC(year, month, i, 0, 0 ,0)).getDay() === e.day){
                            day.push(new Date(Date.UTC(year, month, i, 0, 0, 0)));
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
            const updateB = await BookingCal.updateOne({_id: id}, {isPay: isPay, note: note});

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
            let currentDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),0,0,0))

            let dupl = false;
            for(let i = 0; i < details.length; i++){
                const month = new Date(details[i].date).getMonth();
                const year = new Date(details[i].date).getFullYear();
                const day = new Date(details[i].date).getDay();
                const fetchAllCalen = await BookingCal.find({startDate: {'$gte': new Date(Date.UTC(year, month-1, 1, 0, 0, 0)), '$lte': new Date(Date.UTC(year, month, 0, 0, 0, 0))}, "details.day": day,"details.yard": details[i].yard, "details.periodTime": { $in:details[i].periodTime}, isCustomer: 1, isPay: {$ne: 2}})
                
                if(fetchAllCalen.length > 0){
                    dupl = true;
                }

                if(new Date(details[i].date).getTime() < currentDate.getTime()){
                    const error = new Error("Lịch không được đặt ngày quá khứ.");
                    error.statusCode = 400;
                    next(error);
                    return;
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
                let day_check = [];
                let date_check = [];
                let future_check = false;
                details.forEach(d => {
                    if(d) {
                        date_check.push(d.date);
                        day_check.push(new Date(d.date).getDay());

                        if(new Date(d.date).getMonth() > currentDate.getMonth()){
                            future_check = true;
                        }
    
                        let obj = {
                            day: new Date(d.date).getDay(),
                            yard: d.yard,
                            periodTime: d.periodTime,
                        };
                        details_sch.push(obj);
                    }
                });
                if(future_check){
                    const error = new Error("Lịch khách cố định chỉ được đặt trong tháng.");
                    error.statusCode = 400;
                    next(error);
                    return;
                }
                if([...new Set(day_check)].length != [...new Set(date_check)].length) {
                    const error = new Error("Lịch khách cố định không đặt cùng thứ trên nhiều tuần.");
                    error.statusCode = 400;
                    next(error);
                    return;
                }

                const customer = await Customer.findById({_id: idCustomer});

                const bookingCalIns = await BookingCal.create({
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    details: details_sch,
                    customerId: idCustomer,
                    customerName: customer.name,
                    customerPhone: customer.phonenum,
                    isCustomer: isCustomer,
                    isPay: isPay,
                    note: note
                });

                if(isPay == 2){
                    let startNum = new Date(startDate).getDate();
                    let endNum = new Date(endDate).getDate();
                    let totalDate = 0;
                    bookingCalIns.details.forEach(e => {
                        let day = [];
                        for(let i = startNum; i <= endNum; i++) {
                            if(new Date(Date.UTC(year, month, i, 0, 0, 0)).getDay() === e.day){
                                day.push(new Date(Date.UTC(year, month, i, 0, 0, 0)));
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
                        customerId: idCustomer,
                        customerName: customer.name,
                        customerPhone: customer.phonenum,
                        isCustomer: isCustomer,
                        isPay: 0
                    });
                }
            }
            else {
                // validation 
                if(!nameCustomer) {
                    const error = new Error("Tên không hợp lệ.");
                    error.statusCode = 400;
                    next(error);
                    return;
                }
                if(!phoneCustomer || !phoneRegExp.test(phoneCustomer)) {
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
                            // customerId: idCustomer,
                            customerName: nameCustomer,
                            customerPhone: phoneCustomer,
                            isCustomer: isCustomer,
                            isPay: isPay,
                            note: note
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