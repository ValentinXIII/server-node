const express = require('express');
const http = require('http');
const websocket = require("ws");
const sqlite3 = require('sqlite3').verbose();

const serverapp = express();
const servu = http.createServer(serverapp);
const serversocket = new websocket.Server({ server: servu });

const cardsdb = new sqlite3.Database('tarotdeck.db');

// Function to generate a random integer
function generateRandomInt() {
    return Math.floor(Math.random() * 22 + 1);
}

// Handle database retrieval
serversocket.on('connection', (socketclient) => {
    console.log("connection success c:");

    socketclient.on('message', (message) => {
        console.log("message received");
        console.log(message.toString());

        if (message.toString() === "random-int") {
            // Generate a random integer
            const randomTarot = generateRandomInt();

            // Retrieve the data from the database using the random integer
            const sqlSelect = `SELECT * FROM Cards WHERE id = ?`;

            cardsdb.get(sqlSelect, [randomTarot], (err, row) => {
                if (err) {
                    console.error(err.message);
                    socketclient.send("Error retrieving data from the database");
                    return;
                }

                if (row) {
                    // Send the retrieved data back to the client
                    socketclient.send(JSON.stringify(row));
                } else {
                    socketclient.send("No data found for the random integer");
                }
            });
        }
    });
});

servu.listen(8000, () => {
    console.log("Server started");
});

// Close the database connection when the server is stopped
servu.on('close', () => {
    cardsdb.close();
});