'use client';

import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

import DashboardIcon from '@assets/icons/dashboard.svg';
import OnBoardingIcon from '@assets/icons/onboarding.svg';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import CreateOffer from '../CreateOffer';
import SideBar from '@/sections/sidebar';
import Header from '@/sections/header';

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Onboarding', path: '/onboarding', icon: <OnBoardingIcon /> }
];

export default function OnboardingView() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!user && !storedToken) {
      router.replace('/login');
    }
    setIsCheckingAuth(false);
  }, [user, router]);

  if (isCheckingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar navItems={navItems} />
      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Header dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} logout={logout} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <CreateOffer/>
        </Box>
      </Box>
    </Box>
  );
}