import React, { useContext, useEffect } from 'react';
import { Grid2, Typography, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';

import { SocketContext } from '../Context';

const Video = styled('video')(({ theme }) => ({
  width: '550px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const GridContainer = styled(Grid2)(({ theme }) => ({
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const StyledPaper = styled(Paper)({
  padding: '10px',
  border: '2px solid black',
  margin: '10px',
});

const ControlButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const VideoPlayer = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    isMuted,
    isVideoOff,
    toggleAudio,
    toggleVideo,
    shareScreen,
    screenShare,
    getMediaStream,
  } = useContext(SocketContext);

  useEffect(() => {
    getMediaStream();
  }, [getMediaStream]);

  return (
    <GridContainer container>
      {stream && (
        <StyledPaper>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
            <Video playsInline muted ref={myVideo} autoPlay />
            <div>
              <ControlButton
                variant="contained"
                color={isMuted ? 'secondary' : 'primary'}
                onClick={toggleAudio}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </ControlButton>
              <ControlButton
                variant="contained"
                color={isVideoOff ? 'secondary' : 'primary'}
                onClick={toggleVideo}
              >
                {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
              </ControlButton>
              <ControlButton
                variant="contained"
                color={screenShare ? 'secondary' : 'primary'}
                onClick={shareScreen}
              >
                {screenShare ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </ControlButton>
            </div>
          </Grid2>
        </StyledPaper>
      )}
      {callAccepted && !callEnded && (
        <StyledPaper>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
            <Video playsInline ref={userVideo} autoPlay />
          </Grid2>
        </StyledPaper>
      )}
    </GridContainer>
  );
};

export default VideoPlayer;