import { useTheme } from "@emotion/react";
import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

const AlertComponent = ({visible, message="", onClick, type, showCancel, onClickCancel}) => {
    const theme = useTheme();
    const styles = style(theme);
    return (
        <Modal open={visible}>
            <Box sx={[styles.modal]}>
                <Box sx={{marginBottom: 2}}>
                    <Typography variant="body1" fontWeight={"bold"} color={type === "success" ? theme.palette.primary.main : "red"}>Thông báo</Typography>
                    <Typography variant="body1" color={type === "success" ? theme.palette.primary.main : "red"}>{message}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    {showCancel && <Button variant='contained' size="small" color="inherit" type='submit' disabled={false} onClick={onClickCancel} sx={{mr: 1}}>Hủy</Button>}
                    <Button variant='contained' size="small" type='submit' disabled={false} onClick={onClick}>OK</Button>
                </Box>
            </Box>
        </Modal>
    )
}

const style = (theme) => ({
    modal: {
        minWidth: 300,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',        
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: 1,
        p: 3
    }
})

export default AlertComponent;