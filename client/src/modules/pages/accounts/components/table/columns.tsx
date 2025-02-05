import { TAccountsData } from '@/stores/accounts/types/accounts';
import { ColumnDef } from '@tanstack/react-table';

export const AccountsColumns: ColumnDef<TAccountsData>[] = [
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'roles',
        header: 'Roles',
    },    
    {
        accessorKey: 'del',
        header: 'Status',
    },
];
