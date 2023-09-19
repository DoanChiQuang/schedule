import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { DataGrid } from '@mui/x-data-grid';
import { CUSTOMER_PATH } from "../../../../Main/Route/path";
import AddIcon from '@mui/icons-material/Add';
import useApi from "../../../Hooks/useApi";
import { getAll, create, remove, update } from "../../../Api/customer";

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 90, },
    { field: 'fullName', headerName: 'Full name', description: 'This column has a value getter and is not sortable.', sortable: false, width: 160,  valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`},
];
  
const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const Customer = () => {
    
    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll } = useApi(getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate } = useApi(create);
    const { data: dataUpdate, loading: loadingUpdate, error: errorUpdate, message: messageUpdate, request: requestUpdate } = useApi(update);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove } = useApi(remove);

    useEffect(() => {
        requestGetAll()
    }, [])

    useEffect(() => {
        if(dataGetAll) console.log(dataGetAll)
    }, [dataGetAll]);

    return (
        <Layout 
            children={
                <Box>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                        <Typography variant="h6" fontWeight={'bold'}>Quản lý khách hàng</Typography>
                        <Button variant="contained">
                            <AddIcon /> Thêm mới
                        </Button>
                    </Box>
                    <Box sx={{width: '100%'}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{pagination: {paginationModel: { page: 0, pageSize: 5 }}}}
                            pageSizeOptions={[5, 10, 50, 100]}
                            checkboxSelection={false}                            
                        />
                    </Box>
                </Box>
            }
            route={CUSTOMER_PATH} 
        />
    );
}

export default Customer;
