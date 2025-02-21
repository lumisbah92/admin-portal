'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Typography, CircularProgress, Stack, InputAdornment, SxProps, Theme } from '@mui/material';
import EditIcon from '@assets/icons/edit_icon.svg';
import MoreIcon from '@assets/icons/more_icon.svg';
import SearchIcon from '@assets/icons/search_icon.svg';

interface Offer {
  id: number;
  user_name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  status: 'accepted' | 'rejected' | 'pending';
  type: string;
  price: number;
}

function getStatusColor(status: Offer['status']): SxProps<Theme> {
  switch (status) {
    case 'accepted':
      return { bgcolor: '#22C55E29', color: '#118D57' };
    case 'rejected':
      return { bgcolor: '#FF563029', color: '#B71D18' };
    case 'pending':
      return { bgcolor: '#FFAB0029', color: '#B76E00' };
    default:
      return { bgcolor: 'grey.300', color: 'text.primary' };
  }
}

const OfferListTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [totalOffers, setTotalOffers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://dummy-1.hiublue.com/api/offers?page=${page + 1}&per_page=${rowsPerPage}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          const error = await response.json();
          setError(error.message);
          return;
        }
        const data = await response.json();
        setOffers(data.data);
        setTotalOffers(data.meta.total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [page, rowsPerPage]);

  const filteredOffers = offers.filter((offer) => {
    if (tabValue === 1 && offer.status !== 'accepted') return false;

    const lowerSearch = searchQuery.toLowerCase();
    if (![offer.user_name, offer.email, offer.phone].some(v => v.toLowerCase().includes(lowerSearch))) {
      return false;
    }

    if (selectedType && offer.type.toLowerCase() !== selectedType.toLowerCase()) return false;

    return true;
  });

  const displayCount = searchQuery || selectedType ? filteredOffers.length : totalOffers;
  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 0, p: 0, width: '100%' }}>
      <CardHeader
        sx={{ px: {xs: 2, lg: 3} }}
        title={<Typography variant="h6" color="text.primary">Offer List</Typography>}
      />
      <CardContent sx={{ padding: '0px !important' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            px: {xs: 1, lg: 3}, borderBottom: '1px solid', borderColor: 'divider',
            '& .MuiTabs-indicator': { backgroundColor: (theme) => theme.palette.text.primary },
          }}
          textColor="inherit"
        >
          <Tab label="All" />
          <Tab label="Accepted" />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', px: {xs: 1, lg: 3}, py: 2 }} >
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ border: 'none', width: { xs: '100%', lg: 505 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ maxWidth: { xs: '100%', lg: 200 }, width: '100%' }}>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select labelId="type-select-label" value={selectedType} label="Type" onChange={(e: SelectChangeEvent) => setSelectedType(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Yearly">Yearly</MenuItem>
              <MenuItem value="Pay As You Go">Pay As You Go</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
              <Table sx={{ width: '100%', minWidth: { xs: 'auto' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ px: { xs: 1, lg: 2 }}}>Name</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, px: { xs: 0, lg: 2 } }}>Phone number</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, px: { xs: 0, lg: 2 }}}>Company</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, px: { xs: 0, lg: 2 }}}>Job Title</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, px: { xs: 0, lg: 2 }}}>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell sx={{ px: { xs: 1, lg: 2 } }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" color="text.primary">{offer.user_name}</Typography>
                          <Typography variant="body2" color="text.disabled">{offer.email}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, px: { xs: 1, lg: 2 } }}>
                        <Typography variant="body2" color="text.primary">{offer.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, px: { xs: 0, lg: 2 } }}>
                        <Typography variant="body2" color="text.primary">{offer.company}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, px: { xs: 0, lg: 2 } }}>
                        <Typography variant="body2" color="text.primary">{offer.jobTitle}</Typography>
                      </TableCell>
                      <TableCell sx={{ width: 100, display: { xs: 'none', sm: 'table-cell' }, px: { xs: 0, lg: 2 } }}>
                        <Typography variant="body2" color="text.primary" sx={{ textTransform: 'capitalize' }}>{offer.type}</Typography>
                      </TableCell>
                      <TableCell sx={{ px: { xs: 0, lg: 2}, width: 100 }}>
                        <Box sx={{ width: 'fit-content', px: 1, py: 0.5, borderRadius: '6px', ...getStatusColor(offer.status) }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '12px', lineHeight: '20px', textTransform: 'capitalize' }}>{offer.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ px: { xs: 0, lg: 2 }, width: 50 }}>
                        <Stack direction="row" spacing={1} alignItems={'end'} justifyContent="flex-end">
                          <IconButton size="small"><EditIcon /></IconButton>
                          <IconButton size="small"><MoreIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOffers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No offers found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 4 }}>
              <TablePagination
                component="div"
                count={displayCount}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                labelRowsPerPage="Rows per page:"
                rowsPerPageOptions={rowsPerPageOptions}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OfferListTable;
