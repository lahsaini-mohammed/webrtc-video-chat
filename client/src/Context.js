import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// const socket = io('http://localhost:5000');
const socket = io('https://webrtc-video-chat-server.onrender.com');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [screenShare, setScreenShare] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const getMediaStream = useCallback(async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  }, []);

  useEffect(() => {
    getMediaStream();
    socket.on('me', (id) => setMe(id));
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      socket.off('me');
      socket.off('callUser');
    };
  }, []);

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    if (connectionRef.current) {
      try {
        connectionRef.current.destroy();
      } catch (err) {
        console.error('Error destroying peer connection:', err);
      }

    }
    window.location.reload();
  };

  const initializePeer = (isInitiator, userId) => {
    const peer = new Peer({ initiator: isInitiator, trickle: false, stream });

    peer.on('signal', (data) => {
      if (isInitiator) {
        socket.emit('callUser', { userToCall: userId, signalData: data, from: me, name });
      } else {
        socket.emit('answerCall', { signal: data, to: call.from });
      }
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callEnded', () => {
      leaveCall();
    });

    return peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = initializePeer(false);
    peer.signal(call.signal);
    connectionRef.current = peer;
    peer.on('connect', () => {
      const channel = peer._pc.createDataChannel('messageChannel');
      setDataChannel(channel);
      setupDataChannel(channel);
    });
  };

  const callUser = (id) => {
    const peer = initializePeer(true, id);
    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;

    peer._pc.ondatachannel = (event) => {
      setDataChannel(event.channel);
      setupDataChannel(event.channel);
    };
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const shareScreen = async () => {
    if (screenShare) {
      await stopScreenShare();
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
      setScreenShare(screenStream);
      if (myVideo.current) {
        myVideo.current.srcObject = screenStream;
      }
      const screenTrack = screenStream.getVideoTracks()[0];
      if (connectionRef.current) {
        connectionRef.current.replaceTrack(stream.getVideoTracks()[0],screenTrack,stream);
      }
      screenTrack.onended = stopScreenShare;

    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const stopScreenShare = async () => {
    if (!screenShare) return;
    
    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }
    if (connectionRef.current) {
      connectionRef.current.replaceTrack(screenShare.getVideoTracks()[0],stream.getVideoTracks()[0],stream)
    }
    const tracks = screenShare.getTracks();
    tracks.forEach(track => track.stop());

    setScreenShare(null);
  };

  const setupDataChannel = (channel) => {
    channel.onopen = () => {
      console.log('Data channel is open');
    };

    channel.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setReceivedMessages((prevMessages) => [...prevMessages, parsedData]);
      } catch (error) {
        console.error('Error parsing received data:', error);
      }
    };

    channel.onerror = (error) => {
      console.error('Data channel error:', error);
    };

    channel.onclose = () => {
      console.log('Data channel is closed');
    };
  };

  const sendData = (data) => {
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(data));
    } else {
      console.error('Data channel is not open. ReadyState:', dataChannel ? dataChannel.readyState : 'No data channel');
    }
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      isMuted,
      isVideoOff,
      toggleAudio,
      toggleVideo,
      shareScreen,
      screenShare,
      stopScreenShare,
      sendData,
      receivedMessages,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };