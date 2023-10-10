import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../Layout/LayoutStaff";
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
const PRICE = 80000

const CalendarStaff = () => {

    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(apiCalendar.getAll);
    const { data: dataGetAllTimeDetail, loading: loadingGetAllTimeDetail, error: errorGetAllTimeDetail, message: messageGetAllTimeDetail, request: requestGetAllTimeDetail, setData: setDataGetAllTimeDetail } = useApi(apiTime.getAllTimeDetail);
    const { data: dataYard, loading: loadingYard, error: errorYard, message: messageYard, request: requestYard, setData: setDataYard } = useApi(apiYard.getAll);
    
    const daysNameOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const loading = loadingGetAll || loadingGetAllTimeDetail || loadingYard;
    const theme = useTheme();
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [timeBooked, setTimeBooked] = useState([]);
    const [timeBookedInitial, setTimeBookedInitial] = useState([]);
    const [yards, setYards] = useState([]);
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
        cashier: "1",
        note: "",
        details: []
    });
    const [filterAlert, setFilterAlert] = useState(false);
    const [filterAlertMess, setFilterAlertMess] = useState('');
    const [filterSDate, setFilterSDate] = useState(dayjs());
    const [filterEDate, setFilterEDate] = useState(dayjs().add(6, 'day'));
    const [openFilter, setOpenFilter] = useState(false);
    const [filterOption, setFilterOption] = useState({
        isCustomer: 2,
        name: ""
    });
    const [hasFilter, setHasFilter] = useState(false);

    const fetchInitial = async () => {
        try {
            const [getAllResponse, timeDetailResponse, yardResponse] = await Promise.all([
                requestGetAll({ startDate: formatDate(formatDateDot(filterSDate)), endDate: formatDate(formatDateDot(filterEDate)) }),
                requestGetAllTimeDetail(),
                requestYard()
            ]);
      
            const daysOfWeekNow = getCurrentWeekDates();
            setDaysOfWeek(daysOfWeekNow);
        } catch (error) {
            console.log(error)
        }
    };

    const onCloseFilterAlert = () => {
        setFilterAlert(false);
        setFilterAlertMess('');        
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

    const onChangeFilterTextField = debounce((value) => {
        setFilterOption({
            ...filterOption,
            name: value
        })
    }, 300)

    const onFilterSubmit = (reset) => {
        if(reset) {
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

    const handleStartDateChange = (date) => {
        setFilterSDate(date);
    };

    const handleEndDateChange = (date) => {
        setFilterEDate(date);        
    };    

    const timeSlotComponents = useMemo(() => {
        return timeSlots.map((timeSlot) => (
            <TableRow key={timeSlot.id}>
                <TableCell
                    sx={[
                        isLunchTime(timeSlot.name) ? { backgroundColor: '#E97451' } : { backgroundColor: '#4682B4' },
                        { borderRight: "1px solid #ccc", position: 'sticky', left: 0, zIndex: 1, color: 'white' }
                    ]}
                >
                    <Typography variant="caption" fontWeight={'bold'}>
                        {timeSlot.name}
                    </Typography>
                </TableCell>
          
                {daysOfWeek.map((day) => (
                    yards.map((yard, yardIndex) => {
                        const time = timeBooked.filter(item =>
                            item.details.some(detail => formatDateDot(detail.date) === day.date && detail.yard === yard._id && detail.periodTime.includes(timeSlot.id))
                        );
            
                        if (time.length > 0) {
                            return (                                
                                <TableCell
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
                                </TableCell>
                            )
                        } else {
                            return (
                                <TableCell
                                    key={timeSlot.id + '_' + day.date + '_' + yard._id}
                                    style={yard.length - 1 !== yardIndex ? { borderRight: "1px solid #ccc" } : {}}
                                    sx={[isLunchTime(timeSlot.name) ? { backgroundColor: '#E97451' } : {}]}
                                />
                            );
                        }
                    })
                ))}
            </TableRow>
          ))          
    }, [timeSlots, daysOfWeek, yards, timeBooked])

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
                            setOpenFilter(!openFilter);
                            setFilterOption({isCustomer: 2, name: ""})
                        }}
                        sx={{mr: 1, mb: 1}}
                    >
                            Lọc
                    </Button>
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
                                defaultValue={filterOption.name}
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
                    <TableContainer 
                        component={Paper} 
                        style={{ height: '80vh', overflowX: 'auto' }} 
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: '0.5rem',
                                height: '0.5rem'
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#899499',
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
                                                { borderRight: "1px solid #ccc", color: 'white', minWidth: 150}
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
                                                    { borderRight: "1px solid #ccc", color: 'white', minWidth: 70}
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
                    <Loading visible={loading} />
                    <AlertComponent visible={filterAlert} message={filterAlertMess} type={'error'} onClick={() => onCloseFilterAlert()} />
                </Box>
            } 
        route={CALENDER_PATH} />
    );
}

export default CalendarStaff;