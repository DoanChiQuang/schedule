import { Box, Button, Typography, Stack, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Layout from "../../Layout/Layout";
import { DataGrid } from '@mui/x-data-grid';
import { YARD_PATH } from "../../../../Main/Route/path";
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from "@emotion/react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Loading, AlertComponent } from "../../../Components/UI";
import useApi from "../../../Hooks/useApi";
import { getAll, create, remove } from "../../../Api/yard";


const Yard = () => {
    
    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll, setData: setDataGetAll } = useApi(getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate, setData: setDataCreate } = useApi(create);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove, setData: setDataRemove } = useApi(remove);
    
    const theme = useTheme();
    const styles = style(theme);
    const [rows, setRows] = useState([])
    const [toggleModal, setToggleModal] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMess, setAlertMess] = useState('');
    const loading = loadingGetAll || loadingCreate || loadingRemove;

    const [yardData, setYardData] = useState({
        name: '',
        branch: '',
    });
    const [yardError, setYardError] = useState(false);
    const [yardErrorData, setYardErrorData] = useState({
        key: '',
        message: ''
    });

    const columns = [
        // { field: 'id', headerName: 'STT', width: 70 },
        { field: 'name', headerName: 'Tên sân', width: 250 },
        { field: 'branch', headerName: 'Chi nhánh', width: 220, },
        { field: 'action', 
            headerName: '#', 
            width: 160,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton size="small" onClick={() => onClickUpdate(params.value)}>
                            <EditIcon size={24} />
                        </IconButton>
                        <IconButton size="small" onClick={() => onClickRemove({id: params.value._id})}>
                            <DeleteIcon size={24} />
                        </IconButton>
                    </Box>
                )              
            }
        }
    ];

    const onChangeTextField = (key, value) => {
        onValidateTextField(key, value);        
        setYardData({...yardData, [key]: value});
    }

    const onValidateTextField = (key, value) => {
        switch (key) {
            case 'name':
                if(!value) {                    
                    setYardErrorData({
                        key: key,
                        message: 'Tên không được để trống.'
                    });
                    setYardError(true);
                    return;
                }
                setYardErrorData({
                    key: '',
                    message: ''
                });
                setYardError(false);
                break;
            // case 'branch':
            //     if(!value) {
            //         setYardErrorData({
            //             key: key,
            //             message: 'Chi nhánh không được để trống.'
            //         });
            //         setYardError(true);
            //         return;
            //     }
            //     setYardErrorData({
            //         key: '',
            //         message: ''
            //     });
            //     setYardError(false);
            //     break;
        }
    }

    const onOpenModal = () => {
        setToggleModal(true);
    }

    const onCloseModal = () => {
        setYardData({
            name: '',
            branch: '',
        });
        setYardErrorData({
            key: '',
            message: ''
        });
        setYardError(false);
        setToggleModal(false);
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

    const onSaveData = () => {
        requestCreate(yardData);
    }
    // Stuff
    const canSaveData = () => {
        if(!yardData.name) return false;
        return true;
    }

    const fetchInitialData = () => {
        requestGetAll();
    }    

    // const onClickUpdate = (data) => {}
    const onClickUpdate = (data) => {
        setYardData({
            id: data._id,
            name: data.name,
            // branch: data.branch,
        });
        onOpenModal();
    }

    // Handle
    const handleFetchInitialData = () => {
        if(dataGetAll) {
            const data = dataGetAll.data.map(element => ({
                id: element._id,
                name: element.name,
                branch: "Chi nhánh "+element.branch,
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
    }, [dataCreate, dataRemove]);

    useEffect(() => {
        handleReceiveErrorData();
    }, [errorCreate, errorRemove]);

    return (
        <Layout 
            children={
                <Box>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                        <Typography variant="h6" fontWeight={'bold'}>Quản lý sân</Typography>
                        <Button variant="contained" onClick={() => onOpenModal()}>
                            <AddIcon /> Thêm mới
                        </Button>
                    </Box>
                    <Box sx={{width: '100%'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{pagination: {paginationModel: { page: 0, pageSize: 5 }}}}
                            pageSizeOptions={[5, 10, 50, 100]}
                            checkboxSelection={false}
                            rowSelection={false}                            
                        />
                    </Box>
                    <Modal open={toggleModal} onClose={() => onCloseModal()}>
                        <Box sx={styles.modal}>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Thông tin sân</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Tên (Sân 1, Sân 2,...)"
                                    defaultValue={yardData.name}
                                    onChange={(e) => onChangeTextField('name', e.target.value)}
                                    error={yardError && yardErrorData.key === 'name' && true}
                                    helperText={yardError && yardErrorData.key === 'name' && yardErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            {/* <Box mb={2}>
                                <TextField
                                    label="Chi nhánh (1, 2,...)"
                                    defaultValue={yardData.branch}
                                    type="number"
                                    onChange={(e) => onChangeTextField('branch', e.target.value)}
                                    error={yardError && yardErrorData.key === 'branch' && true}
                                    helperText={yardError && yardErrorData.key === 'branch' && yardErrorData.message}
                                    fullWidth
                                />
                            </Box> */}
                    
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Button 
                                    variant='contained' 
                                    disabled={!!loading || yardError && true || !canSaveData()}
                                    onSubmit={() => onSaveData()}
                                    onClick={() => onSaveData()}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Loading visible={loadingGetAll || loadingCreate || loadingRemove} />
                    <AlertComponent visible={alert} message={alertMess} type={alertType} onClick={() => onCloseAlert()} />
                </Box>
            }
            route={YARD_PATH} 
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
export default Yard;
