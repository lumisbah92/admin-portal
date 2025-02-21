'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import BarChart from './bar-chart';
import LineChart from './line-chart';
import { DashboardStatType } from './views/dashboard-view';

interface DashboardStatProps {
    loadingStat: boolean;
    errorStat: string | null;
    dashboardStat: DashboardStatType | null;
}

const DashboardStat: React.FC<DashboardStatProps> = ({ loadingStat, errorStat, dashboardStat }) => {

    return (
        <>
            {loadingStat ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }} >
                    <CircularProgress />
                </Box>
            ) : errorStat ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }} >
                    <Typography color="error">{errorStat}</Typography>
                </Box>
            ) : (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: {xs: 'column', lg:'row'}, gap: 2 }}>
                    {dashboardStat && (
                        <>
                            <BarChart websiteVisits={dashboardStat.website_visits} />
                            <LineChart offersSent={dashboardStat.offers_sent} />
                        </>
                    )}
                </Box>
            )}
        </>
    );
};

export default DashboardStat;

