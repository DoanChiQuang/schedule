import { DataTable } from '@/modules/components/data-table/data-table';
import { AccountsColumns } from '@/modules/pages/accounts/components/table/columns';
import { TAccountsData } from '@/stores/accounts/types/accounts';

const AccountsTable = () => {
    const data: TAccountsData[] = [
        {
            id: '1',
            email: 'chiquang@gmail.com',
            name: 'Quang Doan',
            roles: ['admin'],
            del: 0,
        },
    ];

    const filterColStates = [
        {
            colName: 'del',
            states: [
                {
                    value: '0',
                    label: 'Active',
                },
                {
                    value: '1',
                    label: 'Delete',
                },
            ],
        },
    ];
    
    return (
        <DataTable
            columns={AccountsColumns}
            data={data}
            filterColName="email"
            filterColStates={filterColStates}
        />
    );
};

export default AccountsTable;
