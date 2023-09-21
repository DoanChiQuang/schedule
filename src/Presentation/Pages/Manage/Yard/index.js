import { Box, Button, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { DataGrid } from '@mui/x-data-grid';
import { YARD_PATH } from "../../../../Main/Route/path";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useApi from "../../../Hooks/useApi";
import { getAll, create, remove } from "../../../Api/yard";

const columns = [
    { field: 'id', headerName: 'STT', width: 70 },
    { field: 'name', headerName: 'Tên sân', width: 230 },
    { field: 'branch', headerName: 'Chi nhánh', width: 120, },
    { field: 'action', headerName: 'Hành động', width: 240, sortable: false,
        disableClickEventBubbling: true,
        
        renderCell: (params) => {
            const onClick = (e) => {
            const currentRow = params.row;
            return alert(JSON.stringify(currentRow, null, 4));
            };
            
            return (
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="primary" size="small" onClick={onClick}>Edit</Button>
                <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={onClick}>Delete</Button>
            </Stack>
            );
    },},
];

const rows = [
{ id: 1, name: 'Sân 1', branch: 1,},
{ id: 2, name: 'Sân 2', branch: 1,},
{ id: 3, name: 'Sân 3', branch: 1,},
{ id: 4, name: 'Sân 4', branch: 1,},
{ id: 5, name: 'Sân 5', branch: 1,},
{ id: 6, name: 'Sân 6', branch: 1,},
{ id: 7, name: 'Sân 7', branch: 1,},
{ id: 8, name: 'Sân 8', branch: 1,},
{ id: 9, name: 'Sân 9', branch: 1,},
];

const Yard = () => {
    
    const { data: dataGetAll, loading: loadingGetAll, error: errorGetAll, message: messageGetAll, request: requestGetAll } = useApi(getAll);
    const { data: dataCreate, loading: loadingCreate, error: errorCreate, message: messageCreate, request: requestCreate } = useApi(create);
    const { data: dataRemove, loading: loadingRemove, error: errorRemove, message: messageRemove, request: requestRemove } = useApi(remove);


    useEffect(() => {
        requestGetAll()
    }, [])
    useEffect(() => {
        // if(dataGetAll) console.log(dataGetAll)
    }, [dataGetAll]);
    console.log(dataGetAll);
    return (
        <Layout 
            children={
                <Box>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                        <Typography variant="h6" fontWeight={'bold'}>Quản lý sân</Typography>
                        <Button variant="contained">
                            <AddIcon /> Thêm mới
                        </Button>
                    </Box>
                    <Box sx={{width: '100%'}}>
                        <DataGrid
                            // getRowId={(row) => row._id}
                            rows={rows}
                            columns={columns}
                            initialState={{pagination: {paginationModel: { page: 0, pageSize: 5 }}}}
                            pageSizeOptions={[5, 10, 50, 100]}
                            checkboxSelection={false}                            
                        />
                    </Box>
                </Box>
            }
            route={YARD_PATH} 
        />
    );
}

export default Yard;
