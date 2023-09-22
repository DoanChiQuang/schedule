import { Alert, Box, Button, Chip, Modal, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { FORGOTPASSWORD_PATH } from "../../../../Main/Route/path";
import useApi from "../../../Hooks/useApi";
import { changePass } from "../../../Api/user";
import { useTheme } from "@emotion/react";
import { Loading, AlertComponent } from "../../../Components/UI";
import { render } from "@testing-library/react";

const ChangePass = () => {
    
    const { data: datachangePass, loading: loadingchangePass, error: errorchangePass, message: messagechangePass, request: requestchangePass, setData: setDatachangePass } = useApi(changePass);

    const theme = useTheme();
    const styles = style(theme);
    const [toggleModal, setToggleModal] = useState(true);
    const [userData, setUserData] = useState({
        id: JSON.parse(localStorage.getItem("user"))._id,
        password: '',
        newpass: '',
        newpassconf: '',
    });
    const [userError, setUserError] = useState(false);
    const [userErrorData, setUserErrorData] = useState({
        key: '',
        message: ''
    });
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMess, setAlertMess] = useState('');
    const loading = loadingchangePass;

    // Event
    const onChangeTextField = (key, value) => {
        onValidateTextField(key, value);        
        setUserData({...userData, [key]: value});
    }

    const onValidateTextField = (key, value) => {
        switch (key) {
            case 'password':
                if(!value) {                    
                    setUserErrorData({
                        key: key,
                        message: 'Mật khẩu không được để trống.'
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
            case 'newpass':
                if(!value) {
                    setUserErrorData({
                        key: key,
                        message: 'Mật khẩu mới không được để trống.'
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
            case 'newpassconf':
                if(!value) {
                    setUserErrorData({
                        key: key,
                        message: 'Mật khẩu xác nhận không được để trống.'
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
        setUserErrorData({
            key: '',
            message: ''
        });
        setUserError(false);
        setToggleModal(false);
    }

    const onOpenModal = () => {
        if(!toggleModal){
            setToggleModal(true);
        }
    }

    const onSaveData = () => {
        requestchangePass(userData);
    }

    const onCloseAlert = () => {
        if(alertType === 'success') {            
            window.location = "/manage/calender";
            onCloseModal();
        }
        setAlert(false);
        setAlertType('');
        setAlertMess('');
    }
    const onBack = () => {
        window.history.back();
    }
    // Stuff
    const canSaveData = () => {
        if(!userData.password || !userData.newpass || !userData.newpassconf) return false;
        return true;
    }

    const handleReceiveSuccessData = () => {
        if(datachangePass) {
            setAlert(true);
            setAlertType('success');
            setAlertMess(datachangePass.message);
        }
    }

    const handleReceiveErrorData = () => {
        if(errorchangePass) {
            setAlert(true);
            setAlertType('error');
            setAlertMess(messagechangePass);
        }
    }

    useEffect(() => {
        handleReceiveSuccessData();
    }, [datachangePass]);

    useEffect(() => {
        handleReceiveErrorData();
    }, [errorchangePass]);

    return (
        <Layout 
            children={
                <Box>
                    <Modal open={(toggleModal)}>
                        <Box sx={styles.modal}>
                            <Typography variant="body1" fontWeight={"bold"} mb={2}>Đổi mật khẩu</Typography>
                            <Box mb={2}>
                                <TextField
                                    label="Mật khẩu cũ"
                                    onChange={(e) => onChangeTextField('password', e.target.value)}
                                    error={userError && userErrorData.key === 'password' && true}
                                    helperText={userError && userErrorData.key === 'password' && userErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Mật khẩu mới"
                                    onChange={(e) => onChangeTextField('newpass', e.target.value)}
                                    error={userError && userErrorData.key === 'newpass' && true}
                                    helperText={userError && userErrorData.key === 'newpass' && userErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Xác nhận mật khẩu mới"
                                    onChange={(e) => onChangeTextField('newpassconf', e.target.value)}
                                    error={userError && userErrorData.key === 'newpassconf' && true}
                                    helperText={userError && userErrorData.key === 'newpassconf' && userErrorData.message}
                                    fullWidth
                                />
                            </Box>
                            <Box display={'flex'} justifyContent={'flex-end'}>
                                <Box mr={2}>
                                    <Button 
                                        variant='contained' 
                                        onClick={() => onBack()}
                                    >
                                        Quay lại
                                    </Button>
                                </Box>
                                <Button 
                                    color="success"
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
                    <Loading visible={loading} />
                    <AlertComponent visible={alert} message={alertMess} type={alertType} onClick={() => onCloseAlert()} />
                </Box>
            }
            route={FORGOTPASSWORD_PATH}
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

export default ChangePass;
