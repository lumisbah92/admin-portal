'use client';

import React, { FC } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarChartProps {
    websiteVisits: {
        [day: string]: { desktop: number; mobile: number };
    };
}

const BarChart: FC<BarChartProps> = ({ websiteVisits }) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const desktopData = days.map((day) => websiteVisits[day]?.desktop || 0);
    const mobileData = days.map((day) => websiteVisits[day]?.mobile || 0);

    const series = [
        {
            name: 'Desktop',
            data: desktopData,
        },
        {
            name: 'Mobile',
            data: mobileData,
        },
    ];

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '20px',
            },
        },
        colors: ['#007867', '#FFAB00'],
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: labels,
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            min: 0,
            max: Math.max(...desktopData, ...mobileData) + 10,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            markers: {
                shape: 'circle',
            },
            labels: {
                colors: 'text.primary',
            },
        },
        grid: {
            borderColor: '#E0E0E0',
            strokeDashArray: 4,
        },
    };

    return (
        <Box sx={{ flex: 1 }}>
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                        Website visits
                    </Typography>
                    <ReactApexChart type="bar" series={series} options={options} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default BarChart;
