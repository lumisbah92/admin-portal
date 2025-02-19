'use client';

import { Box, Button, Card, CircularProgress, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import DashboardIcon from '@assets/icons/dashboard.svg';
import OnBoardingIcon from '@assets/icons/onboarding.svg';
import ArrowUp from '@assets/icons/arrow_up.svg';
import ArrowDown from '@assets/icons/arrow_down.svg';
import LineChart from './LineChart';
import BarChart from './BarChart';
import OfferListTable from './OfferListTable';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Dashboard',  path: '/', icon: <DashboardIcon /> }, 
  { label: 'Onboarding', path: '/onboarding', icon: <OnBoardingIcon /> }
];

interface DashboardStat {
  website_visits: {
    [day: string]: { desktop: number; mobile: number };
  };
  offers_sent: {
    [day: string]: number;
  };
}

export default function DashboardView() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [dashboardStat, setDashboardStat] = useState<DashboardStat | null>(null);
  const [errorStat, setErrorStat] = useState<string | null>(null);
  const [loadingStat, setLoadingStat] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!user && !storedToken) {
      router.replace('/login');
    }
    setIsCheckingAuth(false);
  }, [user, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingSummary(true);
      try {
        const response = await fetch('https://dummy-1.hiublue.com/api/dashboard/summary?filter=this-week', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!response.ok) {
          setErrorSummary('Failed to fetch dashboard summary');
          return;
        }

        const data = await response.json();
        setDashboardSummary(data);
      } catch (err: any) {
        setErrorSummary(err.message);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStat(true);
      try {
        const response = await fetch('https://dummy-1.hiublue.com/api/dashboard/stat?filter=this-week', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          setErrorStat("Failed to fetch dashboard stats");
          return;
        }
        const data = await response.json();
        setDashboardStat(data);
      } catch (err: any) {
        setErrorStat(err?.message);
      } finally {
        setLoadingStat(false);
      }
    };

    fetchStats();
  }, []);

  const cards = dashboardSummary
    ? [
      {
        title: 'Total active users',
        count: dashboardSummary.current.active_users / 1000, // Convert to "k" format
        percentage: Math.round(
          ((dashboardSummary.current.active_users - dashboardSummary.previous.active_users) / dashboardSummary.previous.active_users) * 100
        ),
      },
      {
        title: 'Total clicks',
        count: dashboardSummary.current.clicks / 1000,
        percentage: Math.round(
          ((dashboardSummary.current.clicks - dashboardSummary.previous.clicks) / dashboardSummary.previous.clicks) * 100
        ),
      },
      {
        title: 'Total appearances',
        count: dashboardSummary.current.appearance / 1000,
        percentage: Math.round(
          ((dashboardSummary.current.appearance - dashboardSummary.previous.appearance) / dashboardSummary.previous.appearance) * 100
        ),
      },
    ]
    : [];


  if (isCheckingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: 280, height: '100vh', backgroundColor: 'background.default', borderRight: '1px solid', borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: 80, display: 'flex', alignItems: 'center', pl: 2 }}>
          <Image src="/assets/images/logo.png" alt="Logo" width={40} height={40} />
        </Box>
        <List>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled', p: 2 }}>Overview</Typography>
          {navItems.map(({ label, path, icon }) => <ListItem key={label} disablePadding>
            <ListItemButton onClick={() => router.push(path)}>
              {icon} <ListItemText primary={<Typography variant="subtitle2" color="text.secondary">{label}</Typography>} />
            </ListItemButton>
          </ListItem>
          )}
        </List>
      </Box>
      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #FFFFFF', borderColor: 'white', pr: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Image src="/assets/images/profile.png" alt="profile" width={40} height={40} style={{ cursor: 'pointer' }} onClick={() => setDropdownOpen((prev) => !prev)} />
            {dropdownOpen && (
              <Box sx={{ position: 'absolute', top: '100%', right: 0, mt: 1, p: 1, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 1, zIndex: 1, }} >
                <Button onClick={logout} fullWidth>Logout</Button>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>Dashboard</Typography>
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
          {loadingStat ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }} >
              <CircularProgress />
            </Box>
          ) : errorStat ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }} >
              <Typography color="error">{errorStat}</Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 2 }}>
              {dashboardStat && (
                <>
                  <BarChart websiteVisits={dashboardStat.website_visits} />
                  <LineChart offersSent={dashboardStat.offers_sent} />
                </>
              )}
            </Box>
          )}
          <OfferListTable />
        </Box>
      </Box>
    </Box>
  );
}


