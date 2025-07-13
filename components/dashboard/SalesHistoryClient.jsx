'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';

export function SalesHistoryClient({ initialSales, users }) {
  const [sales, setSales] = useState(initialSales);
  const [date, setDate] = useState();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFilter = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (date?.from) params.append('startDate', date.from.toISOString());
    if (date?.to) params.append('endDate', date.to.toISOString());

    const res = await fetch(`/api/sales?${params.toString()}`);
    const data = await res.json();
    setSales(data);
    setIsLoading(false);
  };

  const handleReset = () => {
    setSales(initialSales);
    setUserId('');
    setDate(undefined);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by User" />
          </SelectTrigger>
          <SelectContent>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleFilter} disabled={isLoading}>{isLoading ? 'Filtering...' : 'Apply Filters'}</Button>
        <Button variant="ghost" onClick={handleReset}>Reset</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[100px]">Items</TableHead>
            <TableHead className="w-[120px] text-right">Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.user.name}</TableCell>
              <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">GHS {sale.total.toFixed(2)}</TableCell>
              <TableCell>
                <Accordion type="single" collapsible>
                  <AccordionItem value={sale.id}>
                    <AccordionTrigger>View</AccordionTrigger>
                    <AccordionContent>
                      <ul>
                        {sale.saleItems.map((item) => (
                          <li key={item.id}>
                            {item.product.name} - ({item.quantity} x GHS {item.price.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/dashboard/sales/${sale.id}/receipt`}>
                  <Button variant="outline">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}