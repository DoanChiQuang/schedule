import React from "react";
import { useFormStatus } from "react-dom";
import { Button as MuiButton } from "@mui/material";

const Button = () => {
    const { pending } = useFormStatus();

    return (
        <MuiButton type="submit" variant="contained" disabled={pending}>
            Sign in
        </MuiButton>
    );
};

export default Button;
