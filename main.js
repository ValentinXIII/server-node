//js:n ns. using statementit
const express = require('express');
const http = require('http');
const websocket = require("ws");
// terminaalissa lataa npm install sqlite3, jotta toimii
const sqlite3 = require('sqlite3').verbose();

// luodaan serverapp, servu ja serversocket.
const serverapp = express();
const servu = http.createServer(serverapp);
const serversocket = new websocket.Server({ server: servu });
// luodaan uusi tietokanta
const cardsdb = new sqlite3.Database('tarotdeck.db');

cardsdb.all('SELECT name FROM Cards', (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        // prosessoidaan riveinä
        console.log(rows);
    }
});


// Jos ei ole yhteyttä, antaa virheilmoituksen 
serversocket.on('error', (error) => {
    console.log("error in connection :c");
})
// jos on yhteys
serversocket.on('connection', (socketclient) => {
    console.log("connection succes c:");
    // viestintä, ja otetaan vastaan viestit
    socketclient.on('message', (message) => {
        console.log("message recived");
        console.log(message.toString());
        //lähetetään takaisin viesti jos saatu viesti on random-int
        // tämän yhdistäminen kun saadaan tietokanta toimimaan ja front-endin kanssa
        if (message.toString() === "random-int") {
            //otetaan random int ja muutetaan se stringiks
            let randomtarot = Math.floor(Math.random() * 22 + 1);
            socketclient.send("" + randomtarot);
        }

    })
})
// kuuntelee serveriä
servu.listen(8000, () => {
    console.log("Server started");
})

// lopuksi suljetaan tietokantayhteys
cardsdb.close;