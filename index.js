const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, "public")));

// Generate a random anonymous username
function getRandomUsername() {
    const names = ["Shadow", "Phantom", "Mystic", "Blaze", "Echo", "Frost", "Nova", "Rogue"];
    return names[Math.floor(Math.random() * names.length)] + "_" + Math.floor(1000 + Math.random() * 9000);
}

io.on("connection", (socket) => {
    const username = getRandomUsername();
    socket.username = username;
    
    // Notify user of their anonymous name
    socket.emit("set_username", username);

    // Broadcast message
    socket.on("send_message", (data) => {
        io.emit("receive_message", { username: socket.username, message: data.message });
    });

    // Handle file sharing
    socket.on("send_file", (fileData) => {
        io.emit("receive_file", { username: socket.username, fileData });
    });

    // User disconnects
    socket.on("disconnect", () => {
        console.log(`${socket.username} disconnected`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
