const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
const randomstring = require("randomstring");
const server = require('http').Server(app);
const io = require('socket.io')(server);

const {Translate} = require('@google-cloud/translate').v2;
const textToSpeech = require("@google-cloud/text-to-speech");
const { response } = require('express');

let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/chatApp")));

const projectId = 'fit2095-324702';
const translate = new Translate({projectId});
const client = new textToSpeech.TextToSpeechClient();


io.on("connection", function(socket) {
    console.log("new connection");

    socket.on("newMsg", (data) => {
        
        //CONVERTING TEXT TO ENGLISH SPEECH
        let request = {
            input: { text: data.text },
            voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" }
        };

        let fileName = randomstring.generate(7) + ".mp3";
        client.synthesizeSpeech(request, (err, res) => {
            if (err) {
                console.log("ERROR:", err);
                return;
            }
            fs.writeFile(fileName, res.audioContent, "binary", (err) => {
                if (err) {
                    console.log("ERROR:", err);
                    return;
                }
                console.log("Audio content written to file: " + fileName);
            });
        });

        // CONVERTING TEXT TO TARGET LANGUAGE (TRANSLATE)
        async function quickStart() {
            let text = data.text;
            let target = data.lang;
          
            const [translation] = await translate.translate(text, target);
            io.sockets.emit("message", { user: data.user, text: text, translation: translation, audioFile: fileName });
        }
        quickStart();
          
    });
});

server.listen(port, () => {
    console.log("Server listening on port " + port);
});

