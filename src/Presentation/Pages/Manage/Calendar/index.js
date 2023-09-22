import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled } from "@mui/material";
import { CALENDER_PATH } from "../../../../Main/Route/path";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import useApi from "../../../Hooks/useApi";
import { getAll } from "../../../Api/bookingCalendar";
import * as apiTime from "../../../Api/time";
import * as apiYard from "../../../Api/yard";
import dayjs from "dayjs";

const Calendar = () => {

    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(getAll);    
    const { data: dataGetAllTimeDetail, loading: loadingGetAllTimeDetail, error: errorGetAllTimeDetail, message: messageGetAllTimeDetail, request: requestGetAllTimeDetail, setData: setDataGetAllTimeDetail } = useApi(apiTime.getAllTimeDetail);
    const { data: dataYard, loading: loadingYard, error: errorYard, message: messageYard, request: requestYard, setData: setDataYard } = useApi(apiYard.getAll);
    
    const [selectedCells, setSelectedCells] = useState([]);
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [timeBooked, setTimeBooked] = useState([]);
    const [yards, setYards] = useState([]);

    const fetchInitial = () => {        
        const currentDate = dayjs("2023-09-22");
        const { nextMonday, nextSunday } = getNextMondayAndSunday(currentDate);
        const startDate = nextMonday.format("YYYY-MM-DD");
        const endDate = nextSunday.format("YYYY-MM-DD");
        requestGetAll({startDate: startDate, endDate: endDate});
        requestGetAllTimeDetail();
        requestYard();
        const daysOfWeekNow = getCurrentWeekDates();
        setDaysOfWeek(daysOfWeekNow);
    }

    const onSelectCell = (idTime, date, idYard) => {
        console.log(idTime, date, idYard)
        setSelectedCells([...selectedCells, {[date]: {date: date, time: [idTime], yard: idYard}}]);
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

    console.log(selectedCells);
    
    
    // console.log(timeSlots);
    // console.log(yards);
    console.log(timeBooked);

    return (
        <Layout 
            children={
                <Box>
                    <Box mb={1}>
                        <Button variant="outlined" color="info" size="small" sx={{mr: 1}}>
                            <NavigateBeforeIcon />
                            <Typography variant="button">Tuần trước</Typography>
                        </Button>
                        <Button variant="contained" color="info" size="small" sx={{mr: 1}}>

                            <Typography variant="button">Tuần này</Typography>
                        </Button>
                        <Button variant="outlined" color="info" size="small" sx={{mr: 1}}>
                            <Typography variant="button">Tuần sau</Typography>
                            <NavigateNextIcon />
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
                </Box>
            } 
        route={CALENDER_PATH} />
    );
}

const TableCellCustom = styled(TableCell)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
      cursor: 'pointer',
    },
  }));

export default Calendar;