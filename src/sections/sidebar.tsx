'use client';

import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import Image from 'next/image';
import { NavItem } from './dashboard/views/dashboard-view';
import { useRouter } from 'next/navigation';

interface SideBarProps {
  navItems: NavItem[];
}

const SideBar: React.FC<SideBarProps> = ({ navItems }) => {
  const router = useRouter();

  return (
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
  );
};

export default SideBar;
