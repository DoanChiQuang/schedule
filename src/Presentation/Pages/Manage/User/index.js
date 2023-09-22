import { Alert, Box, Button, Chip, Modal, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { DataGrid } from '@mui/x-data-grid';
import { USER_PATH } from "../../../../Main/Route/path";
import AddIcon from '@mui/icons-material/Add';
import useApi from "../../../Hooks/useApi";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PermissionIcon from '@mui/icons-material/LockOpen';
import Key from '@mui/icons-material/Key';
import CheckIcon from '@mui/icons-material/Check';
import { getAll, create, remove, update, enable, setPermission } from "../../../Api/user";
import { useTheme } from "@emotion/react";
import IconButton from '@mui/material/IconButton';
import { Loading, AlertComponent } from "../../../Components/UI";
import { phoneRegExp } from "../../../Utils/regexValidation";

const User = () => {
    
    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate, setData: setDataCreate } = useApi(create);
    const { data: dataUpdate, loading: loadingUpdate, error: errorUpdate, message: messageUpdate, request: requestUpdate, setData: setDataUpdate } = useApi(update);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove, setData: setDataRemove } = useApi(remove);    
    const { data: dataEnable, loading: loadingEnable, error: errorEnable, message: messageEnable, request: requestEnable, setData: setDataEnable } = useApi(enable);    
    const { data: dataPermission, loading: loadingPermission, error: errorPermission, message: messagePermission, request: requestPermission, setData: setDataPermission} = useApi(setPermission);    

    const theme = useTheme();
    const styles = style(theme);
    const [rows, setRows] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [toggleModalPass, setToggleModalPass] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        name: '',
        role: '',
    });
    const [userError, setUserError] = useState(false);
    const [userErrorData, setUserErrorData] = useState({
        key: '',
        message: ''
    });
    const [submitType, setSubmitType] = useState('create');
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMess, setAlertMess] = useState('');
    const loading = loadingGetAll || loadingCreate || loadingUpdate || loadingRemove || loadingEnable || loadingPermission;


    const columns = [
        { field: 'username', headerName: 'Tên đăng nhập', width: 180 },
        { field: 'name', headerName: 'Họ và tên', width: 140 },
        { field: 'role', headerName: 'Loại tài khoản', width: 160},
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
                        <Tooltip title="Mở lại">
                            <IconButton size="small" onClick={() => onClickEnable({id: params.value._id})}>
                                <CheckIcon size={24} />
                            </IconButton>
                        </Tooltip>
                    )
                } else {
                    if (params.value.role !== "admin") {
                        return (
                            <Box>
                                <Tooltip title="Sửa">
                                    <IconButton size="small" onClick={() => onClickUpdate(params.value)}>
                                        <EditIcon size={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Đổi mật khẩu">
                                    <IconButton size="small" onClick={() => onClickChangePass(params.value)}>
                                        <Key size={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Phân quyền">
                                {/* onClick={() => onClickSetPermission(params.value)} */}
                                    <IconButton size="small" >
                                        <PermissionIcon size={24} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Tắt">
                                    <IconButton color="error" size="small" onClick={() => onClickRemove({id: params.value._id})}>
                                        <DeleteIcon size={24} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )
                    }else{
                        return (
                            <Box></Box>
                        )
                    }
                }                
            }
        }
    ];    

    // Event
    const onChangeTextField = (key, value) => {
        onValidateTextField(key, value);        
        setUserData({...userData, [key]: value});
    }

    const onValidateTextField = (key, value) => {
        switch (key) {
            case 'username':
                if(!value) {                    
                    setUserErrorData({
                        key: key,
                        message: 'Tên đăng nhập không được để trống.'
                    });
                    setUserError(true);
                    return;
                }
                if(value.trim().split(" ").length > 1) {                    
                    setUserErrorData({
                        key: key,
                        message: 'Tên đăng nhập không được chứa khoảng trắng.'
                    });
                    setUserError(true);
                    return;
                }
                setUserErrorData({
                    key: '',
                    message: ''
                });
                setUserError(false);
                break;
            case 'name':
                if(!value) {
                    setUserErrorData({
                        key: key,
                        message: 'Tên không được để trống.'
                    });
                    setUserError(true);
                    return;
                }
                setUserErrorData({
                    key: '',
                    message: ''
                });
                setUserError(false);
                break;
        }
    }

    const onCloseModal = () => {
        if(submitType === 'update') setSubmitType('create');
        setUserData({
            username: '',
            name: '',
        });
        setUserErrorData({
            key: '',
            message: ''
        });
        setUserError(false);
        setToggleModal(false);
    }

    const onCloseModalPass = () => {
        if(submitType === 'updatepass') setSubmitType('create');
        setUserData({
            username: '',
            password: '',
        });
        setUserErrorData({
            key: '',
            message: ''
        });
        setUserError(false);
        setToggleModalPass(false);
    }

    const onOpenModal = () => {
        setToggleModal(true);
    }

    const onSaveData = () => {
        if(submitType === 'create') {
            requestCreate(userData);
        }
        if(submitType === 'update' || submitType === 'updatepass') {
            requestUpdate(userData);
        }
    }

    const onClickUpdate = (data) => {
        setSubmitType('update');
        setUserData({
            id: data._id,
            username: data.username,
            name: data.name,
        });
        onOpenModal();
    }

    const onClickChangePass = (data) => {
        setSubmitType('updatepass');
        setUserData({
            id: data._id,
            username: data.username,
            password: data.password,
        });
        setToggleModalPass(true);
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

    const onCloseAlertPass = () => {
        if(alertType === 'success') {            
            requestGetAll();
        }
        onCloseModalPass();
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
        if(!userData.username || !userData.name || userData.username.trim().split(" ").length > 1) return false;
        return true;
    }

    const canSaveDataPass = () => {
        // if(userData.password.length < 6) return false;
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
                username: element.username,
                name: element.name,
                role: element.role,
                status: element.del ? 'Đã xóa' : 'Hoạt động',
                action: element
            }))
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
                        <Typography variant="h6" fontWeight={'bold'}>Quản lý tài khoản</Typography>
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
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin tài khoản</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Tên đăng nhập"
                                    defaultValue={userData.username}
                                    onChange={(e) => onChangeTextField('username', e.target.value)}
                                    error={userError && userErrorData.key === 'username' && true}
                                    helperText={userError && userErrorData.key === 'username' && userErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Họ và tên"
                                    defaultValue={userData.name}
                                    onChange={(e) => onChangeTextField('name', e.target.value)}
                                    error={userError && userErrorData.key === 'name' && true}
                                    helperText={userError && userErrorData.key === 'name' && userErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Box mb={2}>
                            <TextField
                                label="Mật khẩu mặc định"
                                defaultValue={submitType=="create"? "123456":''}
                                disabled={true}
                                fullWidth
                                />
                            </Box>
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Button 
                                    variant='contained' 
                                    disabled={!!loading || userError && true || !canSaveData()}
                                    onSubmit={() => onSaveData()}
                                    onClick={() => onSaveData()}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    <Modal open={toggleModalPass} onClose={() => onCloseModalPass()}>
                        <Box sx={styles.modal}>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Đổi mật khẩu</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Tài khoản"
                                    defaultValue={userData.username}
                                    disabled={true}
                                    fullWidth
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Mật khẩu mới"
                                    defaultValue={"123456"}
                                    onChange={(e) => onChangeTextField('password', e.target.value)}
                                    error={userError && userErrorData.key === 'password' && true}
                                    helperText={userError && userErrorData.key === 'password' && userErrorData.message}
                                    fullWidth
                                    />
                            </Box>
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Button 
                                    variant='contained' 
                                    disabled={!!loading || userError && true || !canSaveDataPass()}
                                    onSubmit={() => onSaveData()}
                                    onClick={() => onSaveData()}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Loading visible={loading} />
                    <AlertComponent visible={alert} message={alertMess} type={alertType} onClick={() => submitType=="updatepass"? onCloseAlertPass():onCloseAlert()} />
                </Box>
            }
            route={USER_PATH}
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
        minWidth: "400px"
    }
})

export default User;
