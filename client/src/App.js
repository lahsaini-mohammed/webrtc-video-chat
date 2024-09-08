import React from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import DataExchange from './components/DataExchange';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  borderRadius: 15,
  margin: '30px 100px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: '600px',
  border: '2px solid black',

  [theme.breakpoints.down('sm')]: {
    width: '90%',
  },
}));

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

const App = () => {
  return (
    <Wrapper>
      <StyledAppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h2">Video Chat</Typography>
        </Toolbar>
      </StyledAppBar>
      <VideoPlayer />
      <DataExchange />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </Wrapper>
  );
};

export default App;