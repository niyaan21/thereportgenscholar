// src/components/scholar-ai/PlaceholderChart.tsx
'use client';

import { TrendingUp, Image as ImageIconLucide, BarChart2, LineChart, PieChart, ScatterChart, AlertCircle } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface PlaceholderChartProps {
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'none';
  title?: string; // Made title optional
  description?: string; // Made description optional
  chartData?: Array<Record<string, any>>;
  seriesDataKeysConfig?: Array<{ key: string, label: string }>;
  categoryDataKeyConfig?: string;
}

// Default title and description if not provided by AI
const DEFAULT_CHART_TITLE = "Illustrative Data Visualization";
const DEFAULT_CHART_DESCRIPTION = "This chart visualizes AI-generated sample data related to the report section.";

export default function PlaceholderChart({
  chartType,
  title,
  description,
  chartData,
  seriesDataKeysConfig,
  categoryDataKeyConfig,
}: PlaceholderChartProps) {

  const displayTitle = title || DEFAULT_CHART_TITLE;
  const displayDescription = description || DEFAULT_CHART_DESCRIPTION;

  if (chartType === 'none') {
    return (
      <Card className="border-dashed border-border/40 bg-secondary/20 mt-3 shadow-sm flex items-center justify-center h-[260px] rounded-xl">
        <CardContent className="p-4 text-center">
          <ImageIconLucide className="h-10 w-10 text-muted-foreground mx-auto mb-2.5" />
          <p className="text-sm font-medium text-muted-foreground">No Visual Chart Suggested</p>
          <p className="text-xs text-muted-foreground/80 mt-1">The content in this section is primarily narrative or qualitative, and a specific chart visualization was not proposed by the AI.</p>
        </CardContent>
      </Card>
    );
  }

  // Validate required data for rendering a chart
  const hasValidChartData = chartData && chartData.length > 0;
  const hasValidSeriesKeys = seriesDataKeysConfig && seriesDataKeysConfig.length > 0;
  const hasValidCategoryKey = categoryDataKeyConfig && categoryDataKeyConfig.trim() !== '';

  let dataError = null;
  if (!hasValidChartData) dataError = "Chart data is missing or empty.";
  else if (!hasValidSeriesKeys) dataError = "Series data key configuration is missing or empty.";
  else if (!hasValidCategoryKey && (chartType === 'bar' || chartType === 'line' || chartType === 'pie')) dataError = "Category data key configuration is missing.";
  else if (chartType === 'scatter' && (!hasValidCategoryKey || seriesDataKeysConfig!.length < 1)) dataError = "Scatter charts require at least one series key for Y-axis and a category key for X-axis.";


  if (dataError) {
    return (
      <Card className="border-dashed border-destructive/40 bg-destructive/10 mt-3 shadow-sm flex flex-col items-center justify-center h-[260px] rounded-xl">
        <CardHeader className="pt-4 pb-2 px-4 text-center">
            <div className="mx-auto bg-destructive/20 p-2 rounded-full w-fit">
                <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <CardTitle className="text-base font-semibold text-destructive/90 mt-2">{displayTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-center">
          <p className="text-sm text-destructive/80">{dataError}</p>
          <p className="text-xs text-destructive/70 mt-1.5">The AI did not provide sufficient or correctly formatted data for this visualization.</p>
        </CardContent>
      </Card>
    );
  }

  // Dynamically generate chartConfig for ShadCN ChartContainer
  const dynamicChartConfig: ChartConfig = {};
  seriesDataKeysConfig!.forEach((series, index) => {
    dynamicChartConfig[series.key] = {
      label: series.label,
      color: `hsl(var(--chart-${(index % 5) + 1}))`, // Cycle through 5 theme chart colors
    };
  });
   // For scatter, if categoryDataKeyConfig is 'x', use seriesDataKeysConfig[0] for 'y' for config
  if (chartType === 'scatter' && categoryDataKeyConfig && seriesDataKeysConfig && seriesDataKeysConfig.length > 0) {
    if (!dynamicChartConfig[categoryDataKeyConfig]) { // Add x-axis if not already a series
        dynamicChartConfig[categoryDataKeyConfig] = { label: categoryDataKeyConfig, color: `hsl(var(--chart-1))`};
    }
    if (!dynamicChartConfig[seriesDataKeysConfig[0].key]) { // Add y-axis if not already a series (it should be)
        dynamicChartConfig[seriesDataKeysConfig[0].key] = { label: seriesDataKeysConfig[0].label, color: `hsl(var(--chart-2))`};
    }
     if (seriesDataKeysConfig.length > 1 && !dynamicChartConfig[seriesDataKeysConfig[1].key]) { // Add z-axis if present
        dynamicChartConfig[seriesDataKeysConfig[1].key] = { label: seriesDataKeysConfig[1].label, color: `hsl(var(--chart-3))`};
    }
  }


  let ChartComponent;

  switch (chartType) {
    case 'bar':
      ChartComponent = (
        <RechartsBarChartPrimitive data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey={categoryDataKeyConfig}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 10) : value} // Shorten long labels
            className="text-xs fill-muted-foreground"
          />
          <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <ChartTooltip cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {seriesDataKeysConfig!.map(series => (
            <Bar key={series.key} dataKey={series.key} fill={`var(--color-${series.key})`} radius={[4, 4, 0, 0]} barSize={chartData!.length > 10 ? 15 : 20} />
          ))}
        </RechartsBarChartPrimitive>
      );
      break;
    case 'line':
      ChartComponent = (
        <RechartsLineChartPrimitive data={chartData}>
          <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey={categoryDataKeyConfig}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 10) : value}
            className="text-xs fill-muted-foreground"
          />
          <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <ChartTooltip cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          {seriesDataKeysConfig!.map(series => (
            <Line key={series.key} type="monotone" dataKey={series.key} stroke={`var(--color-${series.key})`} strokeWidth={2.5} dot={{ r: 4, fill: `var(--color-${series.key})`, strokeWidth: 2, stroke: 'hsl(var(--background))' }} activeDot={{ r: 6 }} />
          ))}
        </RechartsLineChartPrimitive>
      );
      break;
    case 'pie':
      ChartComponent = (
        <RechartsPieChartPrimitive>
          <ChartTooltip content={<ChartTooltipContent nameKey={seriesDataKeysConfig![0].label} hideLabel />} />
          <Pie
            data={chartData}
            dataKey={seriesDataKeysConfig![0].key} // First series key is the value
            nameKey={categoryDataKeyConfig}         // Category key is the name for segments
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            strokeWidth={3}
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text x={x} y={y} fill="hsl(var(--card-foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-medium">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {chartData!.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} className="focus:outline-none focus:ring-1 focus:ring-ring/70 focus:ring-offset-1" />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: 15 }} />
        </RechartsPieChartPrimitive>
      );
      break;
    case 'scatter':
      // Expects categoryDataKeyConfig for X-axis, seriesDataKeysConfig[0].key for Y-axis, seriesDataKeysConfig[1].key for Z-axis (optional)
      const xKey = categoryDataKeyConfig!;
      const yKey = seriesDataKeysConfig![0].key;
      const zKey = seriesDataKeysConfig!.length > 1 ? seriesDataKeysConfig![1].key : undefined;

      ChartComponent = (
        <RechartsScatterChartPrimitive
          margin={{
            top: 20, right: 20, bottom: 20, left: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis type="number" dataKey={xKey} name={dynamicChartConfig[xKey]?.label?.toString() || xKey} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <YAxis type="number" dataKey={yKey} name={dynamicChartConfig[yKey]?.label?.toString() || yKey} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          {zKey && <ZAxis type="number" dataKey={zKey} range={[60, 400]} name={dynamicChartConfig[zKey]?.label?.toString() || zKey} />}
          <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Scatter name={seriesDataKeysConfig![0].label || "Dataset"} data={chartData} fill={`var(--color-${yKey})`} shape="circle" />
        </RechartsScatterChartPrimitive>
      );
      break;
    default:
      ChartComponent = <p className="text-sm text-muted-foreground p-4 text-center">Unsupported chart type: {chartType}</p>;
  }

  let iconForTitle;
  switch(chartType) {
    case 'bar': iconForTitle = <BarChart2 className="h-4 w-4 text-inherit" />; break;
    case 'line': iconForTitle = <LineChart className="h-4 w-4 text-inherit" />; break;
    case 'pie': iconForTitle = <PieChart className="h-4 w-4 text-inherit" />; break;
    case 'scatter': iconForTitle = <ScatterChart className="h-4 w-4 text-inherit" />; break;
    default: iconForTitle = <TrendingUp className="h-4 w-4 text-inherit" />;
  }


  return (
    <Card className={cn("border-dashed border-accent/50 bg-accent/10 mt-3 shadow-md hover:shadow-accent/20 transition-shadow duration-300 rounded-xl", {"animate-pulse": !ChartComponent})}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold text-accent-foreground flex items-center gap-2">
          {iconForTitle}
          {displayTitle}
        </CardTitle>
        <CardDescription className="text-xs text-accent-foreground/80 leading-snug">{displayDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 h-[270px] min-h-[270px]"> {/* Ensure min height for container */}
        <ChartContainer config={dynamicChartConfig} className="w-full h-full">
          {ChartComponent}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
