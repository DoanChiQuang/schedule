import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../Layout/Layout-v2";
import { Autocomplete, Box, Button, FormControlLabel, IconButton, Modal, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, debounce, styled, tooltipClasses, useTheme } from "@mui/material";
import { CALENDER_PATH } from "../../../../Main/Route/path";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import useApi from "../../../Hooks/useApi";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ReplayIcon from '@mui/icons-material/Replay';
import * as apiCalendar from "../../../Api/bookingCalendar";
import * as apiTime from "../../../Api/time";
import * as apiYard from "../../../Api/yard";
import * as apiCustomer from "../../../Api/customer";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { numberRegExp, phoneRegExp } from "../../../Utils/regexValidation";
import { AlertComponent, Loading } from "../../../Components/UI";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import { deburr } from "lodash";
import { API_URL } from "../../../Utils/axiosIntance";
import { saveAs } from 'file-saver';

const TIME = 30

const Calendar = () => {

    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(apiCalendar.getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate, setData: setDataCreate } = useApi(apiCalendar.create);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove, setData: setDataRemove } = useApi(apiCalendar.remove);
    const { data: dataGetAllTimeDetail, loading: loadingGetAllTimeDetail, error: errorGetAllTimeDetail, message: messageGetAllTimeDetail, request: requestGetAllTimeDetail, setData: setDataGetAllTimeDetail } = useApi(apiTime.getAllTimeDetail);
    const { data: dataYard, loading: loadingYard, error: errorYard, message: messageYard, request: requestYard, setData: setDataYard } = useApi(apiYard.getAll);
    const { data: dataCustomer, loading: loadingCustomer, error: errorCustomer, message: messageCustomer, request: requestCustomer, setData: setDataCustomer } = useApi(apiCustomer.getAll);
    const { data: dataExport, loading: loadingExport, error: errorExport, message: messageExport, request: requestExport, setData: setDataExport } = useApi(apiCalendar.exportData);
    
    const daysNameOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const loading = loadingGetAll || loadingGetAllTimeDetail || loadingYard || loadingCustomer || loadingCreate || loadingRemove || loadingExport;
    const theme = useTheme();
    const styles = style(theme);
    const [selectedCells, setSelectedCells] = useState([]);
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [timeBooked, setTimeBooked] = useState([]);
    const [timeBookedInitial, setTimeBookedInitial] = useState([]);
    const [yards, setYards] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [calData, setCalData] = useState({
        id: "",
        startDate: "",
        endDate: "",
        isCustomer: 1,
        idCustomer: "",
        nameCustomer: "",
        phoneCustomer: "",
        type: 0, // 0 is day , 1 is month
        isPay: 0,
        bonus: 0,
        total: 0,
        cashier: "1",
        note: "",
        details: []
    });
    const [calError, setCalError] = useState(false);
    const [calErrorData, setCalErrorData] = useState({
        key: '',
        message: ''
    });
    const [alert, setAlert] = useState(false);
    const [alertMess, setAlertMess] = useState('');
    const [alertType, setAlertType] = useState('');
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [filterAlert, setFilterAlert] = useState(false);
    const [filterAlertMess, setFilterAlertMess] = useState('');
    const [timeBookedId, setTimeBookedId] = useState('');
    const [timeDetailUpdate, setTimeDetailUpdate] = useState([]);
    const [filterSDate, setFilterSDate] = useState(dayjs());
    const [filterEDate, setFilterEDate] = useState(dayjs().add(6, 'day'));
    const [endDateCreate, setEndDateCreate] = useState('');
    const [openFilter, setOpenFilter] = useState(false);
    const [openExport, setOpenExport] = useState(false);
    const [filterOption, setFilterOption] = useState({
        isCustomer: 2,
        name: ""
    });
    const [exportOption, setExportOption] = useState({
        startDate: "",
        endDate: "",
        cashier: [],
    });
    const [hasFilter, setHasFilter] = useState(false);
    const [blockUpdate, setBlockUpdate] = useState(false);
    const cashier = [
        {
            "label": "1 - Anh",
            "value": "1"
        },
        {
            "label": "2 - Khánh",
            "value": "2"
        },
        {
            "label": "3 - Quân",
            "value": "3"
        }
    ];
    const inputRefBonusPrice = useRef(null);
    const inputRefYardPrice = useRef(null);
    const [identify, setIdentify] = useState({
        date: '',
        time: '',
        yard: ''
    });

    // const fetchInitial = () => {
    //     requestGetAll({startDate: formatDate(formatDateDot(filterSDate)), endDate: formatDate(formatDateDot(filterEDate))});
    //     requestGetAllTimeDetail();
    //     requestYard();
    //     requestCustomer();
    //     const daysOfWeekNow = getCurrentWeekDates();
    //     setDaysOfWeek(daysOfWeekNow);
    // }

    const fetchInitial = async () => {
        try {
            const [getAllResponse, timeDetailResponse, yardResponse, customerResponse] = await Promise.all([
                requestGetAll({ startDate: formatDate(formatDateDot(filterSDate)), endDate: formatDate(formatDateDot(filterEDate)) }),
                requestGetAllTimeDetail(),
                requestYard(),
                requestCustomer(),
            ]);
      
            const daysOfWeekNow = getCurrentWeekDates();
            setDaysOfWeek(daysOfWeekNow);
        } catch (error) {
            console.log(error)
        }
    };

    const onSelectCell = (idTime, date, idYard) => {
        setSelectedCells((prevSelectedCells) => {
            if(isSelected(idTime, date, idYard)) {
                return prevSelectedCells.filter(
                    (item) => item.date !== date || item.time !== idTime || item.yard !== idYard
                );
            }
            return [...prevSelectedCells, { date: date, time: idTime, yard: idYard }];
        });
    }    

    const onChangeSelect = (event) => {
        const isCustomer = event.target.value === 'customer' ? 1 : 0;
        setCalData({
            ...calData,
            idCustomer: isCustomer === 0 ? "" : calData.idCustomer,
            isCustomer: isCustomer,
        });
    };

    const onChangeSelectType = (event) => {
        const type = event.target.value === 'day' ? 0 : 1;
        setCalData({
            ...calData,
            type: type
        });
    };

    const onChangeSelectPayment = (event) => {                   
        let isPay = event.target.value;
        setCalData({...calData, isPay: isPay});
    };

    const onChangeCalData = debounce((key, value) => {
        onValidateTextField(key, value);
        setCalData({...calData, [key]: value});
    }, 300)

    const onValidateTextField = (key, value) => {
        switch (key) {
            case 'nameCustomer':
                if(!value) {                    
                    setCalErrorData({
                        key: key,
                        message: 'Tên không được để trống.'
                    });
                    setCalError(true);
                    return;
                }
                setCalErrorData({
                    key: '',
                    message: ''
                });
                setCalError(false);
                break;
            case 'phoneCustomer':
                if(!value) {
                    setCalErrorData({
                        key: key,
                        message: 'Số điện thoại không được để trống.'
                    });
                    setCalError(true);
                    return;
                }
                if(!phoneRegExp.test(value)) {
                    setCalErrorData({
                        key: key,
                        message: 'Số điện thoại không hợp lệ.'
                    });
                    setCalError(true);
                    return;
                }
                setCalErrorData({
                    key: '',
                    message: ''
                });
                setCalError(false);
                break;
            case 'bonus':
                if(!numberRegExp.test(formatNumberWithoutComma(value))) {
                    setCalErrorData({
                        key: key,
                        message: 'Giá thêm không đúng định dạng.'
                    });
                    setCalError(true);
                    return;
                }
                if(formatNumberWithoutComma(value) < 0) {
                    setCalErrorData({
                        key: key,
                        message: 'Giá thêm không được âm.'
                    });
                    setCalError(true);
                    return;
                }                
                setCalErrorData({
                    key: '',
                    message: ''
                });
                setCalError(false);
                break;
            case 'total':
                if(!numberRegExp.test(formatNumberWithoutComma(value))) {
                    setCalErrorData({
                        key: key,
                        message: 'Giá không đúng định dạng.'
                    });
                    setCalError(true);
                    return;
                }
                if(formatNumberWithoutComma(value) < 0) {
                    setCalErrorData({
                        key: key,
                        message: 'Giá không được âm.'
                    });
                    setCalError(true);
                    return;
                }                
                setCalErrorData({
                    key: '',
                    message: ''
                });
                setCalError(false);
                break;
        }
    }

    const onCloseModal = () => {
        setCalData({
            id: "",
            startDate: "",
            endDate: "",
            isCustomer: 1,
            idCustomer: "",
            nameCustomer: "",
            phoneCustomer: "",
            isPay: 0,
            bonus: 0,
            total: 0,
            cashier: "",
            note: "",
            type: 0,
            details: []
        });
        setCalErrorData({
            key: '',
            message: ''
        });
        setCalError(false);
        setToggleModal(false);
        setBlockUpdate(false);
        setEndDateCreate('');
    }

    const onOpenModal = (calData, timeDetail) => {
        if(calData && timeDetail) {
            const calDetails = calData.details.map(detail => {
                return {                
                    date: formatDateDot(detail.date),
                    time: detail.periodTime,
                    yard: detail.yard
                };
            });
            setTimeDetailUpdate(timeDetail);
            setCalData({
                id: calData.id,
                startDate: calData.startDate,
                endDate: calData.endDate,
                isCustomer: calData.isCustomer,
                idCustomer: calData.customerId,
                nameCustomer: calData.customerName,
                phoneCustomer: calData.customerPhone,
                isPay: calData.isPay,
                note: calData.note,
                type: calData.type,
                cashier: calData.cashier,
                bonus: calData.bonus,
                total: calData.total,
                details: calDetails
            });
            setEndDateCreate(calData.endDate);
            if(calData.isPay == "2") setBlockUpdate(true);
        }
        setToggleModal(true);
    }

    const onResetCalData = () => {
        setSelectedCells([]);
    }

    const onCreateCalendar = () => {        
        const calDetails = calData.details.map(detail => {
            const times = detail.time.map(timeId => {                                                                                        
                const time = timeSlots.filter(timeSlot => timeSlot.id === timeId);                                            
                return time[0];
            });                                                
            times.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            const timeIds = times.map(time => time.id);
            return {
                date: formatDate(detail.date),
                periodTime: timeIds,
                yard: detail.yard
            };
        });
        let params = {}
        if(calData.isPay == "2" && !calData.idCustomer) {
            params = {
                ...calData,
                endDate: endDateCreate ? formatDate(formatDateDot(endDateCreate)) : '',
                details: calDetails,                
                payDate: dayjs()
            };
        } else {
            params = {
                ...calData,
                endDate: endDateCreate ? formatDate(formatDateDot(endDateCreate)) : '',
                details: calDetails
            };
        }        
        requestCreate(params);
    }

    const onCloseAlert = () => {
        if(alertType === 'success') {            
            requestGetAll({startDate: formatDate(formatDateDot(filterSDate)), endDate: formatDate(formatDateDot(filterEDate))});
            const daysOfWeekNow = getCurrentWeekDates();
            setDaysOfWeek(daysOfWeekNow);
        }
        onCloseModal();
        setAlert(false);
        setAlertType('');
        setAlertMess('');
    }

    const onCloseFilterAlert = () => {
        setFilterAlert(false);
        setFilterAlertMess('');        
    }

    const onOpenConfirmAlert = (id) => {
        setConfirmAlert(true);
        setTimeBookedId(id);
    }

    const onCloseConfirmAlert = () => {
        setConfirmAlert(false);
        setTimeBookedId('');
    }

    const onChangeFilterSelect = (event) => {
        let isCustomer = 2;
        if(event.target.value === "customer") {
            isCustomer = 1
        }
        if(event.target.value === "passenger") {
            isCustomer = 0
        }
        setFilterOption({
            ...filterOption,
            isCustomer: isCustomer,
        });
    }

    const onChangeExportData = (key, selectedOption) => {
        const uniqueSelectedOption = Array.from(new Set(selectedOption.map(item => item.value))).map(value => selectedOption.find(item => item.value === value));        
        setExportOption({
            ...exportOption,
            [key]: uniqueSelectedOption
        })
    }

    const onChangeFilterTextField = debounce((value) => {
        setFilterOption({
            ...filterOption,
            name: value
        })
    }, 300)

    const onSubmitConfirmAlert = () => {
        setConfirmAlert(false);
        requestRemove({id: timeBookedId});
    }    

    const onFilterSubmit = (reset) => {
        if(reset) {
            // requestGetAll({startDate: formatDate(formatDateDot(dayjs())), endDate: formatDate(formatDateDot(dayjs().add(6, 'day')))});
            // const daysOfWeekNow = getCurrentWeekDates();
            // setDaysOfWeek(daysOfWeekNow);
            // setTimeBooked(timeBookedInitial);
            // setFilterOption({
            //     isCustomer: 2,
            //     name: ""
            // });
            // setOpenFilter(false);
            // setHasFilter(false);
            window.location.reload();            
            return;
        }
        
        const diffInDays = filterSDate.diff(filterEDate, 'day');
        if(!(diffInDays >= -30 && diffInDays <= 1)) {
            setFilterAlertMess('Khoảng thời gian từ 1 đến 31 ngày.');
            setFilterAlert(true);
            return;
        }
        
        if(filterSDate.diff(filterEDate, 'day') >= 1) {
            setFilterAlertMess('Thời gian kết thúc không nằm trước thời gian bắt đầu.');
            setFilterAlert(true);
            return;
        }

        setHasFilter(true);
        requestGetAll({startDate: formatDate(formatDateDot(filterSDate)), endDate: formatDate(formatDateDot(filterEDate))});
        const daysOfWeekNow = getCurrentWeekDates();
        setDaysOfWeek(daysOfWeekNow);
    }

    const onExportSubmit = () => {
        if(exportOption.startDate == '' || exportOption.endDate == '') {
            setFilterAlertMess('Thời gian bắt đầu và kết thúc không được bỏ trống.');
            setFilterAlert(true);
            return;
        }
        if(dayjs(exportOption.startDate).diff(dayjs(exportOption.endDate), 'day') >= 1) {
            setFilterAlertMess('Thời gian kết thúc không nằm trước thời gian bắt đầu.');
            setFilterAlert(true);
            return;
        }
        if(exportOption.cashier.length <= 0) {
            setFilterAlertMess('Vui lòng chọn nhân viên thu.');
            setFilterAlert(true);
            return;
        }
        const cashier = exportOption.cashier.map(item => item.value);
        const params = {
            ...exportOption,
            cashier: cashier
        }

        requestExport(params);
    }

    const getCurrentWeekDates = () => {
        const weekDates = [];
        for (let day = filterSDate; day.isBefore(filterEDate.add(1, 'day'), 'day'); day = day.add(1, 'day')) {
            const dayName = daysNameOfWeek[day.day()];
            const formattedDate = day.format('DD.MM.YYYY');
      
            weekDates.push({ name: dayName, date: formattedDate });
        }
      
        return weekDates;
    };

    const getLastName = (fullname) => {
        let names = fullname.split(" ");
        names = names.filter(item => item !== "");
        return names[names.length-1];
    }

    const formatDate = (date) => {
        const parts = date.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
            console.log("Lỗi định dạng.");
        }
    }

    const formatDateDot = (inputDate) => {
        const date = dayjs(inputDate);
        const day = date.format('DD');
        const month = date.format('MM');
        const year = date.format('YYYY');
        return `${day}.${month}.${year}`;
    }

    const formatNumberWithComma = (number = 0, option) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, option || ",");
    };

    const formatNumberWithoutComma = (number) => {
        number = number.replace(/[^0-9]/g, '')
        return number.split(",").join("");
    }

    const isSelected = (idTime, date, idYard) => {
        return selectedCells.some((item) => item.date === date && item.time === idTime && item.yard === idYard);
    };

    const isDue = (date) => {
        const curentDate = dayjs();
        if(curentDate.diff(dayjs(date), 'day') >= -1 && curentDate.diff(dayjs(date), 'day') <= 0) {
            return true;
        }
        return false;
    }

    const isLunchTime = (time) => {
        const [startTime, endTime] = time.split(' - ');
        const startDateTime = dayjs(startTime, 'HH:mm');
        const endDateTime = dayjs(endTime, 'HH:mm');
        
        const noonStartTime = dayjs('12:00', 'HH:mm');
        const noonEndTime = dayjs('13:00', 'HH:mm');
        
        const isNoonSlot = (startDateTime.isAfter(noonStartTime) || startDateTime.isSame(noonStartTime)) && (endDateTime.isBefore(noonEndTime) || endDateTime.isSame(noonEndTime));
        
        return isNoonSlot;
    }

    const convertCusData = () => customers.map((item, index) => ({ label: index+1 + ' - ' + item.name, value: item._id })) || [];

    const covertCalDetail = () => {
        return selectedCells.reduce((acc, item) => {
            const existingItem = acc.find((entry) => entry.date === item.date && entry.yard === item.yard);
            if (existingItem) {
                existingItem.time.push(item.time);
            } else {
                acc.push({ date: item.date, time: [item.time], yard: item.yard });
            }
            return acc;
        }, []);
    }

    const canSaveData = () => {
        if(calData.isCustomer) {
            if(calData.idCustomer) {
                return false;
            }
            else {
                return true;
            }
        }        

        if(calData.nameCustomer && calData.phoneCustomer) {
            if(calData.isPay == "0" || calData.isPay == "1") {
                return false;
            }            
            if(calData.isPay == "2" && calData.cashier) {
                return false;
            }            
        }
        return true;
    }    

    const handleReceiveSuccessData = () => {
        if(dataCreate) {
            setAlert(true);
            setAlertType('success');
            setAlertMess(dataCreate.message);
            setDataCreate(null);
            setSelectedCells([]);
            setCalData({
                startDate: "",
                endDate: "",
                isCustomer: 1,
                idCustomer: "",
                nameCustomer: "",
                phoneCustomer: "",
                isPay: 0,
                note: "",
                details: []
            });
            setFilterOption({
                isCustomer: 2,
                name: ""
            })
        }
        if(dataRemove) {
            setAlert(true);
            setAlertType('success');
            setAlertMess(dataRemove.message);
            setDataRemove(null);
            setTimeBookedId('');
            setCalData({
                startDate: "",
                endDate: "",
                isCustomer: 1,
                idCustomer: "",
                nameCustomer: "",
                phoneCustomer: "",
                isPay: 0,
                note: "",
                type: 0,
                details: []
            });
        }
    }

    const handleReceiveErrorData = () => {
        if(errorCreate) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messageCreate);
        }

        if(errorRemove) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messageRemove);
        }

        if(errorExport) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messageExport);
        }
    }

    const handleStartDateChange = (date) => {
        setFilterSDate(date);
    };

    const handleEndDateChange = (date) => {
        setFilterEDate(date);        
    };

    const handleExportDateChange = (type, date) => {
        if(type == "start") {
            setExportOption({
                ...exportOption,
                startDate: date
            })
        }
        if(type == "end") {
            setExportOption({
                ...exportOption,
                endDate: date
            })
        }
    };

    // const timeSlotComponents = useMemo(() => {
    //     return timeSlots.map((timeSlot, timeSlotIndex) => {
    //         return (
    //             <TableRow key={timeSlot.id + '_' + timeSlotIndex}>
    //                 <TableCell sx={[isLunchTime(timeSlot.name) ? {backgroundColor: '#E97451'} : {backgroundColor: '#4682B4'}, { borderRight: "1px solid #ccc", position: 'sticky', left: 0, zIndex: 1, color: 'white' }]}>
    //                     <Typography variant="caption" fontWeight={'bold'}>{timeSlot.name}</Typography>                                            
    //                 </TableCell>
    //                 {daysOfWeek.map((day, dayIndex) => (
    //                     yards.map((yard, yardIndex) => {
    //                         const time = timeBooked.filter(item => {                                                    
    //                             return (item.details.some(detail => formatDateDot(detail.date) === day.date && detail.yard === yard._id && detail.periodTime.includes(timeSlot.id)));
    //                         });
    //                         if(time.length > 0) {
    //                             const timeSlotsDetail = timeSlots.filter(timeSlot => {
    //                                 return (time[0].details.some(detail => detail.periodTime.includes(timeSlot.id)));
    //                             });

    //                             const tooltipDetail = time[0].details.map(detail => {                                                        
    //                                 const date = new Date(detail.date);
    //                                 const dayOfWeekIndex = date.getDay();
    //                                 const dateCell = daysNameOfWeek[dayOfWeekIndex] + ' - ' + formatDateDot(detail.date);
    //                                 const timeCell = timeSlotsDetail.filter(timeSlotDetail => detail.periodTime.includes(timeSlotDetail.id));
    //                                 const yardTemp = yards.filter(yard => yard._id === detail.yard);
    //                                 const yardCell = yardTemp[0]?.name;
    //                                 return {dateCell, timeCell, yardCell};
    //                             });

    //                             tooltipDetail.sort((a, b) => {
    //                                 const dateA = new Date(formatDate(a.dateCell.split(' - ')[1]));
    //                                 const dateB = new Date(formatDate(b.dateCell.split(' - ')[1]));
    //                                 return dateA - dateB;
    //                             });
                                
    //                             return (
    //                                 <HtmlTooltip                                                            
    //                                     title={
    //                                         <React.Fragment key={timeSlot.id + '_' + timeSlotIndex + '_' + day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex}>
    //                                             <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} borderBottom={'1px solid #ccc'} mb={1} pb={1}>
    //                                                 <Box>
    //                                                     <Typography color="inherit" fontWeight={'bold'}>Anh/Chị: {time[0].customerName}</Typography>
    //                                                     <Typography color="inherit">SĐT: {time[0].customerPhone}</Typography>
    //                                                 </Box>                                                                        
    //                                                 <Box ml={3}>
    //                                                     <Tooltip title="Chi tiết">
    //                                                         <IconButton size="small" onClick={() => onOpenModal(time[0], tooltipDetail)}>
    //                                                             <AspectRatioIcon />
    //                                                         </IconButton>
    //                                                     </Tooltip>
    //                                                     <Tooltip title="Hủy">
    //                                                         <IconButton size="small" onClick={() => onOpenConfirmAlert(time[0].id)}>
    //                                                             <DeleteIcon />
    //                                                         </IconButton>
    //                                                     </Tooltip>
    //                                                 </Box>
    //                                             </Box>                                                                    
    //                                             {time[0].isCustomer ? 
    //                                                 <>
    //                                                     <Typography variant="body1" fontWeight={"bold"}>Thời gian</Typography>
    //                                                     <Table>
    //                                                         <TableHead>
    //                                                             <TableRow>
    //                                                                 <TableCell>Ngày</TableCell>
    //                                                                 <TableCell>Thời gian</TableCell>
    //                                                                 <TableCell>Sân</TableCell>
    //                                                             </TableRow>
    //                                                         </TableHead>
    //                                                         <TableBody>                                                            
    //                                                             {tooltipDetail.map((timeSlotDetail, timeSlotDetailIndex) => (
    //                                                                 <TableRow key={timeSlot.id + '_' + timeSlotIndex + '_' + day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex + '_' + timeSlotDetail.id + '_' + timeSlotDetailIndex}>
    //                                                                     <TableCell>{timeSlotDetail.dateCell}</TableCell>
    //                                                                     <TableCell>
    //                                                                         {timeSlotDetail.timeCell.map((item, index) => (
    //                                                                             <React.Fragment key={timeSlot.id + '_' + timeSlotIndex + '_' + day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex + '_' + timeSlotDetail.id + '_' + timeSlotDetailIndex + '_' + item.id + '_' + index}>
    //                                                                                 {item.name}
    //                                                                                 {index < timeSlotDetail.timeCell.length - 1 && <br />}
    //                                                                             </React.Fragment>
    //                                                                         ))}
    //                                                                     </TableCell>
    //                                                                     <TableCell>{timeSlotDetail.yardCell}</TableCell>
    //                                                                 </TableRow>
    //                                                             ))}
    //                                                         </TableBody>
    //                                                     </Table>
    //                                                 </>
    //                                                 :
    //                                                 <Box>
    //                                                     <Typography color="inherit" fontWeight={'bold'}>{day.name + ' - ' + day.date}</Typography>
    //                                                     <Typography color="inherit">Thời gian: {timeSlot.name}</Typography>
    //                                                     <Typography color="inherit">Sân: {yard.name}</Typography>
    //                                                 </Box>
    //                                             }                                                                    
    //                                         </React.Fragment>
    //                                     }
    //                                     placement="right-start"
    //                                 >
    //                                     <TableCellCustom
    //                                         sx={[
    //                                             time[0].isPay === 0 && {backgroundColor: '#d5d5d5'} ||
    //                                             time[0].isPay === 1 && {backgroundColor: '#FFBF00'} ||
    //                                             time[0].isPay === 2 && {backgroundColor: '#00A36C'},
    //                                             (time[0].isPay === 0 && isDue(time[0].startDate)) && {backgroundColor: 'red'},
    //                                             {position: 'relative'},
    //                                             yard.length-1!==yardIndex ? { borderRight: "1px solid #ccc" } : {}                                                
    //                                         ]}
    //                                     >
    //                                         {time[0].isCustomer && 
    //                                             <Box sx={{position: 'absolute', top: 0, right: 0, mt: 0.1}}>
    //                                                 <WorkspacePremiumIcon sx={{color: 'yellow'}} />
    //                                             </Box>
    //                                             || 
    //                                             <></>
    //                                         }
    //                                         <Typography variant="caption" fontWeight={'bold'} color={'white'}>{getLastName(time[0].customerName)}</Typography>
    //                                     </TableCellCustom>
    //                                 </HtmlTooltip>
    //                             )
    //                         }
    //                         else {
    //                             return (
    //                                 <TableCellCustom
    //                                     key={timeSlot.id + '_' + timeSlotIndex + '_' + day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex}
    //                                     style={yard.length-1!==yardIndex ? { borderRight: "1px solid #ccc" } : {}}
    //                                     sx={[isLunchTime(timeSlot.name) ? {backgroundColor: '#E97451'} : {}, isSelected(timeSlot.id, day.date, yard._id) ? {backgroundColor: theme.palette.primary.main} : {}]}
    //                                     onClick={() => onSelectCell(timeSlot.id, day.date, yard._id)}
    //                                 />
    //                             )
    //                         }
    //                     })
    //                 ))}
    //             </TableRow>
    //         )
    //     })
    // }, [timeSlots, daysOfWeek, yards, timeBooked, selectedCells, onSelectCell])

    const timeSlotComponents = useMemo(() => {
        return timeSlots.map((timeSlot, timeSlotIndex) => (
            <TableRow key={timeSlot.id}>
                <TableCell
                    sx={[
                        isLunchTime(timeSlot.name) ? { backgroundColor: '#E97451' } : { backgroundColor: '#4682B4' },
                        { borderRight: "1px solid #ccc", position: 'sticky', left: 0, zIndex: 1, color: 'white' },
                        (identify.time == timeSlot.id) ? {backgroundColor: '#2AAA8A'} : {}
                    ]}
                >
                    <Typography variant="caption" fontWeight={'bold'}>
                        {timeSlot.name}
                    </Typography>
                </TableCell>
          
                {daysOfWeek.map((day, dayIndex) => (
                    yards.map((yard, yardIndex) => {
                        const time = timeBooked.filter(item =>
                            item.details.some(detail => formatDateDot(detail.date) === day.date && detail.yard === yard._id && detail.periodTime.includes(timeSlot.id))
                        );
            
                        if (time.length > 0) {
                            const timeSlotsDetail = timeSlots.filter(timeSlotDetail =>
                                time[0].details.some(detail => detail.periodTime.includes(timeSlotDetail.id))
                            );
                
                            const tooltipDetail = time[0].details.map(detail => ({
                                dateCell: daysNameOfWeek[new Date(detail.date).getDay()] + (time[0].isCustomer ? '' : ' - ' + formatDateDot(detail.date)),
                                timeCell: timeSlotsDetail.filter(timeSlotDetail => detail.periodTime.includes(timeSlotDetail.id)),
                                yardCell: yards.find(y => y._id === detail.yard)?.name
                            }));
                
                            tooltipDetail.sort((a, b) =>
                                new Date(time[0].isCustomer ? a.dateCell : formatDate(a.dateCell.split(' - ')[1])) - new Date(time[0].isCustomer ? b.dateCell : formatDate(b.dateCell.split(' - ')[1]))
                            );
                
                            return (
                                <HtmlTooltip
                                    open={false}
                                    title={
                                        <Box key={timeSlot.id + '_' + timeSlotIndex + '_' + day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex} sx={{overflowY: 'auto', height: '300px',}}>
                                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} borderBottom={'1px solid #ccc'} mb={1} pb={1}>
                                                <Box>
                                                    <Typography color="inherit" fontWeight={'bold'}>Anh/Chị: {time[0].customerName}</Typography>
                                                    <Typography color="inherit">SĐT: {time[0].customerPhone}</Typography>
                                                </Box>                                                                        
                                                <Box ml={3}>
                                                    <Tooltip title="Chi tiết">
                                                        <IconButton size="small" onClick={() => onOpenModal(time[0], tooltipDetail)}>
                                                            <AspectRatioIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Hủy">
                                                        <IconButton size="small" onClick={() => onOpenConfirmAlert(time[0].id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>                                                                    
                                            {time[0].isCustomer ? 
                                                <>
                                                    <Typography variant="body1" fontWeight={"bold"}>Thời gian</Typography>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Ngày</TableCell>
                                                                <TableCell>Thời gian</TableCell>
                                                                <TableCell>Sân</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>                                                            
                                                            {tooltipDetail.map((timeSlotDetail, timeSlotDetailIndex) => (
                                                                <TableRow key={timeSlot.id + '_' + timeSlotIndex + '_' + day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex + '_' + timeSlotDetail.id + '_' + timeSlotDetailIndex}>
                                                                    <TableCell>{timeSlotDetail.dateCell}</TableCell>
                                                                    <TableCell>
                                                                        {timeSlotDetail.timeCell.map((item, index) => (
                                                                            <React.Fragment key={timeSlot.id + '_' + timeSlotIndex + '_' + day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex + '_' + timeSlotDetail.id + '_' + timeSlotDetailIndex + '_' + item.id + '_' + index}>
                                                                                {item.name}
                                                                                {index < timeSlotDetail.timeCell.length - 1 && <br />}
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </TableCell>
                                                                    <TableCell>{timeSlotDetail.yardCell}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </>
                                                :
                                                <Box>
                                                    <Typography color="inherit" fontWeight={'bold'}>{day.name + ' - ' + day.date}</Typography>
                                                    <Typography color="inherit">Thời gian: {timeSlot.name}</Typography>
                                                    <Typography color="inherit">Sân: {yard.name}</Typography>
                                                </Box>
                                            }                                                                    
                                        </Box>
                                    }
                                    onClick={() => onOpenModal(time[0], tooltipDetail)}
                                >
                                    <TableCellCustom
                                        sx={[
                                            time[0].isPay === 0 && { backgroundColor: 'gray' },
                                            time[0].isPay === 1 && { backgroundColor: '#FFBF00' },
                                            time[0].isPay === 2 && { backgroundColor: '#00A36C' },
                                            (time[0].isPay === 0 && isDue(time[0].startDate)) && { backgroundColor: 'red' },
                                            { position: 'relative' },
                                            yard.length - 1 !== yardIndex ? { borderRight: "1px solid #ccc" } : {},                                            
                                        ]}                                        
                                    >
                                        {time[0].isCustomer && 
                                            <Box sx={{ position: 'absolute', top: 0, right: 0, mt: 0.1 }}>
                                                <WorkspacePremiumIcon sx={{ color: 'yellow' }} />
                                            </Box>
                                            ||
                                            <></>
                                        }
                                        <Typography variant="caption" fontWeight={'bold'} color={'white'}>
                                            {getLastName(time[0].customerName)}
                                        </Typography>
                                    </TableCellCustom>
                                </HtmlTooltip>
                            )
                        } else {
                            return (
                                <TableCellCustom
                                    key={timeSlot.id + '_' + day.date + '_' + yard._id}
                                    style={yard.length - 1 !== yardIndex ? { borderRight: "1px solid #ccc" } : {}}
                                    sx={[
                                        isLunchTime(timeSlot.name) ? { backgroundColor: '#E97451' } : {},
                                        isSelected(timeSlot.id, day.date, yard._id) ? { backgroundColor: theme.palette.primary.main } : {}
                                    ]}
                                    onClick={() => onSelectCell(timeSlot.id, day.date, yard._id)}
                                    onMouseEnter={() => setIdentify({
                                        date: day.date, 
                                        time: timeSlot.id,
                                        yard: yard._id
                                    })}
                                    onMouseLeave={() => setIdentify({
                                        date: '', 
                                        time: '',
                                        yard: ''
                                    })}
                                />
                            );
                        }
                    })
                ))}
            </TableRow>
          ))          
    }, [timeSlots, daysOfWeek, yards, timeBooked, selectedCells, identify])

    useEffect(() => {                
        fetchInitial();
    }, [])

    useEffect(() => {
        if(dataGetAllTimeDetail) {
            setTimeSlots(dataGetAllTimeDetail.data);
        }
    }, [dataGetAllTimeDetail])

    useEffect(() => {
        if(dataGetAll) {
            setTimeBooked(dataGetAll.data);
            setTimeBookedInitial(dataGetAll.data);            
        }
    }, [dataGetAll])

    useEffect(() => {
        if(dataYard) {
            setYards(dataYard.data);
        }
    }, [dataYard])    

    useEffect(() => {
        if(dataCustomer) {
            setCustomers(dataCustomer.data);
        }
    }, [dataCustomer])

    useEffect(() => {        
        if(selectedCells.length > 0) {
            const selectedCal = covertCalDetail();
            selectedCal.sort((a, b) => {
                const dateA = new Date(formatDate(a.date));
                const dateB = new Date(formatDate(b.date));
                return dateA - dateB;
            });
            const startDate = formatDate(selectedCal[0].date);
            setCalData({...calData, startDate: startDate, details: selectedCal});        
        }        
    }, [selectedCells, toggleModal])

    useEffect(() => {
        handleReceiveSuccessData();
    }, [dataCreate, dataRemove]);

    useEffect(() => {        
        handleReceiveErrorData();
    }, [errorCreate, errorRemove, errorExport]);    

    useEffect(() => {
        if(hasFilter) {
            let filteredTimeBooked = timeBookedInitial
            if(filterOption.isCustomer != 2) {            
                filteredTimeBooked = timeBookedInitial.filter(element => element.isCustomer === filterOption.isCustomer);
            }

            if (filterOption.name !== "") {
                const normalizedSearchTerm = deburr(filterOption.name.toLowerCase());
            
                filteredTimeBooked = filteredTimeBooked.filter(element => {
                    const normalizedItem = deburr(element.customerName.toLowerCase());
                    return normalizedItem.includes(normalizedSearchTerm);
                });
            }

            setTimeBooked(filteredTimeBooked);
            setHasFilter(false);
        }
    }, [timeBooked, timeBookedInitial])

    useEffect(() => {
        if(dataExport) {
            downloadFile(dataExport.data.fileName);
        }
    }, [dataExport])

    useEffect(() => {
        const formattedValue = formatNumberWithComma(calData.bonus);
        if (inputRefBonusPrice.current != null) {
            inputRefBonusPrice.current.value = formattedValue;
        }
    }, [calData.bonus]);

    useEffect(() => {
        const formattedValue = formatNumberWithComma(calData.total);
        if (inputRefYardPrice.current != null) {
            inputRefYardPrice.current.value = formattedValue;
        }
    }, [calData.total]);
    
    const downloadFile = async (fileName) => {
        try {
            const url = API_URL + '/downloads/' + fileName;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('File not found');
            }

            const blob = await response.blob();
            saveAs(blob, 'chi_tiet_lich_dat_san.xlsx');
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }
    
    return (
        <Layout
            children={
                <Box sx={{
                    '@media (max-width: 400px)': {
                        width: '95vw',
                    },
                }}>       
                    <Button 
                        variant="contained" 
                        startIcon={openFilter ? <FilterAltOffIcon /> : <FilterAltIcon />} 
                        onClick={() => {
                            if(!openFilter && openExport) setOpenExport(false);
                            setOpenFilter(!openFilter);
                            setFilterOption({isCustomer: 2, name: ""})
                        }}
                        sx={{mr: 1, mb: 1}}
                    >
                            Lọc
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={openExport ? <FileDownloadOffIcon /> : <FileDownloadIcon />} 
                        onClick={() => {
                            if(!openExport && openFilter) setOpenFilter(false);
                            setOpenExport(!openExport); 
                            setExportOption({
                                startDate: "",
                                endDate: "",
                                cashier: [],
                            })
                        }}
                        sx={{mr: 1, mb: 1}}
                    >
                        Xuất
                    </Button>
                    <Button onClick={() => onOpenModal()} variant="contained" startIcon={<AddIcon />} disabled={selectedCells.length > 0 ? false : true} sx={{mr: 1, mb: 1}}>Tạo lịch</Button>
                    <Button onClick={() => onResetCalData()} variant="contained" startIcon={<ReplayIcon />} disabled={selectedCells.length > 0 ? false : true} sx={{mr: 1, mb: 1}}>Bỏ chọn</Button>
                    {openFilter 
                        && 
                            <Box 
                                sx={{
                                    p: 2,
                                    mb: 1,
                                    backgroundColor: 'white',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    maxWidth: 500,
                                    fontSize: theme.typography.pxToRem(12),
                                    border: '1px solid #dadde9',
                                    borderRadius: 1
                                }}
                            >
                            <Box
                                display={'flex'}
                                sx={{
                                    '@media (max-width: 400px)': {
                                        flexDirection: 'column'
                                    },
                                }}
                            >
                                <DatePicker
                                    label="Ngày bắt đầu"
                                    value={filterSDate}
                                    format="DD/MM/YYYY"
                                    onChange={handleStartDateChange}
                                    renderInput={(props) => <TextField {...props} />}
                                    sx={{mr: 1, mb: 1}}
                                />
                                <DatePicker
                                    label="Ngày kết thúc"
                                    value={filterEDate}
                                    format="DD/MM/YYYY"
                                    onChange={handleEndDateChange}
                                    renderInput={(props) => <TextField {...props} />}
                                    sx={{mr: 1, mb: 1}}
                                />
                            </Box>                                
                            <RadioGroup
                                row
                                name="position"
                                value={filterOption.isCustomer === 0 && "passenger" || filterOption.isCustomer === 1 && "customer" || "all"}
                                onChange={onChangeFilterSelect}
                                defaultValue={filterOption.isCustomer === 2 && "all"}
                                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1}}                                
                            >
                                <FormControlLabel
                                    value="all"
                                    control={<Radio />}
                                    label="Tất cả"
                                    labelPlacement="top"                                            
                                />
                                <FormControlLabel
                                    value="customer"
                                    control={<Radio />}
                                    label="Khách cố định"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value="passenger"
                                    control={<Radio />}
                                    label="Khách vãng lai"
                                    labelPlacement="top"
                                />
                            </RadioGroup>
                            <TextField
                                label="Lọc theo tên khách hàng"
                                defaultValue={calData.nameCustomer}
                                onChange={(e) => onChangeFilterTextField(e.target.value)}
                                sx={{mr: 1, mb: 1}}
                                fullWidth
                            />
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <Button variant="outlined" onClick={() => onFilterSubmit(true)} sx={{mr: 1}}>Đặt lại</Button>
                                <Button variant="contained" onClick={() => onFilterSubmit(false)}>Lọc</Button>
                            </Box>
                            </Box>
                        || <></>
                    }
                    {openExport
                        && 
                            <Box 
                                sx={{
                                    p: 2,
                                    mb: 1,
                                    backgroundColor: 'white',
                                    color: 'rgba(0, 0, 0, 0.87)',
                                    maxWidth: 500,
                                    fontSize: theme.typography.pxToRem(12),
                                    border: '1px solid #dadde9',
                                    borderRadius: 1
                                }}
                            >
                                <Box
                                    display={'flex'}
                                    sx={{
                                        '@media (max-width: 400px)': {
                                            flexDirection: 'column'
                                        },
                                    }}
                                >
                                    <DatePicker
                                        label="Ngày bắt đầu"
                                        value={dayjs(exportOption.startDate ? exportOption.startDate : "")}
                                        format="DD/MM/YYYY"
                                        onChange={(date) => handleExportDateChange("start", formatDate(formatDateDot(date)))}
                                        renderInput={(props) => <TextField {...props} />}
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                    <DatePicker
                                        label="Ngày kết thúc"
                                        value={dayjs(exportOption.endDate ? exportOption.endDate : "")}
                                        format="DD/MM/YYYY"
                                        onChange={(date) => handleExportDateChange("end", formatDate(formatDateDot(date)))}
                                        renderInput={(props) => <TextField {...props} />}
                                        sx={{ mr: 1, mb: 1}}
                                    />
                                </Box>
                                <Autocomplete
                                    multiple
                                    options={cashier}
                                    getOptionLabel={(option) => option.label}
                                    value={exportOption.cashier}
                                    filterSelectedOptions
                                    onChange={(event, selectedOption) => onChangeExportData("cashier", selectedOption)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nhân viên thu"
                                        />
                                    )}
                                    sx={{ mr: 1, mb: 1 }}
                                />
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mr: 1}}>
                                    <Button variant="contained" onClick={() => onExportSubmit()}>Xuất</Button>
                                </Box>
                            </Box>
                        || <></>
                    }
                    <TableContainer 
                        component={Paper} 
                        style={{ height: '80vh', overflowX: 'auto' }} 
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: '0.4rem',
                                height: '0.4rem'
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#d5d5d5',
                                borderRadius: 4,
                                '&:hover': {
                                    background: '#A9A9A9',
                                },
                            },
                            '& .MuiTableCell-root': {
                                padding: '5px'
                            }
                        }}
                    >
                        <Table>
                            <TableHead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 2 }}>
                                <TableRow>
                                    <TableCell style={{ borderRight: "1px solid #ccc", backgroundColor: '#6082B6', color: 'white', minWidth: 90}}>
                                        <Typography variant="body2">Ngày</Typography>
                                    </TableCell>
                                    {daysOfWeek.map((day, dayIndex) => (
                                        <TableCell 
                                            key={day.date + '_' + dayIndex} 
                                            colSpan={yards.length} 
                                            sx={[
                                                ["Thứ 7", "Chủ Nhật"].includes(day.name) ? {backgroundColor: '#E97451'} : { backgroundColor: '#6082B6' }, 
                                                { borderRight: "1px solid #ccc", color: 'white', minWidth: 150},
                                                (identify.date == day.date) ? {backgroundColor: '#2AAA8A'} : {}
                                            ]}
                                        >
                                            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                                <Typography variant="body2">{day.name}</Typography>
                                                <Typography variant="body2" fontWeight={'bold'}>{day.date}</Typography>
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ borderRight: "1px solid #ccc", backgroundColor: '#6082B6', color: 'white', minWidth: 90}}>
                                        <Typography variant="caption" fontWeight={'bold'}>Sân</Typography>
                                    </TableCell>
                                    {daysOfWeek.map((day, dayIndex) => (
                                        yards.map((yard, yardIndex) => (
                                            <TableCell 
                                                key={day.date + '_' + dayIndex + '_' + yard._id + '_' + yardIndex} 
                                                sx={[
                                                    ["Thứ 7", "Chủ Nhật"].includes(day.name) ? {backgroundColor: '#E97451'} : { backgroundColor: '#6082B6' }, 
                                                    { borderRight: "1px solid #ccc", color: 'white', minWidth: 70},
                                                    (identify.date == day.date && identify.yard == yard._id) ? {backgroundColor: '#2AAA8A'} : {}
                                                ]}
                                            >
                                                <Typography variant="caption" fontWeight={'bold'}>{yard.name}</Typography>                                                
                                            </TableCell>
                                        ))
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeSlotComponents}
                            </TableBody>
                        </Table>
                    </TableContainer>                    
                    <Modal open={toggleModal} onClose={() => onCloseModal()}>
                        <Box sx={[
                            styles.modal,
                            {'@media (max-width: 400px)': {
                                width: '90%',
                            }}
                        ]}>
                            <RadioGroup
                                row
                                name="position"
                                value={calData.isCustomer ? "customer" : "passenger"}
                                onChange={onChangeSelect}
                                defaultValue={calData.isCustomer && "customer"}
                                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}                                
                            >
                                <FormControlLabel
                                    value="customer"
                                    control={<Radio />}
                                    label="Khách cố định"
                                    labelPlacement="top"
                                    disabled={calData.id && true || false}
                                />
                                <FormControlLabel
                                    value="passenger"
                                    control={<Radio />}
                                    label="Khách vãng lai"
                                    labelPlacement="top"
                                    disabled={calData.id && true || false}
                                />
                            </RadioGroup>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin cá nhân</Typography>                            
                            {calData.isCustomer ?                                 
                                <Box mb={2}>
                                    <RadioGroup
                                        row
                                        name="position"
                                        value={calData.type ? "month" : "day"}
                                        onChange={onChangeSelectType}
                                        defaultValue={calData.type ? "month" : "day"}
                                        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}                                
                                    >
                                        <FormControlLabel
                                            value="day"
                                            control={<Radio />}
                                            label="Theo ngày"
                                            labelPlacement="top"
                                            disabled={calData.id && true || false}
                                        />
                                        <FormControlLabel
                                            value="month"
                                            control={<Radio />}
                                            label="Theo tháng"
                                            labelPlacement="top"
                                            disabled={calData.id && true || false}
                                        />
                                    </RadioGroup>
                                    <Autocomplete
                                        disablePortal
                                        options={convertCusData() || []}
                                        value={calData && calData.idCustomer ? calData.idCustomer : ''}
                                        getOptionLabel={(option) => {
                                            const selectedCustomer = convertCusData().find((item) => item.value === option);
                                            return selectedCustomer ? selectedCustomer.label : option.label ? option.label : '';
                                        }}
                                        disabled={calData && calData.id ? true : false}
                                        onChange={(e, selectedOption) => onChangeCalData('idCustomer', selectedOption ? selectedOption.value : null)}
                                        renderInput={(params) => <TextField {...params} label="Khách hàng" />}
                                        fullWidth
                                    />
                                </Box>
                                :
                                <Box display={'flex'} flexDirection={'row'} mb={2}>
                                    <TextField
                                        label="Họ và Tên"
                                        defaultValue={calData.nameCustomer}
                                        onChange={(e) => onChangeCalData('nameCustomer', e.target.value)}
                                        error={calError && calErrorData.key === 'nameCustomer' && true}
                                        helperText={calError && calErrorData.key === 'nameCustomer' && calErrorData.message}
                                        sx={{mr: 1}}
                                        disabled={calData.id && true}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Số điện thoại"
                                        defaultValue={calData.phoneCustomer}
                                        onChange={(e) => onChangeCalData('phoneCustomer', e.target.value)}
                                        error={calError && calErrorData.key === 'phoneCustomer' && true}
                                        helperText={calError && calErrorData.key === 'phoneCustomer' && calErrorData.message}
                                        sx={{ml: 1}}
                                        disabled={calData.id && true}
                                        fullWidth
                                    />
                                </Box>
                            }
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin thời gian và sân</Typography>
                            <Box display={'flex'}>
                                <DatePicker
                                    label="Thời gian bắt đầu" 
                                    defaultValue={calData.startDate ? dayjs(calData.startDate) : dayjs()}
                                    disabled={true}
                                    sx={{mr: 1}}
                                />
                                {(calData.isCustomer === 1 && calData.type) &&
                                    <DatePicker
                                        label="Thời gian kết thúc"
                                        disabled={(calData.isPay === 0 || calData.isPay === 1) ? (calData.endDate === null || calData.endDate === "") ? false : true : true}
                                        defaultValue={calData.endDate ? dayjs(calData.endDate) : ""}
                                        onChange={(date) => setEndDateCreate(date)}
                                        minDate={calData.startDate ? dayjs(calData.startDate) : dayjs()}
                                        sx={{ml: 1}}
                                    />
                                    || 
                                    <></>
                                }
                            </Box>
                            <Box mb={2}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ngày</TableCell>
                                            <TableCell>Thời gian</TableCell>
                                            <TableCell>Sân</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {!calData.id 
                                            ?
                                            covertCalDetail().map((selectedCell, selectedCellIndex) => {                                        
                                                const date = new Date(formatDate(selectedCell.date));
                                                const dayOfWeekIndex = date.getDay();
                                                const dateCell = daysNameOfWeek[dayOfWeekIndex] + (calData.isCustomer ? '' : ' - ' + selectedCell.date);
                                                const times = selectedCell.time.map(timeId => {                                                                                        
                                                    const time = timeSlots.filter(timeSlot => timeSlot.id === timeId);                                            
                                                    return time[0];
                                                });                                                
                                                times.sort((a, b) =>
                                                    a.name.localeCompare(b.name)
                                                );
                                                let timeCell = [];
                                                times.map((time, index) => {
                                                    timeCell.push(
                                                        <React.Fragment key={selectedCell.date + '_' + time.id + '_' + index}>
                                                            {time.name}
                                                            {index < times.length - 1 && <br />}
                                                        </React.Fragment>
                                                    );
                                                });
                                                                                                                                    
                                                const yard = yards.filter(yard => yard._id === selectedCell.yard)[0];
                                                const yardCell = yard.name;

                                                return (
                                                    <TableRow key={selectedCell.date + '_' + selectedCellIndex}>
                                                        <TableCell>{dateCell}</TableCell>
                                                        <TableCell>{timeCell}</TableCell>
                                                        <TableCell>{yardCell}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            :
                                            timeDetailUpdate.map((timeDetail, timeDetailIndex) => {
                                                return (
                                                    <TableRow key={timeDetailIndex}>
                                                        <TableCell>{timeDetail.dateCell}</TableCell>
                                                        <TableCell>
                                                            {timeDetail.timeCell.map((cell, index) =>
                                                                <React.Fragment>
                                                                    {cell.name}
                                                                    {index < timeDetail.timeCell.length - 1 && <br />}
                                                                </React.Fragment>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{timeDetail.yardCell}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </Box>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Trạng thái thanh toán</Typography>
                            <RadioGroup
                                row
                                name="position"
                                value={calData.isPay}
                                onChange={onChangeSelectPayment}
                                defaultValue={calData.isPay}
                                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <FormControlLabel
                                    value={0}
                                    control={<Radio />}
                                    disabled={blockUpdate}
                                    label="Chưa thanh toán"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    disabled={blockUpdate}
                                    label="Đã cọc trước"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    disabled={blockUpdate}
                                    label="Đã thanh toán"
                                    labelPlacement="top"
                                />                                
                            </RadioGroup>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin khác</Typography>
                            <Box mb={2}>
                                {(!calData.isCustomer && calData.isPay == "2") &&
                                    <>
                                        <Autocomplete
                                            disablePortal
                                            options={cashier}
                                            value={calData.cashier}
                                            getOptionLabel={(option) => {
                                                const selectedCashier = cashier.find((item) => item.value === option);
                                                return selectedCashier ? selectedCashier.label : option.label ? option.label : '';
                                            }}
                                            onChange={(e, selectedOption) => onChangeCalData('cashier', selectedOption ? selectedOption.value : null)}
                                            disabled={blockUpdate}
                                            renderInput={(params) => <TextField {...params} label="Nhân viên thu" />}
                                            fullWidth
                                            sx={{mb: 2}}
                                        />
                                        <Box display={'flex'} mb={2}>
                                            <TextField
                                                label="Tổng tiền sân (VND)"
                                                defaultValue={formatNumberWithComma(calData.total)}
                                                onChange={(e) => onChangeCalData('total', formatNumberWithoutComma(e.target.value))}
                                                error={calError && calErrorData.key === 'total' && true}
                                                disabled={blockUpdate}
                                                helperText={calError && calErrorData.key === 'total' && calErrorData.message}
                                                fullWidth
                                                inputRef={inputRefYardPrice}
                                                sx={{mr: 1}}
                                            />
                                            <TextField
                                                label="Số tiền chơi thêm (VND)"
                                                defaultValue={formatNumberWithComma(calData.bonus)}
                                                onChange={(e) => onChangeCalData('bonus', formatNumberWithoutComma(e.target.value))}
                                                error={calError && calErrorData.key === 'bonus' && true}
                                                disabled={blockUpdate}
                                                helperText={calError && calErrorData.key === 'bonus' && calErrorData.message}
                                                fullWidth
                                                inputRef={inputRefBonusPrice}
                                                sx={{ml: 1}}
                                            />
                                        </Box>
                                        <TextField
                                            label="Tổng tiền"
                                            value={formatNumberWithComma(parseInt(calData.total)+parseInt(calData.bonus ? calData.bonus : 0))}
                                            disabled={true}
                                            fullWidth
                                            sx={{mb: 2}}
                                        />                                        
                                    </>
                                    || 
                                    <></>
                                }
                                <TextField
                                    label="Ghi chú"
                                    defaultValue={calData.note}
                                    onChange={(e) => onChangeCalData('note', e.target.value)}
                                    error={calError && calErrorData.key === 'note' && true}
                                    disabled={blockUpdate}
                                    helperText={calError && calErrorData.key === 'note' && calErrorData.message}                                    
                                    fullWidth
                                />
                            </Box>
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                {(calData.id && calData.isPay === 0) &&
                                    <Button 
                                        variant='contained' 
                                        color="error"
                                        disabled={!!loading || calError && true || canSaveData()}
                                        onClick={() => onOpenConfirmAlert(calData.id)}
                                        sx={{mr: 1}}
                                    >
                                        Xóa đơn
                                    </Button>
                                    || <></>
                                }
                                <Button 
                                    variant='contained' 
                                    disabled={!!loading || calError && true || canSaveData()}
                                    onSubmit={() => onCreateCalendar()}
                                    onClick={() => onCreateCalendar()}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Loading visible={loading} />
                    <AlertComponent visible={alert} message={alertMess} type={alertType} onClick={() => onCloseAlert()} />
                    <AlertComponent visible={filterAlert} message={filterAlertMess} type={'error'} onClick={() => onCloseFilterAlert()} />
                    <AlertComponent visible={confirmAlert} message={"Bạn có chắc chắn không?"} type={"success"} onClick={() => onSubmitConfirmAlert()} showCancel={true} onClickCancel={() => onCloseConfirmAlert()} />
                </Box>
            } 
        route={CALENDER_PATH} />
    );
}

const TableCellCustom = styled(TableCell)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#2AAA8A',
        cursor: 'pointer',
    },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'white',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 500,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
}));

const style = (theme) => ({
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',        
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: 1,        
        overflowY: 'auto',
        maxHeight: '80vh',
        p: 4,
    }
})

export default Calendar;