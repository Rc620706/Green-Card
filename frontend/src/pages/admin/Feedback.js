import { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Config from "../../config/config";
import './Feedback.css';


const theme = createTheme({
  palette: {
    primary: {
      main: "#96d2b0",
    },
  },
});

const ShowFeedback = () =>{

  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSelected, setFilterSelected] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
      const fetchFeedback = async () => {
          try{
              const response = await axios.get(`${Config.API_URL}/api/feedback`,{withCredentials:true})
              setFeedbackData(response.data);
              setFilteredData(response.data);
          } catch (error) {
              console.error('Error fetching feedback:', error);
          }
      };
      
      fetchFeedback();
  }, []);

  const handleFilterButtonClick = () => {
    const filtered = feedbackData.filter((feedback) => feedback.rating < 3);
    setFilteredData(filtered);
    setFilterSelected(true);
  };
  //reset filter applied
  const handleResetButtonClick = () => {
    setFilteredData(feedbackData);
    setSearchTerm("");
    setFilterSelected(false);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = feedbackData.filter((feedback) => {
      const lowerCaseName = feedback.name.toLowerCase();
      const lowerCaseEmail = feedback.email.toLowerCase();
      return (
        lowerCaseName.includes(value) || lowerCaseEmail.includes(value)
      );
    });
    setFilteredData(filtered);
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
            <Typography variant="h5" className="title">
              Feedbacks
            </Typography>
          </Box>
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleFilterButtonClick}
              sx={{ mr: 1 }}
              color={filterSelected ? "warning" : "primary"}
            >
              Filter (rating {"<"} 3)
            </Button>
            <Button variant="contained" onClick={handleResetButtonClick}>
              Reset
            </Button>
          </Box>
        </div>
        <Box mt={2} display="flex" alignItems="center">
          <TextField
            sx={{zIndex: '0'}}
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
        <TableContainer component={Paper} style={{ height: "70%" }}>
          <Table stickyHeader aria-label="feedback table">
            <TableHead>
              <TableRow>
                <TableCell stickyHeader>Name</TableCell>
                <TableCell stickyHeader>Email</TableCell>
                <TableCell stickyHeader>Comment</TableCell>
                <TableCell stickyHeader>Overall Rating</TableCell>
                <TableCell stickyHeader>Subscribe</TableCell>
                <TableCell stickyHeader>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((feedback, index) => (
              <TableRow key={index} onClick={() => { setSelectedFeedback(feedback); setPopupOpen(true); }}>
              <TableCell>{feedback.name}</TableCell>
              <TableCell>{feedback.email}</TableCell>
              <TableCell>{feedback.comment}</TableCell>
              <TableCell>{feedback.rating}</TableCell>
              <TableCell>
                {feedback.allowEmailBack ? "Yes" : "No"}
              </TableCell>
              <TableCell>{new Date(feedback.createdAt).toLocaleDateString('en-ca')}</TableCell>
            </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* POPUP MODAL */}
          {popupOpen && (
            <Box className={`popup-backdrop show-popup`} onClick={() => setPopupOpen(false)} />
          )}
          {popupOpen && (
            <Box className={`popup show-popup`}>
              <Typography variant="h6" className="title" mb={2} align='center'>
                Feedback Details
              </Typography>
              <Typography mb={2}>Name: {selectedFeedback.name}</Typography>
              <Typography mb={2}>Email: {selectedFeedback.email}</Typography>
              <Typography mb={2}>Comment: {selectedFeedback.comment}</Typography>
              <Typography mb={2}>Overall Rating: {selectedFeedback.rating}</Typography>
              <Typography mb={2}>
                Subscribe: {selectedFeedback.allowEmailBack ? "Yes" : "No"}
              </Typography>
              <Typography mb={2}>
                Date: {new Date(selectedFeedback.createdAt).toLocaleDateString('en-ca')}
              </Typography>
              <Box sx={{ m: 1.5, display: 'flex', justifyContent: 'center' }}>
                <Button sx={{backgroundColor: '#96d2b0', color: 'black'}} onClick={() => setPopupOpen(false)} className="popup-close-button">
                  Close
                </Button>
              </Box>
            </Box>
          )}
      </div>
    </ThemeProvider>
  );
};

export default ShowFeedback;
