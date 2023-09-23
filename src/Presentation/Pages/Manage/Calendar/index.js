import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Autocomplete, Box, Button, FormControlLabel, IconButton, Modal, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, styled, useTheme } from "@mui/material";
import { CALENDER_PATH } from "../../../../Main/Route/path";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import useApi from "../../../Hooks/useApi";
import { getAll } from "../../../Api/bookingCalendar";
import AddIcon from '@mui/icons-material/Add';
import * as apiTime from "../../../Api/time";
import * as apiYard from "../../../Api/yard";
import * as apiCustomer from "../../../Api/customer";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

const Calendar = () => {

    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(getAll);    
    const { data: dataGetAllTimeDetail, loading: loadingGetAllTimeDetail, error: errorGetAllTimeDetail, message: messageGetAllTimeDetail, request: requestGetAllTimeDetail, setData: setDataGetAllTimeDetail } = useApi(apiTime.getAllTimeDetail);
    const { data: dataYard, loading: loadingYard, error: errorYard, message: messageYard, request: requestYard, setData: setDataYard } = useApi(apiYard.getAll);
    const { data: dataCustomer, loading: loadingCustomer, error: errorCustomer, message: messageCustomer, request: requestCustomer, setData: setDataCustomer } = useApi(apiCustomer.getAll);
    
    const daysNameOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const theme = useTheme();
    const styles = style(theme);
    const [selectedCells, setSelectedCells] = useState([]);
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [timeBooked, setTimeBooked] = useState([]);
    const [yards, setYards] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [calData, setCalData] = useState({
        startDate: "",
        endDate: "",
        isCustomer: 1,
        idCustomer: "",
        nameCustomer: "",
        phoneCustomer: "",
        isPay: "",
        detail: []
    });

    const fetchInitial = () => {        
        const currentDate = dayjs("2023-09-22");
        const { nextMonday, nextSunday } = getNextMondayAndSunday(currentDate);
        const startDate = nextMonday.format("YYYY-MM-DD");
        const endDate = nextSunday.format("YYYY-MM-DD");
        requestGetAll({startDate: startDate, endDate: endDate});
        requestGetAllTimeDetail();
        requestYard();
        requestCustomer();
        const daysOfWeekNow = getCurrentWeekDates();
        setDaysOfWeek(daysOfWeekNow);
    }

    const onSelectCell = (idTime, date, idYard) => {
        if(isSelected(idTime, date, idYard)) {
            const selectedCellsData =  selectedCells.filter((item) => (item.date !== date || item.time !== idTime || item.yard !== idYard));
            setSelectedCells(selectedCellsData);
            return;
        };
        setSelectedCells([...selectedCells, {date: date, time: idTime, yard: idYard}]);
    }

    const onChangeSelect = (event) => {                   
        let isCustomer = 0;     
        if (event.target.value === 'customer') {
            isCustomer = 1;
        } else if (event.target.value === 'passenger') {          
            isCustomer = 0;
        }
        setCalData({...calData, isCustomer: isCustomer});
    };

    const onChangeCalData = (key, value) => {
        onValidateTextField(key, value);        
        setCalData({...calData, [key]: value});
    }

    const onValidateTextField = (key, value) => {
        // switch (key) {
        //     case 'name':
        //         if(!value) {                    
        //             setCusErrorData({
        //                 key: key,
        //                 message: 'Tên không được để trống.'
        //             });
        //             setCusError(true);
        //             return;
        //         }
        //         setCusErrorData({
        //             key: '',
        //             message: ''
        //         });
        //         setCusError(false);
        //         break;
        //     case 'phonenum':
        //         if(!value) {
        //             setCusErrorData({
        //                 key: key,
        //                 message: 'Số điện thoại không được để trống.'
        //             });
        //             setCusError(true);
        //             return;
        //         }
        //         if(!phoneRegExp.test(value)) {
        //             setCusErrorData({
        //                 key: key,
        //                 message: 'Số điện thoại không hợp lệ.'
        //             });
        //             setCusError(true);
        //             return;
        //         }
        //         setCusErrorData({
        //             key: '',
        //             message: ''
        //         });
        //         setCusError(false);
        //         break;
        //     case 'discount':                
        //         if(value < 0) {                    
        //             setCusErrorData({
        //                 key: key,
        //                 message: 'Chiết khấu tối thiểu 0%'
        //             });
        //             setCusError(true);
        //             return;
        //         }
        //         if(value > 100) {                    
        //             setCusErrorData({
        //                 key: key,
        //                 message: 'Chiết khấu tối đa 100%'
        //             });
        //             setCusError(true);
        //             return;
        //         }
        //         setCusErrorData({
        //             key: '',
        //             message: ''
        //         });
        //         setCusError(false);                
        //         break;
        // }
    }

    const onCloseModal = () => {
        // if(submitType === 'update') setSubmitType('create');
        // setCusErrorData({
        //     key: '',
        //     message: ''
        // });
        // setCusError(false);
        setToggleModal(false);
    }

    const onOpenModal = () => {
        setToggleModal(true);
    }

    const getNextMondayAndSunday = (date) => {
        const currentDate = date;
        const daysUntilMonday = 1 - currentDate.day();
        const daysUntilSunday = 7 - currentDate.day();

        const nextMonday = currentDate.add(daysUntilMonday, "day");
        const nextSunday = currentDate.add(daysUntilSunday, "day");

        return {
            nextMonday,
            nextSunday,
        };
    }

    const getCurrentWeekDates = () => {
        const currentDate = dayjs();
          
        const daysToSubtract = (currentDate.day() + 7 - 1) % 7;
        const startOfWeek = currentDate.subtract(daysToSubtract, "day");
        
        const weekDates = [];

        for (let i = 0; i <= 6; i++) {
            const day = startOfWeek.add(i, "day");
            const dayName = day.format("dddd");
            const formattedDate = day.format("DD.MM.YYYY");

            weekDates.push({ name: `Thứ ${i + 2}`, date: formattedDate });
        }
        
        const lastDay = weekDates[6];
        lastDay.name = "Chủ nhật";

        return weekDates;
    }

    const formatDate = (date) => {
        const parts = date.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
            console.log("Lỗi định dạng.");
        }
    }

    const isSelected = (idTime, date, idYard) => {
        let flag = false;
        selectedCells.map((item, index) => {
            if(item.date === date && item.time === idTime && item.yard === idYard) {
                flag = true;
            }
        });

        return flag;
    }

    const convertCusData = () => {
        const cusDataNew = customers.map(item => (
            { label: item.name, value: item._id}
        ));
        return cusDataNew.length > 0 ? cusDataNew : [];
    }

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
            const endDate = formatDate(selectedCal[selectedCal.length-1].date);
            setCalData({...calData, startDate: startDate, endDate: endDate, detail: selectedCal});
        }
    }, [selectedCells])
        
    // console.log(calData);
    // console.log(timeSlots);
    // console.log(yards);
    console.log(timeBooked);

    return (
        <Layout 
            children={
                <Box>
                    <Box mb={1}>
                        <Button variant="outlined" startIcon={<NavigateBeforeIcon />} color="info" size="small" sx={{mr: 1}}>                            
                            <Typography variant="button">Tuần trước</Typography>
                        </Button>
                        <Button variant="contained" color="info" size="small" sx={{mr: 1}}>
                            <Typography variant="button">Tuần này</Typography>
                        </Button>
                        <Button variant="outlined" endIcon={<NavigateNextIcon />} color="info" size="small" sx={{mr: 1}}>
                            <Typography variant="button">Tuần sau</Typography>                            
                        </Button>
                    </Box>
                    <TableContainer component={Paper} style={{ border: "1px solid #ccc" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ borderRight: "1px solid #ccc", minWidth: 150}}>Ngày</TableCell>
                                    {daysOfWeek.map((day, index) => (
                                        <TableCell colSpan={4} key={index} style={daysOfWeek.length-1!==index ? { borderRight: "1px solid #ccc" } : {}}>
                                            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                                <Typography variant="body1">{day.name}</Typography>
                                                <Typography variant="body2" fontWeight={'bold'}>{day.date}</Typography>
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ borderRight: "1px solid #ccc" }}>Thời gian | Sân</TableCell>
                                    {daysOfWeek.map((day, index) => (
                                        yards.map((yard, yardIndex) => (
                                            <TableCell key={index+'_'+yardIndex} style={yard.length-1!==yardIndex ? { borderRight: "1px solid #ccc" } : {}}>{yard.name}</TableCell>
                                        ))
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeSlots.map((timeSlot, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ borderRight: "1px solid #ccc" }}>{timeSlot.name}</TableCell>
                                        {daysOfWeek.map((day, dayIndex) => (
                                            yards.map((yard, yardIndex) => (
                                                <TableCellCustom
                                                    key={index+'_'+dayIndex+'_'+yardIndex}
                                                    style={yard.length-1!==yardIndex ? { borderRight: "1px solid #ccc" } : {}}
                                                    sx={isSelected(timeSlot.id, day.date, yard._id) ? {backgroundColor: theme.palette.primary.main} : {}}
                                                    onClick={() => onSelectCell(timeSlot.id, day.date, yard._id)}
                                                >
                                                </TableCellCustom>
                                            ))
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={() => onOpenModal()} variant="contained" startIcon={<AddIcon />} sx={{position: 'fixed', bottom: theme.spacing(2), right: theme.spacing(2), zIndex: 1000}} disabled={selectedCells.length > 0 ? false : true}>
                        Tạo lịch
                    </Button>
                    <Modal open={toggleModal} onClose={() => onCloseModal()}>
                        <Box sx={styles.modal}>
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
                                />
                                <FormControlLabel
                                    value="passenger"
                                    control={<Radio />}
                                    label="Khách vãng lai"
                                    labelPlacement="top"
                                />
                            </RadioGroup>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin cá nhân</Typography>                            
                            {calData.isCustomer ? 
                                <Box mb={2}>
                                    <Autocomplete
                                        disablePortal
                                        options={convertCusData()}
                                        onChange={(e, selectedOption) => onChangeCalData('idCustomer', selectedOption.value)}
                                        renderInput={(params) => <TextField {...params} label="Khách hàng" />}
                                        fullWidth
                                    />
                                </Box>
                                :
                                <Box display={'flex'} flexDirection={'row'} mb={2}>
                                    <TextField
                                        label="Họ và Tên"
                                        // defaultValue={cusData.name}
                                        onChange={(e) => console.log('name', e.target.value)}
                                        // error={cusError && cusErrorData.key === 'name' && true}
                                        // helperText={cusError && cusErrorData.key === 'name' && cusErrorData.message}
                                        sx={{mr: 1}}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Số điện thoại"
                                        // defaultValue={cusData.phonenum}
                                        onChange={(e) => console.log('phonenum', e.target.value)}
                                        // error={cusError && cusErrorData.key === 'phonenum' && true}
                                        // helperText={cusError && cusErrorData.key === 'phonenum' && cusErrorData.message}
                                        sx={{ml: 1}}
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
                                <DatePicker
                                    label="Thời gian kết thúc" 
                                    defaultValue={calData.endDate ? dayjs(calData.endDate) : dayjs()}
                                    sx={{ml: 1}} 
                                />
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
                                        {covertCalDetail().map(selectedCell => {                                        
                                            const date = new Date(formatDate(selectedCell.date));
                                            const dayOfWeekIndex = date.getDay();
                                            const dateCell = daysNameOfWeek[dayOfWeekIndex] + ' - ' + selectedCell.date;
                                            const times = selectedCell.time.map(timeId => {                                                                                        
                                                const time = timeSlots.filter(timeSlot => timeSlot.id === timeId);                                            
                                                return time[0];
                                            });
                                            let timeCell = [];
                                            times.map((time, index) => {
                                                timeCell.push(
                                                    <React.Fragment key={index}>
                                                        {time.name}
                                                        {index < times.length - 1 && <br />}
                                                    </React.Fragment>
                                                );
                                            });
                                                                                                                                
                                            const yard = yards.filter(yard => yard._id === selectedCell.yard)[0];
                                            const yardCell = yard.name;

                                            return (
                                                <TableRow key={selectedCell.date+"_"+selectedCell.time+"_"+selectedCell.yard}>
                                                    <TableCell>{dateCell}</TableCell>
                                                    <TableCell>{timeCell}</TableCell>
                                                    <TableCell>{yardCell}</TableCell>
                                                </TableRow>
                                            )
                                        })}                                    
                                    </TableBody>
                                </Table>
                            </Box>
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Button 
                                    variant='contained' 
                                    disabled
                                    onSubmit={() => console.log()}
                                    onClick={() => console.log()}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            } 
        route={CALENDER_PATH} />
    );
}

const TableCellCustom = styled(TableCell)(({ theme }) => ({
    '&:hover': {
        opacity: 0.6,
        cursor: 'pointer',
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
        p: 4,
    }
})

export default Calendar;