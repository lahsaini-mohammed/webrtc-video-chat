import React, { useContext } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SocketContext } from '../Context';

const NotificationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
});

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <NotificationContainer>
          <Typography variant="h6">{call.name} is calling:</Typography>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </NotificationContainer>
      )}
    </>
  );
};

export default Notifications;