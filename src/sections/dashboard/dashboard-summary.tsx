'use client';

import { Box, Card, CircularProgress, Typography } from '@mui/material';
import ArrowUp from '@assets/icons/arrow_up.svg';
import ArrowDown from '@assets/icons/arrow_down.svg';
import { DashboardSummaryType } from './views/dashboard-view';

interface DashboardSummaryProps {
    loadingSummary: boolean;
    errorSummary: string | null;
    cards: DashboardSummaryType[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ loadingSummary, errorSummary, cards }) => {

    return (
        <>
            {loadingSummary ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }} >
                    <CircularProgress />
                </Box>
            ) : errorSummary ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }} >
                    <Typography color="error">{errorSummary}</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            sx={{
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 148, flex: 1, borderRadius: 2, boxShadow: 2, bgcolor: '#FFFFFF', p: 3,
                                transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 3 },
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>{card.title}</Typography>
                            <Typography variant="h3" sx={{ color: 'text.primary' }}>{card.count}k</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {card.percentage < 0 ? <ArrowDown /> : <ArrowUp />}
                                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>{Math.abs(card.percentage)}%</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>previous month</Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}
        </>
    );
};

export default DashboardSummary;

