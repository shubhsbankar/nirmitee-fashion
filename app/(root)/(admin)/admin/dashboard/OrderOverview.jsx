"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"

export const description = "A bar chart"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
} 

export function OrderOverview() {
  const [chartData, setChartData] = useState([]);
  const { data: monthlySales, loading } = useFetch('/api/dashboard/admin/monthly-sales');
  useEffect(() => {
    if (monthlySales && monthlySales.success) {
      const getChartData = months.map((month, index) => {
        const monthData = monthlySales.data.find(item => item._id.month === index + 1);
        return {
          month,
          amount: monthData ? monthData?.totalSales : 0
        }
      console.log('monthData',monthData);
      
      });
      setChartData(getChartData);

      console.log('monthlySales',monthlySales);
      
      console.log('getChartData',getChartData);
      
    }
  }, [monthlySales]);

  
  return (
 <div>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      </div>
  
  )
}
