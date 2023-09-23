import { Box, Button, Chip, Modal, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { DataGrid } from '@mui/x-data-grid';
import { TIME_PATH } from "../../../../Main/Route/path";
import AddIcon from '@mui/icons-material/Add';
import useApi from "../../../Hooks/useApi";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "@emotion/react";
import IconButton from '@mui/material/IconButton';
import { Loading, AlertComponent } from "../../../Components/UI";
import { numberRegExp } from "../../../Utils/regexValidation";
import * as apiTime from "../../../Api/time";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const Time = () => {
    
    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(apiTime.getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate, setData: setDataCreate } = useApi(apiTime.create);
    const { data: dataUpdate, loading: loadingUpdate, error: errorUpdate, message: messageUpdate, request: requestUpdate, setData: setDataUpdate } = useApi(apiTime.update);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove, setData: setDataRemove } = useApi(apiTime.remove);

    const theme = useTheme();
    const styles = style(theme);
    const [rows, setRows] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [cusData, setCusData] = useState({
        name: '',
        startTime: dayjs(),
        endTime: dayjs(),
        period: ''
    });
    const [cusError, setCusError] = useState(false);
    const [cusErrorData, setCusErrorData] = useState({
        key: '',
        message: ''
    });
    const [submitType, setSubmitType] = useState('create');
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMess, setAlertMess] = useState('');
    const loading = loadingGetAll || loadingCreate || loadingUpdate || loadingRemove;


    const columns = [
        { field: 'name', headerName: 'Tên', width: 180 },
        { field: 'startTime', headerName: 'Thời gian bắt đầu', width: 160 },
        { field: 'endTime', headerName: 'Thời gian kết thúc', width: 160},
        { field: 'period', headerName: 'Khoảng thời gian', width: 160},
        { 
            field: 'status', 
            headerName: 'Trạng thái', 
            width: 120,
            renderCell: (params) => (
                <Box>
                    {params.value &&
                        <Chip
                            label={'Mặc định'}
                            color={'success'}
                            size="small"
                        />
                    }
                </Box>
            )
        },
        { 
            field: 'action', 
            headerName: '#', 
            width: 160,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Sửa">
                        <IconButton size="small" onClick={() => onClickUpdate(params.value)}>
                            <EditIcon size={24} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton size="small" onClick={() => onClickRemove({id: params.value._id})}>
                            <DeleteIcon size={24} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];    

    // Event
    const onChangeTextField = (key, value) => {
        onValidateTextField(key, value);        
        setCusData({...cusData, [key]: value});
    }    

    const onValidateTextField = (key, value) => {
        switch (key) {
            case 'name':
                if(!value) {                    
                    setCusErrorData({
                        key: key,
                        message: 'Tên không được để trống.'
                    });
                    setCusError(true);
                    return;
                }
                setCusErrorData({
                    key: '',
                    message: ''
                });
                setCusError(false);
                break;
                if(!value) {                    
                    setCusErrorData({
                        key: key,
                        message: 'Thời gian kết thúc không được để trống.'
                    });
                    setCusError(true);
                    return;
                }                
                setCusErrorData({
                    key: '',
                    message: ''
                });
                setCusError(false);                
                break;
            case 'period':                
                if(!value) {                    
                    setCusErrorData({
                        key: key,
                        message: 'Khoảng thời gian không được để trống.'
                    });
                    setCusError(true);
                    return;
                }
                if(!numberRegExp.test(value)) {
                    setCusErrorData({
                        key: key,
                        message: 'Khoảng thời gian không hợp lệ.'
                    });                    
                    setCusError(true);
                    return;
                }
                if(value < 0) {
                    setCusErrorData({
                        key: key,
                        message: 'Khoảng thời gian không hợp lệ'
                    });                    
                    setCusError(true);
                    return;
                }
                setCusErrorData({
                    key: '',
                    message: ''
                });
                setCusError(false);                
                break;
        }
    }

    const onCloseModal = () => {
        if(submitType === 'update') setSubmitType('create');
        setCusData({
            name: '',
            startTime: dayjs(),
            endTime: dayjs(),
            period: ''
        });
        setCusErrorData({
            key: '',
            message: ''
        });
        setCusError(false);
        setToggleModal(false);
    }

    const onOpenModal = () => {
        setToggleModal(true);
    }

    const onSaveData = () => {
        const cusDataStringify = JSON.stringify(cusData);
        const cusDataNew = JSON.parse(cusDataStringify);        
        cusDataNew.startTime = dayjs(cusDataNew.startTime).format('HH:mm').toString();
        cusDataNew.endTime = dayjs(cusDataNew.endTime).format('HH:mm').toString();
        if(submitType === 'create') {
            requestCreate(cusDataNew);
        }
        if(submitType === 'update') {
            requestUpdate(cusDataNew);
        }
    }

    const onClickUpdate = (data) => {
        setSubmitType('update');
        setCusData({
            id: data._id,
            name: data.name,
            startTime: dayjs(data.startTime, 'H:mm'),
            endTime: dayjs(data.endTime, 'H:mm'),
            period: data.period
        });
        onOpenModal();
    }

    const onCloseAlert = () => {
        if(alertType === 'success') {            
            requestGetAll();
        }
        onCloseModal();
        setAlert(false);
        setAlertType('');
        setAlertMess('');
    }

    const onClickRemove = (params) => {
        requestRemove(params);
    }    
    
    // Stuff
    const canSaveData = () => {
        if(!cusData.name || !cusData.period) return false;
        return true;
    }

    const fetchInitialData = () => {
        requestGetAll();
    }    

    // Handle
    const handleFetchInitialData = () => {
        if(dataGetAll) {
            const data = dataGetAll.data.map(element => ({
                id: element._id,
                name: element.name,
                startTime: element.startTime,
                endTime: element.endTime,
                period: element.period,
                status: element.default,
                action: element
            }));            
            setRows(data);
            setDataGetAll(null);
        }
    }

    const handleReceiveSuccessData = () => {
        if(dataCreate) {
            setAlert(true);
            setAlertType('success');
            setAlertMess(dataCreate.message);
            setDataCreate(null);
        }
        if(dataUpdate) {
            setAlert(true);
            setAlertType('success');
            setAlertMess(dataUpdate.message);
            setDataUpdate(null);
        }
        if(dataRemove) {
            setAlert(true);
            setAlertType('success');
            setAlertMess(dataRemove.message);
            setDataRemove(null);
        }
    }

    const handleReceiveErrorData = () => {
        if(errorCreate) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messageCreate);
        }
        if(errorUpdate) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messageUpdate);
        }
        if(errorRemove) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messageRemove);
        }
    }

    useEffect(() => {
        fetchInitialData();
    }, []);    

    useEffect(() => {    
        handleFetchInitialData();
    }, [dataGetAll]);

    useEffect(() => {
        handleReceiveSuccessData();
    }, [dataCreate, dataUpdate, dataRemove]);

    useEffect(() => {
        handleReceiveErrorData();
    }, [errorCreate, errorUpdate, errorRemove]);

    return (
        <Layout 
            children={
                <Box>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                        <Typography variant="h6" fontWeight={'bold'}>Quản lý thời gian</Typography>
                        <Button variant="contained" onClick={() => onOpenModal()}><AddIcon /> Thêm mới</Button>
                    </Box>
                    <Box sx={{width: '100%'}}> 
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{pagination: {paginationModel: { page: 0, pageSize: 8 }}}}
                            pageSizeOptions={[5, 10, 50, 100]}
                            rowSelection={false}
                            checkboxSelection={false}                            
                        />
                    </Box>
                    <Modal open={toggleModal} onClose={() => onCloseModal()}>
                        <Box sx={styles.modal}>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin thời gian</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Tên nhóm thời gian"
                                    defaultValue={cusData.name}
                                    onChange={(e) => onChangeTextField('name', e.target.value)}
                                    error={cusError && cusErrorData.key === 'name' && true}
                                    helperText={cusError && cusErrorData.key === 'name' && cusErrorData.message}
                                    fullWidth
                                />                                
                            </Box>
                            <Box mb={2} display={'flex'} flexDirection={'row'}>
                                <Box mr={1}>
                                    <DesktopTimePicker 
                                        label="Thời gian bắt đầu" 
                                        defaultValue={cusData.startTime} 
                                        onChange={(value) => onChangeTextField('startTime', value)}
                                    />
                                </Box>
                                <Box ml={1}>
                                    <DesktopTimePicker 
                                        label="Thời gian kết thúc" 
                                        defaultValue={cusData.endTime} 
                                        onChange={(value) => onChangeTextField('endTime', value)}
                                    />
                                </Box>
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Khoảng thời gian (Phút)"
                                    defaultValue={cusData.period}
                                    onChange={(e) => onChangeTextField('period', e.target.value)}
                                    error={cusError && cusErrorData.key === 'period' && true}
                                    helperText={cusError && cusErrorData.key === 'period' && cusErrorData.message}
                                    fullWidth
                                />
                            </Box>                            
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Button 
                                    variant='contained' 
                                    disabled={!!loading || cusError && true || !canSaveData()}
                                    onSubmit={() => onSaveData()}
                                    onClick={() => onSaveData()}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Loading visible={loading} />
                    <AlertComponent visible={alert} message={alertMess} type={alertType} onClick={() => onCloseAlert()} />
                </Box>
            }
            route={TIME_PATH}
        />
    );
}

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

export default Time;
