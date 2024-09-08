/**
 * Initializes the server and sets up socket.io for real-time communication.
 *
 * @param {Object} app - The Express application instance.
 * @param {Object} server - The HTTP server instance.
 * @param {Object} cors - The CORS middleware for Express.
 * @param {Object} io - The socket.io instance.
 * @param {number} PORT - The port number for the server to listen on.
 *
 * @returns {undefined} - This function does not return a value.
 */
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: [ "GET", "POST" ]
    }
});

app.use(cors());
// checks for an environment variable PORT (useful for deployment on platforms like Heroku) and defaults to 5000 if not set
const PORT = 5000;
// const PORT = process.env.PORT || 5000;

// verify that the server is running
app.get('/', (req, res) => {
    res.send('Running');
});
// handles the real-time communication events for the video calling application,
// allowing clients to connect, disconnect, initiate calls, and answer calls.
io.on("connection", (socket) => {
    // sends a "me" event to the newly connected client, containing their socket ID.
    socket.emit("me", socket.id);
    // listens for the disconnect event. When a user disconnects, it broadcasts a callEnded message to all other connected clients
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });
    // sends a "callUser" event to the specified client (userToCall). 
    // The event data includes the signal data, the ID of the calling client (from), and the name of the calling client (name).
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });
    // listens for the "answerCall" event. sends a "callAccepted" event to the specified client (data.to) includes the signal data to establish the connection.
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

