'use client';

import * as React from 'react';
import { Box, Button, Checkbox, CssBaseline, FormControlLabel, FormLabel, FormControl, Link, TextField, Typography, Stack, Card as MuiCard, styled } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ForgotPassword from '../forgot-password';

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignIn() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isOpenForgetPassword, setIsOpenForgetPassword] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/'); // Redirect after successful login
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      {isOpenForgetPassword && <ForgotPassword open={isOpenForgetPassword} handleClose={() => setIsOpenForgetPassword(false)} /> }
      <CssBaseline />
      <SignInContainer>
        <Card variant="outlined">
                    <Typography component="h1" variant="h4" sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}>Sign in</Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{mt: 1}}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                name="password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{mt: 1}}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button type="submit" fullWidth variant="contained">Sign in</Button>
                        <Link onClick={() => setIsOpenForgetPassword(true)} component="button" type="button" variant="body2" sx={{alignSelf: 'center'}}>Forgot your password?</Link>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
}