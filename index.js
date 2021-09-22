const http = require('http');
const fs = require('fs');
const url = require('url');

const { nuevoRoommate, guardarRoommate } = require('./roommates');
const { agregarGasto, registrarGasto, deleteGasto, updateGasto } = require('./gastos');

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

        if (request.url.startsWith('/gasto') && request.method == 'POST')
        {
            let body;

            request.on('data', (payload) =>
            {
                body = JSON.parse(payload);

                agregarGasto(body).then(async(gasto) =>
                {
                    registrarGasto(gasto);

                    response.end(JSON.stringify(gasto));
                }).catch(e =>
                {
                    response.statusCode == 500;

                    response.end();

                    console.log('Error en el registro de un gasto en particular', e);
                });
            });
        }

        if (request.url.startsWith('/gastos') && request.method == 'GET')
        {
            response.setHeader('Content-Type', 'text/html');
            response.end(fs.readFileSync('gastos.json', 'utf8'));
        }

        if (request.url.startsWith('/gasto') && request.method == "DELETE")
        {
            const { id } = url.parse(request.url, true).query;

            deleteGasto(id);

            response.end(JSON.stringify());
        }

        if (request.url.startsWith('/gasto') && request.method == 'PUT')
        {
            let body;

            const { id } = url.parse(request.url, true).query;

            request.on('data', (payload) =>
            {
                body = JSON.parse(payload);
                body.id = id;
            });

            request.on('end', () =>
            {
                updateGasto(body);

                response.end();
            });
        }
    }).listen(3000, console.log('Server ON'));
