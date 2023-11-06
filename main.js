const express = require('express');
const http = require('http');
const websocket = require("ws");
//luodaan serverapp, servu ja serversocket.
const serverapp = express();
const servu = http.createServer(serverapp);
const serversocket = new websocket.Server({server : servu});
//Jos ei ole yhteyttä 
serversocket.on('error', (error) => {
    console.log("error in connection :c");
})
//jos on yhteys
serversocket.on('connection', (socketclient) => {
    console.log("connection succes c:");
//viestintä, ja otetaan vastaan viestit
    socketclient.on('message', (message) => {
        console.log("message recived");
        console.log(message.toString());
//lähetetään takaisin viesti jos saatu viesti on random-int
        if(message.toString() === "random-int"){
            //otetaan random int ja muutetaan se stringiks
            let randomtarot = Math.floor(Math.random() * 22 + 1);
            socketclient.send("" + randomtarot);
        }

    })
})
//kuuntelee serveriä.
servu.listen(8000, () =>{
    console.log("Server started");
})