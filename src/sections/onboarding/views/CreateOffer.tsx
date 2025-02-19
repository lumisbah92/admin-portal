'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Autocomplete, Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
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
    additions: z.array(z.enum(['refundable', 'on_demand', 'negotiable'])),
    user: z
        .object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
        })
        .nullable()
        .refine((val) => val !== null, { message: 'User is required' }),
    expired: z.preprocess(
        (val) => {
            if (val instanceof Date) return val.toISOString().split('T')[0];
            return val;
        },
        z.string({ required_error: 'Expired date is required' })
    ),
    price: z.number({ required_error: 'Price is required' }),
});

type OfferFormData = z.infer<typeof OfferSchema>;

const CreateOffer: React.FC = () => {
    const { control, register, handleSubmit, formState: { errors }, watch } = useForm<OfferFormData>({
        resolver: zodResolver(OfferSchema),
        defaultValues: {
            plan_type: 'monthly',
            additions: [],
            user: undefined,
            expired: '',
            price: 0,
        },
    });

    const [users, setUsers] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

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
            }
        } catch (error) {
            console.error('Error submitting offer:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ backgroundColor: '#fff', p: 4, borderRadius: 2, boxShadow: 1, maxWidth: 720, m: '0 auto' }}
        >
            <Typography variant="h6" mb={2}>Create Offer</Typography>

            <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Plan Type</FormLabel>
                <Controller
                    name="plan_type"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup row {...field} sx={{ mt: 1 }}>
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

            <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Additions</FormLabel>
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
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
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
                            value={value as any}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="User"
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
                {errors.user && <Typography color="error">{errors.user.message as string}</Typography>}
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                    name="expired"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="Expired"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
                        />
                    )}
                />
                {errors.expired && <Typography color="error">{errors.expired.message}</Typography>}
            </LocalizationProvider>

            <TextField
                label="Price"
                type="number"
                fullWidth
                sx={{ mb: 3 }}
                {...register('price', { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price ? errors.price.message : ''}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button sx={{ width: 111, height: 48, bgcolor: '#1C252E' }} variant="contained" type="submit" fullWidth>
                    Send Offer
                </Button>
            </Box>
        </Box>
    );
};

export default CreateOffer;
