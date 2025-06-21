
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
import type { GenerateResearchReportOutput } from '@/ai/flows/generate-research-report'; // To get ChartSuggestion type

// Infer ChartSuggestion type from a specific part of GenerateResearchReportOutput
type ChartSuggestion = Exclude<Exclude<GenerateResearchReportOutput['resultsAndAnalysis'], undefined>[number]['chartSuggestion'], undefined>;

interface PlaceholderChartProps {
  chartSuggestion?: ChartSuggestion; // Make chartSuggestion optional but typed
  pdfChartId?: string;
}

const DEFAULT_CHART_TITLE = "Illustrative Data Visualization";
const DEFAULT_CHART_DESCRIPTION = "This chart visualizes AI-generated sample data related to the report section.";

export default function PlaceholderChart({
  chartSuggestion,
  pdfChartId,
}: PlaceholderChartProps) {

  if (!chartSuggestion || chartSuggestion.type === 'none') {
    return (
      <Card id={pdfChartId} className="border-dashed border-border/40 bg-secondary/20 mt-3 shadow-sm flex items-center justify-center h-[260px] rounded-xl">
        <CardContent className="p-4 text-center">
          <ImageIconLucide className="h-10 w-10 text-muted-foreground mx-auto mb-2.5" />
          <p className="text-sm font-medium text-muted-foreground">No Visual Chart Suggested</p>
          <p className="text-xs text-muted-foreground/80 mt-1">The content in this section is primarily narrative or qualitative, and a specific chart visualization was not proposed by the AI.</p>
        </CardContent>
      </Card>
    );
  }

  const {
    type: chartType,
    title,
    dataDescription: description,
    data: rawChartDataString,
    seriesDataKeys: rawSeriesDataKeysString,
    categoryDataKey: categoryDataKeyConfig,
  } = chartSuggestion;

  const displayTitle = title || DEFAULT_CHART_TITLE;
  const displayDescription = description || DEFAULT_CHART_DESCRIPTION;

  let chartData: Record<string, string>[] | undefined | null = null;
  let seriesDataKeysConfig: { key: string; label: string }[] | undefined | null = null;
  let dataError: string | null = null;

  if (chartType !== 'none') {
    // Parse seriesDataKeys first
    if (rawSeriesDataKeysString && typeof rawSeriesDataKeysString === 'string') {
        try {
            const parsed = JSON.parse(rawSeriesDataKeysString);
            if (Array.isArray(parsed) && parsed.every(item => item && typeof item.key === 'string' && typeof item.label === 'string')) {
                seriesDataKeysConfig = parsed;
            } else {
                dataError = "AI-generated seriesDataKeys is not a valid JSON string of key/label objects.";
            }
        } catch (e) {
            dataError = "Failed to parse AI-generated seriesDataKeys JSON string.";
        }
    }

    // Parse chartData
    if (!dataError && rawChartDataString && typeof rawChartDataString === 'string') {
      try {
        const parsedData = JSON.parse(rawChartDataString);
        if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'object' && item !== null && Object.values(item).every(val => typeof val === 'string' || typeof val === 'number'))) {
          // Convert all values to string for consistency
          chartData = parsedData.map(item =>
            Object.entries(item).reduce((acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            }, {} as Record<string, string>)
          );
        } else {
          dataError = "AI-generated sample data string is not a valid JSON array of objects.";
        }
      } catch (e) {
        dataError = "Failed to parse AI-generated sample data JSON string.";
        console.error("Chart data parsing error:", e, "Raw data string:", rawChartDataString);
      }
    }

    if (!dataError && (!chartData || chartData.length === 0)) {
      dataError = "AI-generated sample data is missing or empty after parsing.";
    }
  }


  const hasValidSeriesKeys = seriesDataKeysConfig && Array.isArray(seriesDataKeysConfig) && seriesDataKeysConfig.length > 0 && seriesDataKeysConfig.every(s => s && s.key && s.label);
  const hasValidCategoryKey = (chartType === 'scatter' && chartData && seriesDataKeysConfig && seriesDataKeysConfig[0]?.key) || (categoryDataKeyConfig && categoryDataKeyConfig.trim() !== '');

  if (chartType !== 'none' && !dataError) {
    if (!hasValidSeriesKeys) dataError = "AI-provided series data key configuration is missing or empty.";
    else if (!hasValidCategoryKey && (chartType === 'bar' || chartType === 'line' || chartType === 'pie')) dataError = "AI-provided category data key configuration is missing.";
    else if (chartType === 'scatter' && (!categoryDataKeyConfig || seriesDataKeysConfig!.length < 1)) {
        dataError = "Scatter charts require at least one series key for Y-axis values and a category key for X-axis values from the AI's sample data.";
    }
  }


  if (dataError && chartType !== 'none') {
    return (
      <Card id={pdfChartId} className="border-dashed border-destructive/40 bg-destructive/10 mt-3 shadow-sm flex flex-col items-center justify-center h-[260px] rounded-xl">
        <CardHeader className="pt-4 pb-2 px-4 text-center">
            <div className="mx-auto bg-destructive/20 p-2 rounded-full w-fit">
                <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <CardTitle className="text-base font-semibold text-destructive/90 mt-2">{displayTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-center">
          <p className="text-sm text-destructive/80">{dataError}</p>
          <p className="text-xs text-destructive/70 mt-1.5">The AI did not provide sufficient or correctly formatted data/configuration for this visualization.</p>
        </CardContent>
      </Card>
    );
  }


  const dynamicChartConfig: ChartConfig = {};
  if(seriesDataKeysConfig) {
    seriesDataKeysConfig.forEach((series, index) => {
        dynamicChartConfig[series.key] = {
        label: series.label,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
        };
    });
  }

  if (chartType === 'pie' && categoryDataKeyConfig && !dynamicChartConfig[categoryDataKeyConfig]) {
      dynamicChartConfig[categoryDataKeyConfig] = {
          label: categoryDataKeyConfig.charAt(0).toUpperCase() + categoryDataKeyConfig.slice(1),
          color: `hsl(var(--chart-1))`
      }
  }
  if (chartType === 'scatter' && categoryDataKeyConfig && seriesDataKeysConfig && seriesDataKeysConfig.length > 0) {
    if (categoryDataKeyConfig && !dynamicChartConfig[categoryDataKeyConfig]) {
        dynamicChartConfig[categoryDataKeyConfig] = { label: categoryDataKeyConfig, color: `hsl(var(--chart-1))`};
    }
    if (seriesDataKeysConfig[0] && seriesDataKeysConfig[0].key && !dynamicChartConfig[seriesDataKeysConfig[0].key]) {
        dynamicChartConfig[seriesDataKeysConfig[0].key] = { label: seriesDataKeysConfig[0].label, color: `hsl(var(--chart-2))`};
    }
     if (seriesDataKeysConfig.length > 1 && seriesDataKeysConfig[1] && seriesDataKeysConfig[1].key && !dynamicChartConfig[seriesDataKeysConfig[1].key]) {
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
            tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 10) : value}
            className="text-xs fill-muted-foreground"
          />
          <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <ChartTooltip cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {seriesDataKeysConfig!.map(series => (
            <Bar key={series.key} dataKey={series.key} fill={`var(--color-${series.key})`} radius={[4, 4, 0, 0]} barSize={chartData && chartData.length > 10 ? 15 : 20} name={series.label}/>
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
            <Line key={series.key} type="monotone" dataKey={series.key} stroke={`var(--color-${series.key})`} strokeWidth={2.5} dot={{ r: 4, fill: `var(--color-${series.key})`, strokeWidth: 2, stroke: 'hsl(var(--background))' }} activeDot={{ r: 6 }} name={series.label} />
          ))}
        </RechartsLineChartPrimitive>
      );
      break;
    case 'pie':
      const valueKeyPie = seriesDataKeysConfig && seriesDataKeysConfig[0] ? seriesDataKeysConfig[0].key : 'value';
      const nameKeyPie = categoryDataKeyConfig || 'name';
      ChartComponent = (
        <RechartsPieChartPrimitive>
          <ChartTooltip content={<ChartTooltipContent nameKey={nameKeyPie} hideLabel />} />
          <Pie
            data={chartData}
            dataKey={valueKeyPie}
            nameKey={nameKeyPie}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            strokeWidth={3}
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text x={x} y={y} fill="hsl(var(--card-foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-medium">
                  {`${name}: ${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {chartData!.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} className="focus:outline-none focus:ring-1 focus:ring-ring/70 focus:ring-offset-1" />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey={nameKeyPie}/>} wrapperStyle={{ paddingTop: 15 }} />
        </RechartsPieChartPrimitive>
      );
      break;
    case 'scatter':
      const xKeyScatter = categoryDataKeyConfig!;
      const yKeyScatter = seriesDataKeysConfig![0].key;
      const zKeyScatter = seriesDataKeysConfig!.length > 1 ? seriesDataKeysConfig![1].key : undefined;

      ChartComponent = (
        <RechartsScatterChartPrimitive
          margin={{
            top: 20, right: 20, bottom: 20, left: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis type="number" dataKey={xKeyScatter} name={dynamicChartConfig[xKeyScatter]?.label?.toString() || xKeyScatter} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          <YAxis type="number" dataKey={yKeyScatter} name={dynamicChartConfig[yKeyScatter]?.label?.toString() || yKeyScatter} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
          {zKeyScatter && <ZAxis type="number" dataKey={zKeyScatter} range={[60, 400]} name={dynamicChartConfig[zKeyScatter!]?.label?.toString() || zKeyScatter} />}
          <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Scatter name={seriesDataKeysConfig![0].label || "Dataset"} data={chartData} fill={`var(--color-${yKeyScatter})`} shape="circle" />
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
    <Card id={pdfChartId} className={cn("border-dashed border-accent/50 bg-accent/10 mt-3 shadow-md hover:shadow-accent/20 transition-shadow duration-300 rounded-xl", {"animate-pulse": !ChartComponent && chartType !== 'none'})}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold text-accent-foreground flex items-center gap-2">
          {iconForTitle}
          {displayTitle}
        </CardTitle>
        <CardDescription className="text-xs text-accent-foreground/80 leading-snug">{displayDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 h-[270px] min-h-[270px]">
        <ChartContainer config={dynamicChartConfig} className="w-full h-full">
          {ChartComponent}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
