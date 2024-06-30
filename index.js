const express = require('express');
const concurrently = require('concurrently');
const path = require('path');

const app = express();
const port = 3003;

async function startServers() {
    const commands = [
        { command: 'npm run start --prefix ./auth-server', name: 'auth-server' },
        { command: 'npm run start --prefix ./media-api', name: 'media-api' },
        { command: 'npm run start --prefix ./upload-server', name: 'upload-server' },
    ];

    try {
        await concurrently(commands);
        console.log('All servers started successfully');

    } catch (error) {
        console.error('Failed to start one or more servers', error);
    }
}

startServers();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });