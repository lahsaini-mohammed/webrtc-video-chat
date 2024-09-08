import React, { useState, useContext } from 'react';
import { Button, TextField, Grid2, Typography, Box, Paper } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { SocketContext } from '../Context';

const StyledContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth : '610px', // Set a maximum width for the container
  margin: '35px auto', // Center the container
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%', 
  padding: theme.spacing(2),
  border: '2px solid black',
}));

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
});

const GridContainer = styled(Grid2)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down(500)]: {
    flexDirection: 'column',
  },
}));

const GridItem = styled(Grid2)(({ theme }) => ({
  padding: theme.spacing(1),
  flex: 1, // Distribute horizontal space evenly between grid items
}));

const MarginTopButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <StyledContainer>
      <StyledPaper elevation={10}>
        <StyledForm noValidate autoComplete="off">
          <GridContainer container>
            <GridItem item xs={12} md={6}>
              <Typography gutterBottom variant="h6">Account Info</Typography>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <CopyToClipboard text={me}>
                <MarginTopButton variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                  Copy Your ID
                </MarginTopButton>
              </CopyToClipboard>
            </GridItem>
            <GridItem item xs={12} md={6}>
              <Typography gutterBottom variant="h6">Make a call</Typography>
              <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
              {callAccepted && !callEnded ? (
                <MarginTopButton variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall}>
                  Hang Up
                </MarginTopButton>
              ) : (
                <MarginTopButton variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)}>
                  Call
                </MarginTopButton>
              )}
            </GridItem>
          </GridContainer>
        </StyledForm>
        {children}
      </StyledPaper>
    </StyledContainer>
  );
};

export default Sidebar;