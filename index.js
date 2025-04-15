const express = require("express");
const http = require("http");
const path = require("path");
const PORT = 80;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html/index.html"));
});

server.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});