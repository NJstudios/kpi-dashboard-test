'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type KPI = {
  date: string;
  mrr: number;
  dau: number;
  churn: number;
  ltv: number;
};

const columnDescriptions: Record<keyof KPI | 'growth_mrr' | 'growth_dau', string> = {
  date: 'Date of the recorded metrics.',
  mrr: 'Monthly Recurring Revenue in USD.',
  dau: 'Daily Active Users.',
  churn: 'Percentage of users lost.',
  ltv: 'Customer Lifetime Value.',
  growth_mrr: 'MRR percentage change from previous entry.',
  growth_dau: 'DAU percentage change from previous entry.',
};

function calculateGrowth(current: number, previous: number): string {
  if (!previous || previous === 0) return '—';
  const growth = ((current - previous) / previous) * 100;
  return `${growth.toFixed(2)}%`;
}

export default function DashboardPage() {
  const [data, setData] = useState<(KPI & { growth_mrr?: string; growth_dau?: string })[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/kpis');
      const raw: KPI[] = await res.json();

      const enriched = raw.map((d, i) => ({
        ...d,
        growth_mrr: i === 0 ? '—' : calculateGrowth(d.mrr, raw[i - 1].mrr),
        growth_dau: i === 0 ? '—' : calculateGrowth(d.dau, raw[i - 1].dau),
      }));

      setData(enriched.reverse()); // Most recent first
    };
    fetchData();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">KPI Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gradient-to-r from-slate-100 to-slate-300">
              <TableRow>
                {['date', 'mrr', 'growth_mrr', 'dau', 'growth_dau', 'churn', 'ltv'].map((key) => (
                  <TableHead key={key} className="capitalize text-sm font-semibold">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="text-xs font-bold">
                          {key.replace('_', ' ')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 text-sm">{columnDescriptions[key as keyof typeof columnDescriptions]}</PopoverContent>
                    </Popover>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry, i) => (
                <TableRow key={i} className="hover:bg-muted/50 transition-all">
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>${entry.mrr.toLocaleString()}</TableCell>
                  <TableCell>{entry.growth_mrr}</TableCell>
                  <TableCell>{entry.dau.toLocaleString()}</TableCell>
                  <TableCell>{entry.growth_dau}</TableCell>
                  <TableCell>{(entry.churn * 100).toFixed(2)}%</TableCell>
                  <TableCell>${entry.ltv.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">KPI Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mrr" stroke="#2563eb" name="MRR" />
              <Line type="monotone" dataKey="dau" stroke="#059669" name="DAU" />
              <Line type="monotone" dataKey="ltv" stroke="#d97706" name="LTV" />
              <Line type="monotone" dataKey="churn" stroke="#ef4444" name="Churn" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}
