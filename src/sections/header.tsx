'use client';

import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    dropdownOpen: boolean;
    setDropdownOpen: (dropdownOpen: boolean) => void;
    logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ dropdownOpen, setDropdownOpen, logout }) => {
    const router = useRouter();

    return (
        <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, width: '100%', height: 72, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
            <Box sx={{ height: 80, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <Image src="/assets/images/logo.png" alt="Logo" width={40} height={40} />
                </Box>
            </Box>
            <Box position={'relative'} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <Button onClick={() => router.push('/')} variant="text" sx={{ color: 'text.secondary' }}>Dashboard</Button>
                    <Button onClick={() => router.push('/onboarding')} variant="text" sx={{ color: 'text.secondary' }}>Onboarding</Button>
                </Box>
                <Image src="/assets/images/profile.png" alt="profile" width={40} height={40} style={{ cursor: 'pointer' }} onClick={() => setDropdownOpen(!dropdownOpen)} />
                {dropdownOpen && (
                    <Box sx={{ position: 'absolute', top: '100%', right: 0, mt: 1, p: 1, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 1, zIndex: 1, }} >
                        <Button onClick={logout} fullWidth>Logout</Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Header;

