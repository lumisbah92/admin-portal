'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Autocomplete, Box, Button, Card, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, TextField, Typography, Snackbar } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface User {
    id: number;
    name: string;
    email: string;
}

const OfferSchema = z.object({
    plan_type: z.enum(['monthly', 'yearly', 'pay_as_you_go'], {
        required_error: 'Plan type is required',
    }),
    additions: z.array(z.enum(['refundable', 'on_demand', 'negotiable']))
        .min(1, { message: 'At least one addition is required' }),
    user: z.object({
        id: z.number({ required_error: 'User id is required' }),
        name: z.string({ required_error: 'User name is required' }),
        email: z.string({ required_error: 'User email is required' }),
    }, { required_error: 'User is required' }),
    expired: z.preprocess(
        (val) => {
            if (val instanceof Date) return val;
            if (typeof val === 'string' && val.trim() !== '') return new Date(val);
            return undefined;
        },
        z.date().refine(
            (date) => !isNaN(date.getTime()),
            { message: 'Invalid date provided' }
        ).refine(
            (date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date >= today;
            },
            { message: 'Expired date should not be before today' }
        )
    ),
    price: z.number({ required_error: 'Price is required' }),
});


type OfferFormData = z.infer<typeof OfferSchema>;

const CreateOffer: React.FC = () => {
    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<OfferFormData>({
        resolver: zodResolver(OfferSchema),
        defaultValues: {
            plan_type: undefined,
            additions: [],
            user: { id: 0, name: '', email: '' },
            expired: new Date(),
            price: undefined,
        },
    });

    const [users, setUsers] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [offerSent, setOfferSent] = useState(false);
    const [isUserNull, setIsUserNull] = useState(false);

    useEffect(() => {
        if (!inputValue) {
            setUsers([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const fetchUsers = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`https://dummy-1.hiublue.com/api/users?search=${inputValue}&page=1&per_page=5`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    const data = await response.json();
                    setUsers(data.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    const onSubmit = async (data: OfferFormData) => {
        if(data.user.id === 0) {
            setIsUserNull(true);
            setTimeout(() => setIsUserNull(false), 2000);
            return;
        }
        console.log('Validated Data:', data);
        const payload = {
            plan_type: data.plan_type,
            additions: data.additions,
            user_id: data.user!.id,
            expired: data.expired,
            price: data.price,
        };

        try {
            const response = await fetch('https://dummy-1.hiublue.com/api/offers', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error('Error submitting offer:', response.statusText);
            } else {
                const result = await response.json();
                console.log('Offer submitted successfully:', result);
                setOfferSent(true);
                setTimeout(() => setOfferSent(false), 2000);
            }
        } catch (error) {
            console.error('Error submitting offer:', error);
        }
    };

    useEffect(() => {
        if (offerSent) {
            reset();
        }
    }, [offerSent, reset]);

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 720, width: '100%', m: '0 auto' }}>
            <Card
                sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <Box sx={{ height: 102, display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', borderBottom: '1px solid', borderColor: 'divider', px: 4 }}>
                    <Typography variant="h6">Create Offer</Typography>
                    <Typography variant="body2" color='text-secondary'>Send onboarding offer to new user</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
                    <FormControl component="fieldset">
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Plan Type</Typography>
                        <Controller
                            name="plan_type"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup row value={field.value || ''} onChange={field.onChange} sx={{ mt: 1 }}>
                                    <FormControlLabel
                                        value="pay_as_you_go"
                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { color: field.value === 'pay_as_you_go' ? '#00A76F' : '#637381' } }} />}
                                        label="Pay As You Go"
                                    />
                                    <FormControlLabel
                                        value="monthly"
                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { color: field.value === 'monthly' ? '#00A76F' : '#637381' } }} />}
                                        label="Monthly"
                                    />
                                    <FormControlLabel
                                        value="yearly"
                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { color: field.value === 'yearly' ? '#00A76F' : '#637381' } }} />}
                                        label="Yearly"
                                    />
                                </RadioGroup>
                            )}
                        />
                        {errors.plan_type && <Typography color="error">{errors.plan_type.message}</Typography>}
                    </FormControl>

                    <FormControl component="fieldset">
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Additions</Typography>
                        <FormGroup row sx={{ mt: 1 }}>
                            {['refundable', 'on_demand', 'negotiable'].map((option) => (
                                <FormControlLabel
                                    key={option}
                                    control={
                                        <Controller
                                            name="additions"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    checked={field.value.includes(option as any)}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...field.value, option]
                                                            : field.value.filter((val) => val !== option);
                                                        field.onChange(newValue);
                                                    }}
                                                    sx={{ '& .MuiSvgIcon-root': { color: field.value.includes(option as any) ? '#00A76F' : '#637381' } }}
                                                />
                                            )}
                                        />
                                    }
                                    label={option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                                />
                            ))}
                        </FormGroup>
                        {errors.additions && <Typography color="error">{errors.additions.message}</Typography>}
                    </FormControl>

                    <FormControl fullWidth sx={{ gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>User</Typography>
                        <Controller
                            name="user"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                    options={users}
                                    getOptionLabel={(option) => option.name}
                                    filterOptions={(x) => x}
                                    loading={loading}
                                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                                    onChange={(event, newValue) => onChange(newValue)}
                                    value={value || null}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder='User'
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                        {isUserNull && <Typography color="error">User is Required</Typography>}
                    </FormControl>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Expired</Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Controller
                                name="expired"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        format="dd MMM yyyy"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                InputLabelProps: { shrink: true }
                                            },
                                        }}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.expired && <Typography color="error">{errors.expired.message}</Typography>}
                        </LocalizationProvider>
                    </Box>

                    <FormControl fullWidth error={!!errors.price} sx={{ gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Price</Typography>
                        <TextField
                            type="number"
                            placeholder='$   Price'
                            {...register('price', { valueAsNumber: true })}
                            // helperText={errors.price ? errors.price.message : ''}
                        />
                         {errors.price && <Typography color="error">{errors.price.message}</Typography>}
                    </FormControl>
                </Box>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button sx={{ width: 111, height: 48, bgcolor: '#1C252E' }} variant="contained" type="submit" fullWidth>
                    {offerSent ? 'Offer Sent' : 'Send Offer'}
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={offerSent}
                    autoHideDuration={2000}
                    message="Offer Sent successfully"
                    ContentProps={{
                        sx: { bgcolor: 'success.main' }
                    }}
                />
            </Box>
        </Box>
    );
};

export default CreateOffer;


