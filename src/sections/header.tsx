'use client';

import { Box, Button } from '@mui/material';
import Image from 'next/image';

interface HeaderProps {
    dropdownOpen: boolean;
    setDropdownOpen: (dropdownOpen: boolean) => void;
    logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ dropdownOpen, setDropdownOpen, logout }) => {

    return (
        <Box sx={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #FFFFFF', borderColor: 'white', pr: 2 }}>
            <Box sx={{ position: 'relative' }}>
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

