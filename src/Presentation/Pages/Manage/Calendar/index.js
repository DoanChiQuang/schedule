import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Autocomplete, Box, Button, FormControlLabel, IconButton, Modal, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, styled, tooltipClasses, useTheme } from "@mui/material";
import { CALENDER_PATH } from "../../../../Main/Route/path";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import useApi from "../../../Hooks/useApi";
import { getAll } from "../../../Api/bookingCalendar";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ReplayIcon from '@mui/icons-material/Replay';
import * as apiTime from "../../../Api/time";
import * as apiYard from "../../../Api/yard";
import * as apiCustomer from "../../../Api/customer";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { phoneRegExp } from "../../../Utils/regexValidation";

const Calendar = () => {

    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(getAll);    
    const { data: dataGetAllTimeDetail, loading: loadingGetAllTimeDetail, error: errorGetAllTimeDetail, message: messageGetAllTimeDetail, request: requestGetAllTimeDetail, setData: setDataGetAllTimeDetail } = useApi(apiTime.getAllTimeDetail);
    const { data: dataYard, loading: loadingYard, error: errorYard, message: messageYard, request: requestYard, setData: setDataYard } = useApi(apiYard.getAll);
    const { data: dataCustomer, loading: loadingCustomer, error: errorCustomer, message: messageCustomer, request: requestCustomer, setData: setDataCustomer } = useApi(apiCustomer.getAll);
    
    const daysNameOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const loading = loadingGetAll || loadingGetAllTimeDetail || loadingYard || loadingCustomer;
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
        isPay: 0,
        note: "",
        detail: []
    });
    const [calError, setCalError] = useState(false);
    const [calErrorData, setCalErrorData] = useState({
        key: '',
        message: ''
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
        setCalData({...calData, idCustomer: isCustomer === 0 ? "" : calData.idCustomer, isCustomer: isCustomer});
    };

    const onChangeSelectPayment = (event) => {                   
        let isPay = event.target.value;
        setCalData({...calData, isPay: isPay});
    };

    const onChangeCalData = (key, value) => {
        onValidateTextField(key, value);        
        setCalData({...calData, [key]: value});
    }

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
        }
    }

    const onCloseModal = () => {
        // if(submitType === 'update') setSubmitType('create');
        // setCalErrorData({
        //     key: '',
        //     message: ''
        // });
        // setCalError(false);
        setToggleModal(false);
    }

    const onOpenModal = () => {
        setToggleModal(true);
    }

    const onResetCalData = () => {
        setSelectedCells([]);
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

    const getLastName = (fullname) => {
        const names = fullname.split(" ");
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
        const date = new Date(inputDate);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
      
        return `${day}.${month}.${year}`;
    }
    
    const formatPriceWithDots = (inputPrice) => {
        let numberStr = inputPrice.toString();        
        numberStr = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");      
        return numberStr;
    }

    const formatPriceWithoutDots = (inputPrice) => {
        return inputPrice.replace(/\./g, "");
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
            return false;
        }
        return true;
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
    // console.log(timeBooked);

    return (
        <Layout 
            children={
                <Box>
                    {/* <Box mb={1}>
                        <Button variant="outlined" startIcon={<NavigateBeforeIcon />} color="info" size="small" sx={{mr: 1}}>                            
                            <Typography variant="button">Tuần trước</Typography>
                        </Button>
                        <Button variant="contained" color="info" size="small" sx={{mr: 1}}>
                            <Typography variant="button">Tuần này</Typography>
                        </Button>
                        <Button variant="outlined" endIcon={<NavigateNextIcon />} color="info" size="small" sx={{mr: 1}}>
                            <Typography variant="button">Tuần sau</Typography>                            
                        </Button>
                    </Box> */}
                    <TableContainer component={Paper} style={{ height: '84vh', overflowX: 'auto' }}>
                        <Table>
                            <TableHead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 2 }}>
                                <TableRow>
                                    <TableCell style={{ borderRight: "1px solid #ccc", backgroundColor: '#6082B6', color: 'white', minWidth: 150}}>
                                        <Typography variant="body2">Ngày</Typography>
                                    </TableCell>
                                    {daysOfWeek.map((day, dayIndex) => (
                                        <TableCell colSpan={4} style={{ borderRight: "1px solid #ccc", backgroundColor: '#6082B6', color: 'white', minWidth: 150}}>
                                            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                                <Typography variant="body2">{day.name}</Typography>
                                                <Typography variant="body2" fontWeight={'bold'}>{day.date}</Typography>
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ borderRight: "1px solid #ccc", backgroundColor: '#4682B4', color: 'white', minWidth: 150}}>
                                        <Typography variant="caption" fontWeight={'bold'}>Thời gian | Sân</Typography>
                                    </TableCell>
                                    {daysOfWeek.map((day, dayIndex) => (
                                        yards.map((yard, yardIndex) => (
                                            <TableCell style={{ borderRight: "1px solid #ccc", backgroundColor: '#4682B4', color: 'white', minWidth: 70}}>
                                                <Typography variant="caption" fontWeight={'bold'}>{yard.name}</Typography>                                                
                                            </TableCell>
                                        ))
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeSlots.map((timeSlot, timeSlotIndex) => (
                                    <TableRow>
                                        <TableCell style={{ borderRight: "1px solid #ccc", position: 'sticky', left: 0, zIndex: 1, backgroundColor: '#4682B4', color: 'white' }}>
                                            <Typography variant="caption" fontWeight={'bold'}>{timeSlot.name}</Typography>                                            
                                        </TableCell>
                                        {daysOfWeek.map((day, dayIndex) => (
                                            yards.map((yard, yardIndex) => {
                                                const time = timeBooked.filter(item => {                                                    
                                                    return (item.details.some(detail => formatDateDot(detail.date) === day.date && detail.yard === yard._id && detail.periodTime.includes(timeSlot.id)));
                                                });
                                                if(time.length > 0) {
                                                    const timeSlotsDetail = timeSlots.filter(timeSlot => {
                                                        return (time[0].details.some(detail => detail.periodTime.includes(timeSlot.id)));
                                                    });

                                                    const tooltipDetail = time[0].details.map(detail => {                                                        
                                                        const date = new Date(detail.date);
                                                        const dayOfWeekIndex = date.getDay();
                                                        const dateCell = daysNameOfWeek[dayOfWeekIndex] + ' - ' + formatDateDot(detail.date);
                                                        const timeCell = timeSlotsDetail.filter(timeSlotDetail => detail.periodTime.includes(timeSlotDetail.id));
                                                        const yardTemp = yards.filter(yard => yard._id === detail.yard);
                                                        const yardCell = yardTemp[0].name;
                                                        return {dateCell, timeCell, yardCell};
                                                    });

                                                    tooltipDetail.sort((a, b) => {
                                                        const dateA = new Date(formatDate(a.dateCell.split(' - ')[1]));
                                                        const dateB = new Date(formatDate(b.dateCell.split(' - ')[1]));
                                                        return dateA - dateB;
                                                    });
                                                    
                                                    return (
                                                        <HtmlTooltip
                                                            title={
                                                                <React.Fragment>
                                                                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} borderBottom={'1px solid #ccc'} mb={1} pb={1}>
                                                                        <Box>
                                                                            <Typography color="inherit" fontWeight={'bold'}>Anh/Chị: {time[0].customerName}</Typography>
                                                                            <Typography color="inherit">SĐT: {time[0].customerPhone}</Typography>
                                                                        </Box>                                                                        
                                                                        <Box ml={3}>
                                                                            <Tooltip title="Chi tiết">
                                                                                <IconButton size="small" onClick={() => console.log(123)}>
                                                                                    <AspectRatioIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Hủy">
                                                                                <IconButton size="small" onClick={() => console.log(123)}>
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
                                                                                        <TableRow>
                                                                                            <TableCell>{timeSlotDetail.dateCell}</TableCell>
                                                                                            <TableCell>
                                                                                                {timeSlotDetail.timeCell.map((item, index) => (
                                                                                                    <React.Fragment>
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
                                                                </React.Fragment>
                                                            }
                                                            placement="right-start"
                                                        >
                                                            <TableCellCustom                                                                
                                                                style={yard.length-1!==yardIndex ? { borderRight: "1px solid #ccc" } : {}}
                                                                sx={
                                                                    time[0].isPay === 0 && {backgroundColor: '#d5d5d5'} || 
                                                                    time[0].isPay === 1 && {backgroundColor: 'yellow'} ||
                                                                    time[0].isPay === 2 && {backgroundColor: '#00A36C'}                                                                
                                                                }
                                                            >
                                                                <Typography variant="caption" fontWeight={'bold'} color={'white'}>{getLastName(time[0].customerName)}</Typography>
                                                            </TableCellCustom>
                                                        </HtmlTooltip>
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <TableCellCustom
                                                            style={yard.length-1!==yardIndex ? { borderRight: "1px solid #ccc" } : {}}
                                                            sx={isSelected(timeSlot.id, day.date, yard._id) ? {backgroundColor: theme.palette.primary.main} : {}}
                                                            onClick={() => onSelectCell(timeSlot.id, day.date, yard._id)}
                                                        />
                                                    )
                                                }                                                
                                            })
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{position: 'fixed', bottom: theme.spacing(2), right: theme.spacing(2), zIndex: 1000}}>
                        <Button onClick={() => onOpenModal()} variant="contained" sx={{mr: 1}} startIcon={<AddIcon />} disabled={selectedCells.length > 0 ? false : true}>
                            Tạo lịch
                        </Button>
                        <Button onClick={() => onResetCalData()} variant="contained" sx={{ml: 1}} startIcon={<ReplayIcon />} disabled={selectedCells.length > 0 ? false : true}>
                            Đặt lại
                        </Button>
                    </Box>
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
                                        defaultValue={calData.nameCustomer}
                                        onChange={(e) => onChangeCalData('nameCustomer', e.target.value)}
                                        error={calError && calErrorData.key === 'nameCustomer' && true}
                                        helperText={calError && calErrorData.key === 'nameCustomer' && calErrorData.message}
                                        sx={{mr: 1}}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Số điện thoại"
                                        defaultValue={calData.phoneCustomer}
                                        onChange={(e) => onChangeCalData('phoneCustomer', e.target.value)}
                                        error={calError && calErrorData.key === 'phoneCustomer' && true}
                                        helperText={calError && calErrorData.key === 'phoneCustomer' && calErrorData.message}
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
                                                    <React.Fragment>
                                                        {time.name}
                                                        {index < times.length - 1 && <br />}
                                                    </React.Fragment>
                                                );
                                            });
                                                                                                                                
                                            const yard = yards.filter(yard => yard._id === selectedCell.yard)[0];
                                            const yardCell = yard.name;

                                            return (
                                                <TableRow>
                                                    <TableCell>{dateCell}</TableCell>
                                                    <TableCell>{timeCell}</TableCell>
                                                    <TableCell>{yardCell}</TableCell>
                                                </TableRow>
                                            )
                                        })}                                    
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
                                    label="Chưa thanh toán"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label="Đã cọc trước"
                                    labelPlacement="top"
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    label="Đã thanh toán"
                                    labelPlacement="top"
                                />                                
                            </RadioGroup>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin khác</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Ghi chú"                                    
                                    defaultValue={calData.note}
                                    onChange={(e) => onChangeCalData('note', e.target.value)}
                                    error={calError && calErrorData.key === 'note' && true}
                                    helperText={calError && calErrorData.key === 'note' && calErrorData.message}                                    
                                    fullWidth
                                />
                            </Box>                            
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Button 
                                    variant='contained' 
                                    disabled={!!loading || calError && true || canSaveData()}
                                    onSubmit={() => console.log(calData)}
                                    onClick={() => console.log(calData)}
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