import * as React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Text, Center, Heading } from "@chakra-ui/react";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";


export function DataTable({data,columns}) {
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel:getPaginationRowModel(),
        enableSorting:false,
    });

    return data.length != 0?
            <Table>
            <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} bg='lightblue' >
                    {headerGroup.headers.map((header) => {
                    // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                    const meta = header.column.columnDef.meta;
                    return (
                        <Th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        isNumeric={meta?.isNumeric}

                        >
                        {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}

                        </Th>
                    );
                    })}
                </Tr>
                ))}
            </Thead>
            <Tbody>
                {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                        // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                        const meta = cell.column.columnDef.meta;
                        return (
                            <Td key={cell.id} isNumeric={meta?.isNumeric}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Td>
                        );
                    })}
                </Tr>
                ))}
            </Tbody>
            </Table>
        :<Center><Heading size={'lg'}>There Is No Data To Show</Heading></Center>
        
}
