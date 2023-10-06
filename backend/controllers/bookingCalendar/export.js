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
        const daysNameOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        let cashierId = [];
        cashier.forEach(e => {
            cashierId.push(cashierArr[Number(e)-1])
        })
        const fetchCalendars = await BookingCal.find({startDate: {'$gte': new Date(startDate), '$lte': new Date(endDate)}, isCustomer: 0, cashier: {$in: cashier}, isPay: 2});

        const allBookingCal = [];
        const yardAll = await Yard.find();
        const timeDAll = await TimeD.find();
        if(fetchCalendars){
            cashier.forEach((e) => {
                let sumAll = 0;
                const fetchAllCalendars = fetchCalendars.filter((cal) => cal.cashier==e);
                for(let j = 0; j < fetchAllCalendars.length; j++){
                    const bookingCal = [];
                    if(j == 0) {
                        bookingCal.push(cashierArr[Number(e)-1]);
                    }else{
                        bookingCal.push('');
                    }

                    let yard = '';
                    let day = -1;
                    let startper = '';
                    let endper = '';
                    let sumH = 0;
                    let details = [];
                    for(let f=0; f<fetchAllCalendars[j].details.length; f++){
                        yard = yardAll.find((y) => y._id==fetchAllCalendars[j].details[f].yard)
                        startper = timeDAll.find((t) => t._id==fetchAllCalendars[j].details[f].periodTime[0]);
                        endper = timeDAll.find((t) => t._id==fetchAllCalendars[j].details[f].periodTime[fetchAllCalendars[j].details[f].periodTime.length-1]);

                        day = daysNameOfWeek[fetchAllCalendars[j].details[f].day];
                        sumH+=(fetchAllCalendars[j].details[f].periodTime.length/2);
                        let dat = fetchAllCalendars[j].startDate.getDate()+"/"+(fetchAllCalendars[j].startDate.getMonth()+1)+"/"+fetchAllCalendars[j].startDate.getFullYear();
                        details.push(day+"-"+dat+": "+yard.name+" "+startper.startTime+":"+endper.endTime);
                    }
                
                    sumAll+=fetchAllCalendars[j].total+fetchAllCalendars[j].bonus;

                    // let obj = {
                    //     name: fetchAllCalendars[j].customerName,
                    //     details: details.toString(),
                    //     sumH: sumH,
                    //     pay: sumH*price,
                    //     bonus: fetchAllCalendars[j].bonus,
                    //     total: fetchAllCalendars[j].total
                    // };
                    bookingCal.push(formatDateToString(fetchAllCalendars[j].updatedAt));
                    bookingCal.push(fetchAllCalendars[j].customerName)
                    bookingCal.push(details.toString())
                    bookingCal.push(fetchAllCalendars[j].note)
                    bookingCal.push(sumH)
                    bookingCal.push(fetchAllCalendars[j].total)
                    bookingCal.push(fetchAllCalendars[j].bonus)
                    bookingCal.push(fetchAllCalendars[j].total+fetchAllCalendars[j].bonus)

                    if(j == fetchAllCalendars.length-1) {
                        bookingCal.push(sumAll);
                    }else{
                        bookingCal.push('');
                    }
                    allBookingCal.push(bookingCal);
                }

            })

        }
        
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Chi tiết lịch đặt');
        worksheet.addRow(['Người thu', 'Ngày thu','Tên khách', 'Chi tiết', 'Ghi chú', 'Tổng giờ', 'Tiền sân', 'Tiền thu thêm', 'Tổng', 'Tổng thu']);
        worksheet.addRows(allBookingCal);

        // headerRow.getCell(1).value = 'Người thu';
        // headerRow.getCell(2).value = 'Tên khách';
        // headerRow.getCell(3).value = 'Chi tiết';
        // headerRow.getCell(4).value = 'Tổng giờ';
        // headerRow.getCell(5).value = 'Tiền sân';
        // headerRow.getCell(6).value = 'Tiền thu thêm';
        // headerRow.getCell(7).value = 'Tổng';
        // headerRow.getCell(8).value = 'Ghi chú';
        // headerRow.getCell(9).value = 'Tổng thu';

        // workbook.xlsx.writeBuffer().then((buffer) => {
        //     const blob = new Blob([buffer], {
        //         type:'application/vnd.openxmlformats-officedocument.spreads'
        //     })
        //     saveAs(blob, 'Chi tiết lịch đặt sân.xlsx')
        // })
        
        const fileName = 'chi_tiet_lich_dat_san.xlsx';
        const filePath = 'backend/exports/' + fileName;
        workbook.xlsx.writeFile(filePath)
            .then(() => {
                res.json({ 
                    status: 200,
                    message: "Thành công.",
                    success: true,
                    data: {
                        fileName: fileName
                    }
                });
            })
            .catch(error => {            
                const newError = new Error('Lỗi xuất dữ liệu.')
                newError.statusCode = 400
                next(newError)
                return;
            });
    }
    catch(error) {
        next(error);
    }
}

function formatDateToString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }