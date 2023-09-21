import { Alert, Box, Button, Chip, FormControl, Modal, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { DataGrid } from '@mui/x-data-grid';
import { CUSTOMER_PATH } from "../../../../Main/Route/path";
import AddIcon from '@mui/icons-material/Add';
import useApi from "../../../Hooks/useApi";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import * as yup from 'yup'
import { getAll, create, remove, update, enable } from "../../../Api/customer";
import { useTheme } from "@emotion/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputController from "../../../Components/UI/InputController";
import IconButton from '@mui/material/IconButton';
import { Loading, AlertComponent } from "../../../Components/UI";
import { phoneRegExp } from "../../../Utils/regexValidation";

const Customer = () => {
    
    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate, setData: setDataCreate } = useApi(create);
    const { data: dataUpdate, loading: loadingUpdate, error: errorUpdate, message: messageUpdate, request: requestUpdate, setData: setDataUpdate } = useApi(update);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove, setData: setDataRemove } = useApi(remove);    
    const { data: dataEnable, loading: loadingEnable, error: errorEnable, message: messageEnable, request: requestEnable, setData: setDataEnable } = useApi(enable);    

    const theme = useTheme();
    const styles = style(theme);
    const [rows, setRows] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [cusData, setCusData] = useState({
        name: '',
        phonenum: '',
        bankAccountNo: '',
        bankAccountName: '',
        bankName: '',
        discount: 0
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
    const loading = loadingGetAll || loadingCreate || loadingUpdate || loadingRemove || loadingEnable;


    const columns = [
        { field: 'name', headerName: 'Tên', width: 180 },
        { field: 'phonenum', headerName: 'Số điện thoại', width: 140 },
        { field: 'bankAccountNo', headerName: 'Số tài khoản NH', width: 160},
        { field: 'bankAccountName', headerName: 'Tên tài khoản NH', width: 160},
        { field: 'bankName', headerName: 'Tên NH', width: 160},
        { field: 'discount', headerName: 'Chiết khấu', width: 120},
        { 
            field: 'status', 
            headerName: 'Trạng thái', 
            width: 120, 
            renderCell: (params) => (                
                <Chip
                    label={params.value}
                    color={params.value === 'Hoạt động' ? 'success' : 'error'}
                    size="small"
                />
            )
        },
        { 
            field: 'action', 
            headerName: '#', 
            width: 160,
            renderCell: (params) => {
                if(params.value.del === 1) {
                    return (                        
                        <IconButton size="small" color="inherit" onClick={() => onClickEnable({id: params.value._id})}>
                            <CheckIcon size={24} />
                        </IconButton>
                    )
                } else {
                    return (
                        <Box>
                            <IconButton color="warning" size="small" onClick={() => onClickUpdate(params.value)}>
                                <EditIcon size={24} />
                            </IconButton>
                            <IconButton color="error" size="small" onClick={() => onClickRemove({id: params.value._id})}>
                                <DeleteIcon size={24} />
                            </IconButton>
                        </Box>
                    )
                }                
            }
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
            case 'phonenum':
                if(!value) {
                    setCusErrorData({
                        key: key,
                        message: 'Số điện thoại không được để trống.'
                    });
                    setCusError(true);
                    return;
                }
                if(!phoneRegExp.test(value)) {
                    setCusErrorData({
                        key: key,
                        message: 'Số điện thoại không hợp lệ.'
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
            case 'discount':                
                if(value < 0) {                    
                    setCusErrorData({
                        key: key,
                        message: 'Chiết khấu tối thiểu 0%'
                    });
                    setCusError(true);
                    return;
                }
                if(value > 100) {                    
                    setCusErrorData({
                        key: key,
                        message: 'Chiết khấu tối đa 100%'
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
            phonenum: '',
            bankAccountNo: '',
            bankAccountName: '',
            bankName: '',
            discount: 0
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
        if(submitType === 'create') {
            requestCreate(cusData);
        }
        if(submitType === 'update') {
            requestUpdate(cusData);
        }
    }

    const onClickUpdate = (data) => {
        setSubmitType('update');
        setCusData({
            id: data._id,
            name: data.name,
            phonenum: data.phonenum,
            bankAccountNo: data.bankAccountNo,
            bankAccountName: data.bankAccountName,
            bankName: data.bankName,
            discount: data.discount
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

    const onClickEnable = (params) => {
        requestEnable(params);
    }
    
    // Stuff
    const canSaveData = () => {
        if(!cusData.name || !cusData.phonenum) return false;
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
                phonenum: element.phonenum,
                bankAccountNo: element.bankAccountNo,
                bankAccountName: element.bankAccountName,
                bankName: element.bankName,
                discount: element.discount,
                status: element.del ? 'Đã xóa' : 'Hoạt động',
                action: element
            }))
            setRows(data)
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
        if(dataEnable) {
            setAlert(true);
            setAlertType('success');
            setAlertMess(dataEnable.message);
            setDataEnable(null);
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
        if(errorEnable) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messageEnable);
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
    }, [dataCreate, dataUpdate, dataRemove, dataEnable]);

    useEffect(() => {
        handleReceiveErrorData();
    }, [errorCreate, errorUpdate, errorRemove, errorEnable]);

    return (
        <Layout 
            children={
                <Box>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                        <Typography variant="h6" fontWeight={'bold'}>Quản lý khách hàng</Typography>
                        <Button variant="contained" onClick={() => onOpenModal()}><AddIcon /> Thêm mới</Button>
                    </Box>
                    <Box sx={{width: '100%'}}> 
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{pagination: {paginationModel: { page: 0, pageSize: 5 }}}}
                            pageSizeOptions={[5, 10, 50, 100]}
                            rowSelection={false}
                            checkboxSelection={false}                            
                        />
                    </Box>
                    <Modal open={toggleModal} onClose={() => onCloseModal()}>
                        <Box sx={styles.modal}>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin cá nhân</Typography>
                            <Box display={'flex'} flexDirection={'row'} sx={{mb: 2}}>
                                <TextField
                                    label="Họ và Tên"
                                    defaultValue={cusData.name}
                                    onChange={(e) => onChangeTextField('name', e.target.value)}
                                    error={cusError && cusErrorData.key === 'name' && true}
                                    helperText={cusError && cusErrorData.key === 'name' && cusErrorData.message}
                                    sx={{mr: 1}}
                                    fullWidth
                                />
                                <TextField
                                    label="Số điện thoại"
                                    defaultValue={cusData.phonenum}
                                    onChange={(e) => onChangeTextField('phonenum', e.target.value)}
                                    error={cusError && cusErrorData.key === 'phonenum' && true}
                                    helperText={cusError && cusErrorData.key === 'phonenum' && cusErrorData.message}
                                    sx={{ml: 1}}
                                    fullWidth
                                />
                            </Box>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin ngân hàng</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Tài khoản NH"
                                    defaultValue={cusData.bankAccountNo}
                                    onChange={(e) => onChangeTextField('bankAccountNo', e.target.value)}
                                    error={cusError && cusErrorData.key === 'bankAccountNo' && true}
                                    helperText={cusError && cusErrorData.key === 'bankAccountNo' && cusErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Tên tài khoản NH"
                                    defaultValue={cusData.bankAccountName}
                                    onChange={(e) => onChangeTextField('bankAccountName', e.target.value)}
                                    error={cusError && cusErrorData.key === 'bankAccountName' && true}
                                    helperText={cusError && cusErrorData.key === 'bankAccountName' && cusErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Tên NH"
                                    defaultValue={cusData.bankName}
                                    onChange={(e) => onChangeTextField('bankName', e.target.value)}
                                    error={cusError && cusErrorData.key === 'bankName' && true}
                                    helperText={cusError && cusErrorData.key === 'bankName' && cusErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin khác</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Chiết khấu"
                                    defaultValue={cusData.discount}
                                    onChange={(e) => onChangeTextField('discount', e.target.value)}
                                    error={cusError && cusErrorData.key === 'discount' && true}
                                    helperText={cusError && cusErrorData.key === 'discount' && cusErrorData.message}
                                    type="number"
                                    InputProps={{ inputProps: { min: 0, max: 10 } }}
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
                    <Loading visible={loadingGetAll || loadingCreate || loadingUpdate || loadingRemove || loadingEnable} />
                    <AlertComponent visible={alert} message={alertMess} type={alertType} onClick={() => onCloseAlert()} />
                </Box>
            }
            route={CUSTOMER_PATH} 
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

export default Customer;
