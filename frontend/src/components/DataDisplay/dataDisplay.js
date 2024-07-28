import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import Config from '../../config/config';

export default function StickyHeadTable({ subcategoryHeaders, displayEdit}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [rowEditNum, setRowEditNum] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [showEditButton, setShowEditButton] = useState(displayEdit);
  const [rows, setRows] = useState([]);
  const [editRowDefaultValues, setEditRowDefaultValues] = useState({});


  // Initialize rows of the table using subcategoryHeaders passed to the component
  useEffect(() => {
    if (subcategoryHeaders?.length > 0) {
      const numberOfRows = subcategoryHeaders[0]?.Subcategory_Data.length;
      const newRows = [];

      for (let i = 0; i < numberOfRows; i++) {
        let row = { originalIndex: i };
        subcategoryHeaders?.forEach(header => {
          row[header.title] = {
            value: header.Subcategory_Data[i]?.value || '-',
            uuid: header.Subcategory_Data[i]?.uuid || null
          };
        });
        newRows.push(row);
      }
      setRows(newRows);
    }
  }, [subcategoryHeaders]);

  if (!subcategoryHeaders || subcategoryHeaders.length === 0) {
    return <div className="Liam"></div>;
  }

  // Initialize the column of the table: Table Header with its data
   const headers = subcategoryHeaders.map(header => ({
    id: header.title,
    uuid: header.uuid, 
    label: header.title, 
    data: header.Subcategory_Data, //Subcategory_Data contains the cell's value and uuid
    minWidth: 170
  }));

  const handleClickEvent = () => {
    setShowEditForm(!showEditForm);
    setShowEditButton(!showEditButton)
  };

  const handleInputChange = (e, headerId) => {
    const { value } = e.target;
    setEditedValues(prev => ({
      ...prev,
      [headerId]: value
    }));
  };

  const handleSave = async () => {
    const updatedData = subcategoryHeaders
      .filter(header => {
        const currentValue = rows[rowEditNum][header.title];
        const newValue = editedValues[header.title];
        return newValue !== undefined && newValue !== currentValue;
      })
      .map(header => {
        const dataItem = header.Subcategory_Data[rowEditNum];
        return {
          title: header.title,
          headerUUID: header.uuid,
          valueUUID: dataItem.uuid,
          value: editedValues[header.title]
        };
      });

    // Update rows using edited values for re-rendering purposes
    const newRows = [...rows];
    newRows[rowEditNum] = {
      ...newRows[rowEditNum],
      ...Object.fromEntries(
          updatedData.map(header => [header.title, { value: header.value, uuid: header.valueUUID }])
      )
    };
    setRows(newRows);

    if (updatedData.length === 0) {
      handleClickEvent();
      return;
    }
  
    try {
      await Promise.all(updatedData.map(async (data) => {
        await axios.put(`${Config.API_URL}/api/subcategory_data/${data.valueUUID}`, data, { withCredentials: true });
      }));
      alert("Successfully saved!")
      // Optionally update local state or re-fetch data to reflect changes
    } catch (error) {
      alert("Encountered an error saving data");
      console.error('Error saving data:', error);
      console.error('Response:', error.response?.data);
    }
  
    handleClickEvent();
  };


  return (
    <Paper sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {showEditButton && <TableCell>Edit</TableCell>}
              {headers.map((header, index) => (
                <TableCell
                  key={header.id}
                  align={header.align}
                  style={{
                    backgroundColor: 'white',
                    fontSize: '16px',
                    position: index === 0 ? 'sticky' : 'static',
                    left: index === 0 ? 0 : 'auto',
                    zIndex: index === 0 ? 1 : 'auto'
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!showEditForm &&
              rows.slice().sort((a, b) => {
                  const nameA = a["Name"]?.value?.toUpperCase();
                  const nameB = b["Name"]?.value?.toUpperCase();
                  if (nameA < nameB) return -1;
                  if (nameA > nameB) return 1;
                  return 0;
                }).map((row) => (
                <TableRow hover tabIndex={row.originalIndex} key={row.originalIndex}>
                  {showEditButton && (
                    <TableCell>
                      <Button
                        onClick={() => {
                          setRowEditNum(row.originalIndex);
                          setEditRowDefaultValues(rows[row.originalIndex]);
                          handleClickEvent();
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  )}
                  {headers.map((header, index) => (
                    <TableCell
                      key={header.id}
                      align={header.align}
                      style={{
                        backgroundColor: 'white',
                        fontSize: '16px',
                        position: index === 0 ? 'sticky' : 'static',
                        left: index === 0 ? 0 : 'auto',
                        zIndex: index === 0 ? 1 : 'auto'
                      }}
                    >
                      {row[header.id]?.value}
                       <div style={{ display: 'none' }}>
                        {row[header.id]?.uuid}
                        </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {showEditForm && (
              <TableRow hover>
                {headers.map((header, index) => (
                  <TableCell
                    key={header.data}
                    align={header.align}
                    style={{
                      backgroundColor: 'white',
                      fontSize: '16px',
                      position: index === 0 ? 'sticky' : 'static',
                      left: index === 0 ? 0 : 'auto',
                      zIndex: index === 0 ? 1 : 'auto'
                    }}
                  >
                    <TextField
                      defaultValue={editRowDefaultValues[header.id]?.value}
                      onChange={e => handleInputChange(e, header.id)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={handleSave}>Save</Button>
                  <Button onClick={handleClickEvent}>Cancel</Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

StickyHeadTable.propTypes = {
  subcategoryHeaders: PropTypes.array.isRequired,
};