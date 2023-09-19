import React from "react";
import Layout from "../../Layout/Layout";
import { Box, Typography } from "@mui/material";
import { CALENDER_PATH } from "../../../../Main/Route/path";

const Calendar = () => {

    const ChildElement = () => {
        return (
            <Box>
                <Typography>Hello</Typography>
            </Box>
        );
    }

    return (
        <Layout children={<ChildElement />} route={CALENDER_PATH} />
    );
}

export default Calendar;