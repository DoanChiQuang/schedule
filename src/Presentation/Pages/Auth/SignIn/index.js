import { Alert, Button, Container, FormControl, Grid, IconButton, InputAdornment, Link, Paper, Stack, Typography, useTheme } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import InputController from '../../../Components/UI/InputController'
import { useEffect, useState } from 'react'
import { VscEyeClosed, VscEye } from 'react-icons/vsc'
import useApi from '../../../Hooks/useApi'
import { signin } from '../../../Api/auth'
import { useNavigate } from 'react-router-dom'
import { DASH_PATH, FORGOTPASSWORD_PATH, MANAGE_PATH } from '../../../../Main/Route/path'

const schema = yup.object({
    username: yup.string().required("Tài khoản không được để trống."),
    password: yup.string().required("Mật khẩu không được để trống.")
})

export default function SignInPage() {
    const theme = useTheme()
    const styles = customStyle(theme)
    const methods = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: yupResolver(schema)
    })
    const {data, loading, message, error, request} = useApi(signin)
    const navigation = useNavigate()

    const { handleSubmit } = methods
    const onSubmit = (params) => {
        request(params)
    }
    const [hidePass, setHidePass] = useState(true)
    const [alert, setAlert] = useState(false)

    useEffect(() => {
        if(data) {
            localStorage.setItem('access_token', data?.data?.token)
            localStorage.setItem('user', JSON.stringify(data?.data?.user))
            navigation(DASH_PATH + MANAGE_PATH)
        }
    }, [data])

    useEffect(() => {
        if(error) setAlert(true)
    }, [error])

    return (
        <Container sx={styles.container} maxWidth={"xl"}>
            <Grid container justifyContent={'center'} alignItems={'center'}>
                <Grid item lg={4} md={5} sm={7} xs={10}>                    
                    <Stack my={1}>
                        <Typography variant={'h6'} textAlign={'center'} color={theme.palette.custom.white} fontWeight={'700'}>HỆ THỐNG QUẢN LÝ ĐẶT SÂN</Typography>
                    </Stack>

                    <Paper elevation={3} sx={styles.signInContent}>
                        <Stack p={4}>
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {alert &&
                                        <Stack mb={1}>
                                            <Alert variant={'outlined'} severity={'error'}>
                                                {message || 'Đã có lỗi xảy ra.'}
                                            </Alert>
                                        </Stack>
                                    }
                                    <FormControl margin={'dense'} fullWidth>                                    
                                        <InputController
                                            name={'username'}
                                            label={'Tài khoản'}
                                            handleOnChange={() => setAlert(false)}
                                            disable={!!loading}
                                        />
                                    </FormControl>
                                    <FormControl margin={'dense'} fullWidth>
                                        <InputController
                                            name='password'
                                            label={'Mật khẩu'}
                                            type={hidePass ? 'password' : 'text'}
                                            disable={!!loading}
                                            handleOnChange={() => setAlert(false)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            onClick={() => setHidePass(!hidePass)}
                                                            onMouseDown={(e) => e.preventDefault()}
                                                        >
                                                            {hidePass ? <VscEyeClosed /> : <VscEye />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </FormControl>
                                    <Stack mt={1}>
                                        <Link href={DASH_PATH + FORGOTPASSWORD_PATH} color='inherit' textAlign={'right'}>Quên mật khẩu?</Link>
                                    </Stack>
                                    <Stack mt={1}>
                                        <Button variant='contained' type='submit' disabled={!!loading}>
                                            {!!loading ? 'Loading...' : 'Đăng nhập'}
                                        </Button>
                                    </Stack>
                                </form>
                            </FormProvider>
                        </Stack>
                    </Paper>                    
                </Grid>
            </Grid>
        </Container>
    )    
}

const customStyle = (theme) => ({
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',        
        backgroundColor: theme.palette.primary.main
    },

    signInContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.custom.white
    }
})
