import React, { useEffect } from 'react';
import { useState, useRef  } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Checkbox } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Config from "../../config/config";
import "./Accounts.css";
import ROLE_IDS from "../../config/constants";
import ToastComponent from "../../components/ToastComponent";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';


const theme = createTheme({
    palette: {
      primary: {
        main: "#96d2b0",
      },
    },
  });


const Accounts = () => {

  const [customersList, setCustomersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const selectedListRef = useRef(customersList);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/api/users`, { withCredentials: true });
      setCustomersList(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  //The function dynamically updates the selection of customers based on user interaction.
  const handleSelectReview = (customer) => {
    const selectedIndex = selectedCustomers.indexOf(customer);
    let newSelected = [];

    if (selectedIndex === -1) {
        // Customer not in the list, add them
        newSelected = [...selectedCustomers, customer];
    } else {
        // Customer in the list, remove them by filtering
        newSelected = selectedCustomers.filter((c) => c !== customer);
    }

    setSelectedCustomers(newSelected);

    // Reset the selectedCustomers state when the Set Admin Privileges button is clicked
    if (newSelected.length === selectedListRef.length) {
        setSelectedCustomers([]);
    }
  };

  const handleSetPrivileges = async (newRoleID, successMessage, errorMessage) => {
    if (selectedCustomers.length === 0) {
      showToast('Please select a user before setting status', 'error');
      return;
    }
    const selectedCustomersIDs = selectedCustomers.map(customer => customer.User_Roles[0].userID);

    const confirmationMessage = `Are you sure you want to ${newRoleID === ROLE_IDS.ADMIN ?
        'grant admin privileges to the selected accounts' : 'reset the selected accounts to regular user status'}?`;
    const confirmed = window.confirm(confirmationMessage);
    if (!confirmed) return;

    setSelectedCustomers([]);

    try {
      const response = await axios.put(`${Config.API_URL}/api/user_roles`, {
        userIDs: selectedCustomersIDs,
        newRoleID
      }, { withCredentials: true });
      if (response.status === 200) {
        showToast(successMessage, 'success');
      }
    } catch (error) {
      showToast(errorMessage, 'error');
    }

    await fetchCustomers();
  };

  const setAdminPrivileges = async () => {
    await handleSetPrivileges( ROLE_IDS.ADMIN,"Successfully granted admin privileges","Failed to grant admin privileges");
  };

  const setUserPrivileges = async () => {
    await handleSetPrivileges( ROLE_IDS.USER,"Successfully reset to regular user status","Failed to reset to regular user status");
  };

  const filteredCustomersList = customersList.filter((customer) =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 3000);
  };

    return (
      <ThemeProvider theme={theme}>
        <div className="form-container" style={{ height: "70%" }}>
          <div className="form-header">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" className="title" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                Account Privileges
              </Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
            <Button
                variant="contained"
                onClick={setAdminPrivileges}
                sx={{ backgroundColor: '#96d2b0', color: 'black', mr: 1}}
                >
                Set Admin Privileges
            </Button>
            <Button
                variant="contained"
                onClick={setUserPrivileges}
                sx={{ backgroundColor: '#96d2b0', color: 'black', mr: 1}}
                >
                Reset to User status
            </Button>
          </Box>
          </div>
          <Box mt={2} display="flex" alignItems="center" padding="10px"> 
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
          </Box>
          <TableContainer component={Paper} style={{ height: "70%" }}>
            <Table stickyHeader aria-label="customer table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">Select</TableCell>
                  <TableCell stickyHeader>Role</TableCell>
                  <TableCell stickyHeader>First Name</TableCell>
                  <TableCell stickyHeader>Last Name</TableCell>
                  <TableCell stickyHeader>Discipline</TableCell>
                  <TableCell stickyHeader>Email</TableCell>
                  <TableCell stickyHeader>Last Login</TableCell>
                  <TableCell stickyHeader>Date Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomersList.map((customer , index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                        checked={selectedCustomers.indexOf(customer) !== -1}
                        onChange={(event) => handleSelectReview(customer)}
                    />
                    </TableCell>
                    <TableCell>
                      {
                        customer.User_Roles[0].roleID === ROLE_IDS.ADMIN ?
                          <Tooltip placement="top" title="Admin User" arrow>
                            <ManageAccountsIcon />
                          </Tooltip> :
                          <Tooltip placement="top" title="Regular User" arrow>
                            <PersonIcon />
                          </Tooltip>
                      }
                    </TableCell>
                    <TableCell>{customer.firstName }</TableCell>
                    <TableCell>{customer.lastName }</TableCell>
                    <TableCell>{customer.discipline}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{new Date(customer.lastLogin).toLocaleDateString('en-ca')}</TableCell>
                    <TableCell>{new Date(customer.createdAt).toLocaleDateString('en-ca')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <ToastComponent message={toastMessage} type={toastType} />
      </ThemeProvider>
    );
  };
  
  export default Accounts;