
'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, RechartsPrimitive } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { PieChart as PieChartIcon } from 'lucide-react';

interface ActivityChartData {
    name: string;
    value: number;
    fill: string;
}

interface ActivityDistributionChartProps {
    activityChartData: ActivityChartData[];
    chartConfig: ChartConfig;
}

export default function ActivityDistributionChart({ activityChartData, chartConfig }: ActivityDistributionChartProps) {
    if (!activityChartData || activityChartData.length === 0) {
        return null;
    }
    
    return (
        <section className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 sm:mb-6 flex items-center">
            <PieChartIcon className="mr-3 h-7 w-7 text-accent" />
            Activity Distribution
          </h2>
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-primary/90">Activity Types</CardTitle>
              <CardDescription className="text-sm">Breakdown of your research activities.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[350px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
                  <RechartsPrimitive.PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <RechartsPrimitive.Pie
                      data={activityChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="hsl(var(--card-foreground))"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            className="text-xs font-medium"
                          >
                            {`${activityChartData[index].name} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                        );
                      }}
                    >
                      {activityChartData.map((entry) => (
                        <RechartsPrimitive.Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                    </RechartsPrimitive.Pie>
                     <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  </RechartsPrimitive.PieChart>
                </RechartsPrimitive.ResponsiveContainer>
              </ChartContainer>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">Chart reflects locally stored activity data.</p>
             </CardFooter>
          </Card>
        </section>
    );
}
