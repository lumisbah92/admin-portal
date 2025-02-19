'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Typography, CircularProgress } from '@mui/material';

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

function getStatusColor(status: Offer['status']): 'default' | 'success' | 'error' | 'warning' {
  switch (status) {
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
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
        // Data shape: { data: Offer[], links: {...}, meta: {...} }
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
    if (
      !offer.user_name.toLowerCase().includes(lowerSearch) &&
      !offer.email.toLowerCase().includes(lowerSearch) &&
      !offer.phone.includes(lowerSearch)
    ) {
      return false;
    }

    if (selectedType && offer.type.toLowerCase() !== selectedType.toLowerCase()) return false;

    return true;
  });

  const displayCount = searchQuery || selectedType ? filteredOffers.length : totalOffers;
  const paginatedOffers = filteredOffers;
  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 0, p: 2 }}>
      <CardHeader title="Offer List" />
      <CardContent>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
          <Tab label="All" />
          <Tab label="Accepted" />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField size="small" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select labelId="type-select-label" value={selectedType} label="Type" onChange={(e: SelectChangeEvent) => setSelectedType(e.target.value)}>
              <MenuItem value="">All Types</MenuItem>
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone number</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle2">{offer.user_name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {offer.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{offer.phone}</TableCell>
                      <TableCell>{offer.company}</TableCell>
                      <TableCell>{offer.jobTitle}</TableCell>
                      <TableCell>{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</TableCell>
                      <TableCell>
                        <Chip
                          label={offer.status}
                          color={getStatusColor(offer.status)}
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          Edit
                        </IconButton>
                        <IconButton size="small">
                          Delete
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedOffers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No offers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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

