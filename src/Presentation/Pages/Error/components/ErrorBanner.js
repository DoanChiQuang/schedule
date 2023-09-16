import { Box } from '@mui/material'

export default function ErrorBanner({ imgSrc }) {
    return (
        <Box
            borderRadius={3}
            height={'168px'}
            boxShadow={1}
            style={{
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        />
    )
}
