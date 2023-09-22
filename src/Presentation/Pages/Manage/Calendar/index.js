import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { CALENDER_PATH } from "../../../../Main/Route/path";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import useApi from "../../../Hooks/useApi";
import { getAll } from "../../../Api/bookingCalendar";

const Calendar = () => {    

    const daysOfWeek = [
        {name: 'Thứ 2', date: '18.09.2023'},
        {name: 'Thứ 3', date: '19.09.2023'},
        {name: 'Thứ 4', date: '20.09.2023'},
        {name: 'Thứ 5', date: '21.09.2023'},
        {name: 'Thứ 6', date: '22.09.2023'},
        {name: 'Thứ 7', date: '23.09.2023'},
        {name: 'Chủ nhật', date: '24.09.2023'},
    ];         

    const timeSlots = [
        '5:00 - 5:30',
        '5:30 - 6:00',
        '5:00 - 5:30',
        '5:30 - 6:00',
        '5:00 - 5:30',
        '5:30 - 6:00',
        '5:00 - 5:30',
        '5:30 - 6:00',
        '5:00 - 5:30',
        '5:30 - 6:00',
    ];
    
    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(getAll);

    const [selectedCells, setSelectedCells] = useState([]);

    const onSelectCell = (idDate, idTime, idYard) => {
        setSelectedCells([...selectedCells, {idDate: idDate, idTime: idTime, idYard: 1}]);        
    }

    useEffect(() => {
        requestGetAll();
    }, [])

    useEffect(() => {
        console.log(dataGetAll)
    }, [dataGetAll])

    console.log(messageGetAll)

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
                                    <TableCell style={{ borderRight: "1px solid #ccc" }}></TableCell>
                                    {daysOfWeek.map((day, index) => (
                                        <TableCell key={index} style={daysOfWeek.length-1!==index ? { borderRight: "1px solid #ccc" } : {}}>
                                            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                                                <Typography variant="body1">{day.name}</Typography>
                                                <Typography variant="body2" fontWeight={'bold'}>{day.date}</Typography>
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeSlots.map((timeSlot, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ borderRight: "1px solid #ccc" }}>{timeSlot}</TableCell>
                                        {daysOfWeek.map((day, dayIndex) => (
                                            <TableCell 
                                                style={daysOfWeek.length-1!==dayIndex ? { borderRight: "1px solid #ccc" } : {}} key={dayIndex}
                                                onClick={() => onSelectCell(day.date, timeSlot)}
                                            >
                                                {timeSlot + ' ' + index + ' ' + dayIndex}
                                            </TableCell>
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

const useStyle = (theme) => {    
}

export default Calendar;