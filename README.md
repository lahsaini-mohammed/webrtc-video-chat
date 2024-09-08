# A React video call application using WebRTC

## DEV

### Backend
initialize backend

```bash
npm init -y
```

Install backends dependencies:
cors for cross-origin requests
express for the backend server
nodemon to refesh the server whenever we make changes (automatically restart node aplication when files are updated)
socket.io to make realtime data connection

```bash
npm install cors express nodemon socket.io
```

To use nodemon add the script object to package.json

```json
"scripts": {
		"start": "node index.js",
		"dev": "nodemon index.js"
	},
```

and execute

```bash 
npm run dev
```

if you installed nodemon globally (npm i -g nodemon) you won't need it you just run nodemon index.js.

If you don't want to use nodemon just run node index.js

### Frontend

init react

```bash
npx create-react-app ./client
```

Install Frontend dependecies

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-copy-to-clipboard simple-peer socket.io-client
```

#### About WebRTC

WebRTC (Web Real-Time Communication) allows real-time, peer-to-peer, media exchange between two devices without requiring an intermediary. A connection is established through a discovery and negotiation process called signaling.


During the signaling process, three types of information are exchanged:

- Session Control Information: Messages to initialize, modify, or terminate the communication session.
- Network Configuration: Information about the peers' IP addresses and ports to facilitate direct communication.
- Media Capabilities: Details about the codecs and media types supported by each peer.

To make our life easy we will be using simple-peer, a straightforward API that allows creaction and management of WebRTC connections with minimal configuration. This reduces the need to understand the intricate details of the WebRTC API, such as ICE candidates and SDP (Session Description Protocol) handling.

We will allow video call only btween two peers. it is possible to connect more than two peers but practical limitations arise from network conditions and device capabilities.
Here’s a summary of the WebRTC methods for facilitating group calls:

1. **Mesh Networking**: Each participant connects directly to all others. It’s simple but not scalable beyond a few participants (usually 2-4), as managing multiple peer connections increases bandwidth and CPU usage.

2. **Selective Forwarding Unit (SFU)**: A server forwards media streams selectively to participants. This reduces the load on individual clients and allows for larger groups in a call. ( for example in a 4 participants conference Each participant in the session sends out one stream and receives 3 streams. Across 4 participants, the media server needs to receive 4 streams and send out 12 streams)

3. **Multipoint Control Unit (MCU)**: The server mixes all streams into one that’s sent to each participant. This approach simplifies client-side processing but is more resource-intensive server-side.