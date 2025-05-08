// src/components/scholar-ai/PlaceholderChart.tsx
'use client';

import { TrendingUp, Image as ImageIconLucide } from 'lucide-react';
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
  BarChart as RechartsBarChartPrimitive,
  LineChart as RechartsLineChartPrimitive,
  PieChart as RechartsPieChartPrimitive,
  ScatterChart as RechartsScatterChartPrimitive,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend, 
  ChartLegendContent 
} from '@/components/ui/chart';

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


export default function PlaceholderChart({ chartType, title, description }: PlaceholderChartProps) {
  if (chartType === 'none') {
    return (
        <Card className="border-dashed border-border/30 bg-secondary/10 mt-3 shadow-sm flex items-center justify-center h-[260px]">
            <CardContent className="p-4 text-center">
                <ImageIconLucide className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No specific chart suggested for this section.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Data may be qualitative or narrative.</p>
            </CardContent>
        </Card>
    );
  }

  let ChartComponent;

  switch (chartType) {
    case 'bar':
      ChartComponent = (
        <RechartsBarChartPrimitive data={commonSampleData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            className="text-xs fill-muted-foreground"
          />
          <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <ChartTooltip cursor={{fill: 'hsl(var(--accent) / 0.1)'}} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} barSize={20} />
        </RechartsBarChartPrimitive>
      );
      break;
    case 'line':
      ChartComponent = (
        <RechartsLineChartPrimitive data={commonSampleData}>
          <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
            className="text-xs fill-muted-foreground"
          />
          <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <ChartTooltip cursor={{stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-desktop)', strokeWidth:2, stroke: 'hsl(var(--background))' }} activeDot={{r: 6}} />
          <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-mobile)', strokeWidth:2, stroke: 'hsl(var(--background))' }} activeDot={{r: 6}} />
        </RechartsLineChartPrimitive>
      );
      break;
    case 'pie':
      ChartComponent = (
        <RechartsPieChartPrimitive>
          <ChartTooltip content={<ChartTooltipContent nameKey="visitors" hideLabel />} />
          <Pie data={pieSampleData} dataKey="visitors" nameKey="browser" cx="50%" cy="50%" innerRadius={55} outerRadius={85} strokeWidth={3}
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text x={x} y={y} fill="hsl(var(--background))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-medium">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {pieSampleData.map((entry) => (
              <Cell key={`cell-${entry.browser}`} fill={entry.fill} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
            ))}
          </Pie>
           <ChartLegend content={<ChartLegendContent />} wrapperStyle={{paddingTop: 15}} />
        </RechartsPieChartPrimitive>
      );
      break;
    case 'scatter':
      ChartComponent = (
        <RechartsScatterChartPrimitive
          margin={{
            top: 20, right: 20, bottom: 20, left: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50"/>
          <XAxis type="number" dataKey="x" name="Stature" unit="cm" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <YAxis type="number" dataKey="y" name="Weight" unit="kg" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <ZAxis type="number" dataKey="z" range={[60, 400]} name="Score" unit="pts" />
          <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Scatter name="Sample Dataset" data={scatterSampleData} fill="var(--color-value)" shape="circle" />
        </RechartsScatterChartPrimitive>
      );
      break;
    default:
      ChartComponent = <p className="text-sm text-muted-foreground p-4 text-center">Unsupported chart type: {chartType}</p>;
  }

  return (
    <Card className="border-dashed border-accent/40 bg-accent/5 mt-3 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold text-accent-foreground">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground leading-snug">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 h-[270px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          {ChartComponent}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
