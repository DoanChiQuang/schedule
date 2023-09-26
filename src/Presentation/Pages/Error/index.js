import { Typography, Box, Container, Grid, Button } from '@mui/material'
import ErrorBannerImg from './assets/page_not_found.jpg'

const onBack = () => {
    window.location="/manager";
}

export default function ErrorPage() {
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
