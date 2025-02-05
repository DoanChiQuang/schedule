import { Table } from '@tanstack/react-table';
import { Input } from '@/modules/components/ui/input';
import { Button } from '@/modules/components/ui/button';
import { X } from 'lucide-react';
import { DataTableFacetedFilter } from '@/modules/components/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/modules/components/data-table/data-table-view-options';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterColName?: string;
    filterColStates?: {
        colName: string;
        states: {
            value: string;
            label: string;
            icon?: any;
        }[];
    }[];
}

export function DataTableToolbar<TData>({
    table,
    filterColName,
    filterColStates,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {filterColName && (
                    <Input
                        placeholder={`Filter ${filterColName}...`}
                        value={
                            (table
                                .getColumn(filterColName)
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn(filterColName)
                                ?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}
                {filterColStates &&
                    filterColStates.map(
                        (filterColState, filterColStateIndex) => (
                            <DataTableFacetedFilter
                                key={filterColStateIndex}
                                column={table.getColumn(filterColState.colName)}
                                title="Status"
                                options={filterColState.states}
                            />
                        ),
                    )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X size={16} className="ml-2" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
