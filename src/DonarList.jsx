import './App.css';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Typography,
    Paper,
    CircularProgress,
    Container,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
function DonarList() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    useEffect(() => {
        axios
            .get('https://blood-donation-be-2rnu.onrender.com/api/donors')
            .then((res) => {
                setDonors(res.data.donors || res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching donors:', err);
                setLoading(false);
            });
    }, []);
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" >
                <CircularProgress color="primary" />
            </Box>
        );
    }
    return (
        <Box py={6} minHeight="100vh">
            <Container maxWidth="md">
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: 4,
                        p: { xs: 2, sm: 4 },
                        background: '#ffffff',
                    }}
                >
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        fontWeight="bold"
                        color="primary"
                        textAlign="center"
                        gutterBottom
                        sx={{
                            mb: 3,
                            letterSpacing: '0.5px',
                        }}
                    >
                        Donor List
                    </Typography>
                    {!isMobile ? (
                        <TableContainer sx={{ borderRadius: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>#</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Profile</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Contact</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {donors.map((donor, index) => (
                                        <TableRow
                                            key={donor._id}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                                '&:hover': { backgroundColor: '#e3f2fd' },
                                                transition: 'background 0.3s ease',
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Avatar
                                                    src={donor.profilePic}
                                                    alt={donor.name}
                                                    sx={{ width: 48, height: 48 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {donor.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {donor.contact}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            {donors.map((donor, index) => (
                                <Paper
                                    key={donor._id}
                                    elevation={3}
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        background: '#f9fafc',
                                        '&:hover': {
                                            boxShadow: 6,
                                            background: '#e3f2fd',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <Avatar
                                        src={donor.profilePic}
                                        alt={donor.name}
                                        sx={{ width: 56, height: 56, bgcolor: '#90caf9', fontWeight: 'bold' }}
                                    >
                                        {donor.name?.[0] || 'D'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {index + 1}. {donor.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {donor.contact}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
export default DonarList;