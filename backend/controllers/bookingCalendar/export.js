import Excel from 'exceljs';
import saveAs from 'file-saver';
import BookingCal from '../../models/bookingCalendar.js';
import Yard from '../../models/yard.js';
import TimeD from '../../models/timeDetail.js';

export const exportB = async (req, res, next) => {
    try {
        const {startDate, endDate, cashier} = req.body;
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
        const price = 80000;
        const cashierArr = ["Anh", "Khánh", "Quân"];
        // const fetchAllCalendars = await BookingCal.find({startDate: {'$gte': new Date(startDate), '$lte': new Date(endDate)}, isCustomer: 0, cashier: {$in: cashier}});

        const allBookingCal = [];
        for(let i = 0; i < cashierArr.length; i++){
            let cashNum = i+1;
            let sumAll = 0;
            const fetchAllCalendars = await BookingCal.find({startDate: {'$gte': new Date(startDate), '$lte': new Date(endDate)}, isCustomer: 0, cashier: cashNum});
            if(fetchAllCalendars){
                for(let j = 0; j < fetchAllCalendars.length; j++){
                    const bookingCal = [];
                    if(j == 0) {
                        bookingCal.push(cashierArr[i]);
                    }else{
                        bookingCal.push('');
                    }
                    if(fetchAllCalendars[j].cashier == cashNum){
                        let yard = '';
                        let day = -1;
                        let startper = '';
                        let endper = '';
                        let sumH = 0;
                        let details = [];
                        for(let f=0; f<fetchAllCalendars[j].details.length; f++){
                            yard = await Yard.findOne({_id: fetchAllCalendars[j].details[f].yard});
                            startper = await TimeD.findOne({_id: fetchAllCalendars[j].details[f].periodTime[0]});
                            endper = await TimeD.findOne({_id: fetchAllCalendars[j].details[f].periodTime[fetchAllCalendars[j].details[f].periodTime.length-1]});
                            day = fetchAllCalendars[j].details[f].day+1;
                            sumH+=(fetchAllCalendars[j].details[f].periodTime.length/2);
                            let dat = fetchAllCalendars[j].startDate.getDate()+"/"+(fetchAllCalendars[j].startDate.getMonth()+1)+"/"+fetchAllCalendars[j].startDate.getFullYear();
                            details.push("Thứ "+day+"-"+dat+": "+yard.name+" "+startper.startTime+":"+endper.endTime);
                        }
                    
                        sumAll+=fetchAllCalendars[j].total;

                        // let obj = {
                        //     name: fetchAllCalendars[j].customerName,
                        //     details: details.toString(),
                        //     sumH: sumH,
                        //     pay: sumH*price,
                        //     bonus: fetchAllCalendars[j].bonus,
                        //     total: fetchAllCalendars[j].total
                        // };

                        bookingCal.push(fetchAllCalendars[j].customerName)
                        bookingCal.push(details.toString())
                        bookingCal.push(sumH)
                        bookingCal.push(sumH*price)
                        bookingCal.push(fetchAllCalendars[j].bonus)
                        bookingCal.push(fetchAllCalendars[j].total)
                        // bookingCal.push(obj);
                    }
                    if(j == 0) {
                        bookingCal.push(sumAll);
                    }else{
                        bookingCal.push('');
                    }
                    allBookingCal.push(bookingCal);
                }

            }

        };
        console.log(allBookingCal);
        
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Chi tiết lịch đặt');
        worksheet.addRow(['Người thu', 'Tên khách', 'Chi tiết', 'Tổng giờ', 'Tiền sân', 'Tiền thu thêm', 'Tổng', 'Ghi chú', 'Tổng thu']);
        worksheet.addRows(allBookingCal);
        // allBookingCal.forEach(e => {
        //     let row = [e[0], e[1].name, e[1].details, e[1].sumH, e[1].pay, e[1].bonus, e[1].total, e[2]]
        //     console.log(row);
        //     worksheet.addRow(row);
        // });
        // headerRow.getCell(1).value = 'Người thu';
        // headerRow.getCell(2).value = 'Tên khách';
        // headerRow.getCell(3).value = 'Chi tiết';
        // headerRow.getCell(4).value = 'Tổng giờ';
        // headerRow.getCell(5).value = 'Tiền sân';
        // headerRow.getCell(6).value = 'Tiền thu thêm';
        // headerRow.getCell(7).value = 'Tổng';
        // headerRow.getCell(8).value = 'Ghi chú';
        // headerRow.getCell(9).value = 'Tổng thu';

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type:'application/vnd.openxmlformats-officedocument.spreads'
            })
            saveAs(blob, 'Chi tiết lịch đặt sân.xlsx')
        })

        return res.json({ 
            status: 200,
            message: "Thành công.",
            success: true,
            data: ''
        });
    }
    catch(error) {
        next(error);
    }
}