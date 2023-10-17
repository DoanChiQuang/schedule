import { Typography, Box, Container, Grid, Button } from '@mui/material'
import ErrorBannerImg from './assets/page_not_found.jpg'


export default function ErrorPage() {    
    const onBack = () => {
        const user = localStorage.getItem('user');
        const role = JSON.parse(user).role;
        if(role == 'admin') {
            window.location='/manage';
        }
        if(role == 'staff') {
            window.location='/staff';
        }       
    }
    return (
        <>
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}
        >
        <Container maxWidth="md">
            <Grid container>
                <Grid xs={6} mt={6}>
                    <Typography variant="h2">
                    404
                    </Typography>
                    <Typography variant="h6" mb={1}>
                    Trang bạn đang truy cập không tồn tại.
                    </Typography>
                    <Button variant="contained" onClick={() => onBack()}>Về trang chủ</Button>
                </Grid>
                <Grid xs={6}>
                    <img
                    src={ErrorBannerImg}
                    alt=""
                    width={530} height={330}
                    />
                </Grid>
            </Grid>
        </Container>
        </Box>
        </>
    )
}
