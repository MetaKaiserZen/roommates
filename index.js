const http = require('http');
const fs = require('fs');

const { nuevoRoommate, guardarRoommate } = require('./roommates');

http
    .createServer((request, response) =>
    {
        if (request.url == '/' && request.method == 'GET')
        {
            response.setHeader('Content-Type', 'text/html');
            response.end(fs.readFileSync('index.html', 'utf8'));
        }

        if (request.url.startsWith('/roommate') && request.method == 'POST')
        {
            nuevoRoommate().then(async(roommate) =>
            {
                guardarRoommate(roommate);

                response.end(JSON.stringify(roommate));
            }).catch(e =>
            {
                response.statusCode == 500;

                response.end();

                console.log('Error en el registro de un roommate random', e);
            });
        }

        if (request.url.startsWith('/roommates') && request.method == 'GET')
        {
            response.setHeader('Content-Type', 'text/html');
            response.end(fs.readFileSync('roommates.json', 'utf8'));
        }
    }).listen(3000, console.log('Server ON'));
