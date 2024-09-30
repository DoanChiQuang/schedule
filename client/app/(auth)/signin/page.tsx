"use client";
import React from "react";
import SigninForm from "../ui/signin-form";
import { Box, Card, Typography } from "@mui/material";
import styled from "@emotion/styled";

const SigninPage = () => {
    return (
        <SigninContainer>
            <MuiCard>
                <Typography variant="h4">Login</Typography>
                <SigninForm />
            </MuiCard>
        </SigninContainer>
    );
};

const SigninContainer = styled(Box)(
    ({ theme }) => `
		padding: 20px;
  		margin-top: 10vh;
	`
);

const MuiCard = styled(Card)(
    ({ theme }) => `
		display: flex;
		flex-direction: column;
		align-self: center;
		max-width: 450px;
		width: 100%;
		padding: 20px;
		gap: 16px;
		margin: auto;	
	`
);

export default SigninPage;
