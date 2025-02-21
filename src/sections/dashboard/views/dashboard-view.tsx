'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import DashboardIcon from '@assets/icons/dashboard.svg';
import OnBoardingIcon from '@assets/icons/onboarding.svg';
import OfferListTable from '../offer-list';
import { useAuth } from '@/contexts/AuthContext';
import { JSX, useEffect, useState } from 'react';
import SideBar from '@/sections/sidebar';
import Header from '@/sections/header';
import DashboardSummary from '../dashboard-summary';
import DashboardStat from '../dashboard-stat';

export interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

export type DashboardSummaryType = {
  title: string;
  count: number;
  percentage: number;
};

export interface DashboardStatType {
  website_visits: {
    [day: string]: { desktop: number; mobile: number };
  };
  offers_sent: {
    [day: string]: number;
  };
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Onboarding', path: '/onboarding', icon: <OnBoardingIcon /> }
];

export default function DashboardView() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [dashboardStat, setDashboardStat] = useState<DashboardStatType | null>(null);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar navItems={navItems} />
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} logout={logout} />
        <Box sx={{ width: '100%', height: '100%', flex: 1, overflowX: 'hidden', overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>Dashboard</Typography>
          <DashboardSummary loadingSummary={loadingSummary} errorSummary={errorSummary} cards={cards} />
          <DashboardStat loadingStat={loadingStat} errorStat={errorStat} dashboardStat={dashboardStat} />
          <OfferListTable />
        </Box>
      </Box>
    </Box>
  );
}



