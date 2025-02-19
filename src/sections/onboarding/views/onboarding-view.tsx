'use client';

import { Box, Button, CircularProgress, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import DashboardIcon from '@assets/icons/dashboard.svg';
import OnBoardingIcon from '@assets/icons/onboarding.svg';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import CreateOffer from './CreateOffer';

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
      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <CreateOffer/>
        </Box>
      </Box>
    </Box>
  );
}