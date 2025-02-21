'use client';

import React, { FC } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface LineChartProps {
  offersSent: {
    [day: string]: number;
  };
}

const LineChart: FC<LineChartProps> = ({ offersSent }) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const offersData = days.map((day) => offersSent[day] || 0);

  const series = [
    { name: 'Offers sent', data: offersData },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: true } },
    stroke: { curve: 'smooth', width: 3, colors: ['#1C252E'] },
    xaxis: { categories: labels, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: undefined } } },
    yaxis: { min: 0, max: Math.max(...offersData) + 5, tickAmount: 5 },
    grid: { borderColor: '#E0E0E0', strokeDashArray: 4 },
    markers: { size: 0 },
    tooltip: { enabled: false },
    legend: { show: false },
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>Offers sent</Typography>
          <ReactApexChart options={options} series={series} type="line" />
        </CardContent>
      </Card>
    </Box>
  );
};

export default LineChart;

