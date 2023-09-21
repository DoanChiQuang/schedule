import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import React from "react";

const Loading = ({visible, message="Loading..."}) => {
    const theme = useTheme();
    const styles = style(theme);
    return (
        <Modal open={visible}>
            <Box sx={[styles.modal]}>
                <Box mb={1} sx={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
                    <CircularProgress />
                </Box>
                <Typography variant="body1">{message}</Typography>
            </Box>
        </Modal>
    )
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
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 2,
        paddingBottom: 2,
    }
})

export default Loading;