import React, { useState, useContext, useRef, useEffect } from 'react';
import { TextField, IconButton, Typography, Paper, List, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { SocketContext } from '../Context';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2,2),
  border: '2px solid black',
  maxWidth: '574px',
  width: '100%',
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(1),
}));

const MessageItem = styled(Box)(({ theme, isSent }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: isSent ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
}));

const MessageContent = styled(Box)(({ theme, isSent }) => ({
  backgroundColor: isSent ? theme.palette.primary.main : theme.palette.secondary.main,
  color: theme.palette.getContrastText(isSent ? theme.palette.primary.main : theme.palette.secondary.main),
  borderRadius: '8px',
  padding: theme.spacing(1, 2),
  maxWidth: '70%',
  wordWrap: 'break-word',
}));

const MessageMeta = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

const DataExchange = () => {
  const { callAccepted, sendData, receivedMessages, name } = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null);

  // useEffect(() => {
  //   console.log('Received messages updated:', receivedMessages);
  //   setMessages(prevMessages => [
  //     ...prevMessages,
  //     ...receivedMessages.filter(msg => !prevMessages.some(prevMsg => 
  //       prevMsg.content === msg.content && prevMsg.sender === msg.sender && prevMsg.timestamp === msg.timestamp && prevMsg.sent === true
  //     ))
  //   ]);
  // }, [receivedMessages]);

  useEffect(() => {
    if (receivedMessages.length > 0) {
      const newMessage = receivedMessages[receivedMessages.length - 1];
      newMessage.sent = false; // Mark as received before adding to the list
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  }, [receivedMessages]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && callAccepted) {
      const newMessage = { type: 'chat', content: message, sender: name, timestamp: Date.now() , sent: true};
      // console.log('Sending message:', newMessage);
      sendData(newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      // setMessages(prevMessages => [...prevMessages, { ...newMessage, sent: true }]);
      setMessage('');
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      <MessageList ref={messageListRef}>
        {messages.map((msg, index) => {
          const isSent = msg.sent;
          const displayName = msg.sender || ( isSent ? 'me' : 'Remote');
          return (
            <MessageItem key={index} isSent={isSent}>
              <MessageContent isSent={isSent}>
                <Typography variant="body1">{msg.content}</Typography>
              </MessageContent>
              <MessageMeta>
                {displayName} • {new Date(msg.timestamp).toLocaleTimeString()}
              </MessageMeta>
            </MessageItem>
          );
        })}
      </MessageList>
      <InputContainer>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          disabled={!callAccepted}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <IconButton color='primary' onClick={handleSubmit} disabled={!callAccepted || !message.trim()}>
          <SendIcon />
        </IconButton>
      </InputContainer>
    </StyledPaper>
  );
};

export default DataExchange;