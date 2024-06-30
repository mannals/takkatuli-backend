const express = require('express');
const path = require('path');
const pm2 = require('pm2');

const app = express();
const port = 3003;

const startServers = () => {
    pm2.connect(err => {
        if (err) {
            console.error(err);
            process.exit(2);
        }

        const servers = [
            {script: './auth-server/dist/auth-server/src/index.js', name: 'auth-server', port: 3001},
            {script: './media-api/dist/media-api/src/index.js', name: 'media-api', port: 3000},
            {script: './upload-server/dist/upload-server/src/index.js', name: 'upload-server', port: 3002}
        ];

        servers.forEach(server => {
            const options = {
                ...server,
                env: {
                    ...process.env,
                    PORT: server.port
                }
            };

            pm2.start(options, (err, apps) => {
                if (err) {
                    console.error(`Failed to start ${server.name}`, err);
                    process.exit(2);
                }
                console.log(`${server.name} started successfully on port http://localhost:${server.port}`);
            });
        });

        pm2.launchBus((err, bus) => {
            bus.on('process:msg', (packet) => {
              console.log('[PM2] Log: ', packet);
            });
        });
    });
};

startServers();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack to the console
    res.status(500).send('Something broke!'); // Respond with a generic error message
});