"use client";
import { useFormState } from "react-dom";
import { signin } from "../actions/auth";
import { Box, TextField } from "@mui/material";
import Button from "./button";
import styled from "@emotion/styled";

const SigninForm = () => {
    const [state, action] = useFormState(signin, undefined);

    return (
        <FormContainer action={action}>
            <TextField
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                error={state?.errors?.email ? true : false}
                helperText={state?.errors?.email && state.errors.email}
                required
            />
            <TextField
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                error={state?.errors?.password ? true : false}
                helperText={state?.errors?.password && state.errors.password}
                required
            />
            <Button />
        </FormContainer>
    );
};

const FormContainer = styled("form")(
    ({ theme }) => `
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;
    `
);

export default SigninForm;
