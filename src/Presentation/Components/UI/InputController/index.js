import { Controller, useFormContext } from 'react-hook-form'
import { TextField } from '@mui/material'

export default function InputController(props) {
    const {
        name,
        rules,
        required,
        label,
        disable,
        type = 'text',
        InputProps,
        defaultValue,
        handleOnChange = () => {},
        handleOnBlur = () => {}
    } = props
    const { control } = useFormContext()
    return (
        <>
            <Controller
                name={name}
                control={control}
                rules={{ required: required && `${label} is required`, ...rules }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <TextField
                        id={name}
                        label={label}
                        variant='outlined'
                        type={type}
                        autoComplete='on'
                        error={!!error}
                        helperText={error?.message}
                        InputLabelProps={{ shrink: !!value }}
                        onChange={(event) => {
                            onChange(event)
                            handleOnChange(event)
                        }}
                        onBlur={(event) => {
                            handleOnBlur(event)
                        }}
                        value={defaultValue ? defaultValue : value}
                        fullWidth
                        disabled={disable}
                        InputProps={InputProps}
                    />
                )}
            />
        </>
    )
}
