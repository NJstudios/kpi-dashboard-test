'use client';

import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

type Kpi = {
  date: string;
  mrr: number;
  dau: number;
  churn: number;
  ltv: number;
};

export default function App() {
  const [data, setData] = useState<Kpi[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/kpis');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnDef<Kpi>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'mrr',
      header: 'MRR ($)',
    },
    {
      accessorKey: 'dau',
      header: 'DAU',
    },
    {
      accessorKey: 'churn',
      header: 'Churn Rate',
      cell: ({ getValue }) => `${(getValue<number>() * 100).toFixed(2)}%`,
    },
    {
      accessorKey: 'ltv',
      header: 'LTV ($)',
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">KPI Dashboard</h1>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="border px-4 py-2 text-left text-gray-700"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="border px-4 py-2 text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
