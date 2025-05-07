'use client';

import { BarChart, LineChart, PieChart, ScatterChart, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Line,
  Pie,
  Cell,
  Scatter,
  ZAxis,
  BarChart as RechartsBarChartPrimitive, // Renamed import
  LineChart as RechartsLineChartPrimitive, // Renamed import
  PieChart as RechartsPieChartPrimitive, // Renamed import
  ScatterChart as RechartsScatterChartPrimitive, // Renamed import
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

interface PlaceholderChartProps {
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'none';
  title: string;
  description: string;
}

const commonSampleData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const pieSampleData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const scatterSampleData = [
  { x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 },
];


const chartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' },
  mobile: { label: 'Mobile', color: 'hsl(var(--chart-2))' },
  chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
  safari: { label: "Safari", color: "hsl(var(--chart-2))" },
  firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
  edge: { label: "Edge", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
  value: { label: 'Value', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function PlaceholderChart({ chartType, title, description }: PlaceholderChartProps) {
  if (chartType === 'none') {
    return null;
  }

  let ChartComponent;

  switch (chartType) {
    case 'bar':
      ChartComponent = (
        <ResponsiveContainer width="100%" height={250}>
          <RechartsBarChartPrimitive data={commonSampleData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <RechartsLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </RechartsBarChartPrimitive>
        </ResponsiveContainer>
      );
      break;
    case 'line':
      ChartComponent = (
        <ResponsiveContainer width="100%" height={250}>
          <RechartsLineChartPrimitive data={commonSampleData}>
            <CartesianGrid horizontal={true} vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <RechartsLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={true} />
            <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={true} />
          </RechartsLineChartPrimitive>
        </ResponsiveContainer>
      );
      break;
    case 'pie':
      ChartComponent = (
        <ResponsiveContainer width="100%" height={250}>
          <RechartsPieChartPrimitive>
            <ChartTooltip content={<ChartTooltipContent nameKey="visitors" hideLabel />} />
            <Pie data={pieSampleData} dataKey="visitors" nameKey="browser" cy="50%" innerRadius={60} outerRadius={80} strokeWidth={5}>
              {pieSampleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
             <RechartsLegend content={<ChartLegendContent />} />
          </RechartsPieChartPrimitive>
        </ResponsiveContainer>
      );
      break;
    case 'scatter':
      ChartComponent = (
        <ResponsiveContainer width="100%" height={250}>
          <RechartsScatterChartPrimitive
            margin={{
              top: 20, right: 20, bottom: 20, left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="stature" unit="cm" />
            <YAxis type="number" dataKey="y" name="weight" unit="kg" />
            <ZAxis type="number" dataKey="z" range={[60, 400]} name="score" unit="points" />
            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
            <RechartsLegend content={<ChartLegendContent />} />
            <Scatter name="Sample Dataset" data={scatterSampleData} fill="var(--color-value)" />
          </RechartsScatterChartPrimitive>
        </ResponsiveContainer>
      );
      break;
    default:
      ChartComponent = <p className="text-sm text-muted-foreground">Unsupported chart type: {chartType}</p>;
  }

  return (
    <Card className="border-dashed border-accent/30 bg-accent/5 mt-2 shadow-sm">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium text-accent-foreground">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground leading-tight">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 h-[260px]"> {/* Fixed height for consistency */}
        <ChartContainer config={chartConfig} className="w-full h-full">
          {ChartComponent}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
