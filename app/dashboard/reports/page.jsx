'use client';

import { useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [date, setDate] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadReport = async () => {
    if (!date?.from || !date?.to) {
      toast.error("Please select a date range.");
      return;
    }

    setIsLoading(true);

    const params = new URLSearchParams();
    params.set('startDate', format(date.from, 'yyyy-MM-dd'));
    params.set('endDate', format(date.to, 'yyyy-MM-dd'));

    // We trigger the download by navigating to the API route in a new tab
    // or by creating a temporary link.
    window.open(`/api/reports/sales?${params.toString()}`, '_blank');

    setIsLoading(false);
  };

  return (
    <div className="p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Generate Sales Report</CardTitle>
          <CardDescription>Select a date range to download a CSV report of all sales in that period.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
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
          <Button onClick={handleDownloadReport} disabled={isLoading} className="w-full">
            {isLoading ? 'Generating...' : 'Generate & Download Report'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}