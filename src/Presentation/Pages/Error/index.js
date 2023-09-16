import { Stack, styled, Typography, Box, Paper, Container, Grid, Button } from '@mui/material'
import ErrorBannerImg from './assets/banner.jpg'
import ErrorBanner from './components/ErrorBanner'
import RefreshIcon from '@mui/icons-material/Refresh'

export default function ErrorPage() {
    return (
        <>
            <Container>
                <Stack spacing={1} marginY={1}>
                    <Grid container justifyContent={'center'}>
                        <Grid item xs={12} sm={8} md={6}>
                            <Paper color={'aqua'} elevation={3}>
                                <Stack paddingX={3} paddingY={3} spacing={2}>
                                    <StackItem>
                                        <ErrorBanner imgSrc={ErrorBannerImg} />
                                    </StackItem>
                                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                                        <Typography variant='h5' textAlign={'center'} sx={{ fontWeight: 'bold' }}>
                                            Your connection are lost
                                        </Typography>
                                    </Stack>
                                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                                        <Typography variant='subtitle1' textAlign={'center'}>
                                            Please check your internet connection and try again
                                        </Typography>
                                    </Stack>
                                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                                        <Button variant='outlined' type='submit' sx={{ borderRadius: 5 }}>
                                            <RefreshIcon fontSize={'small'} /> Refresh
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </>
    )
}

const StackItem = styled(Box)(({ theme }) => ({}))
