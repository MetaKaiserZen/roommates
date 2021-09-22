const fs = require('fs');

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const nuevoRoommate = async () =>
{
    try
    {
        const { data } = await axios.get('https://randomuser.me/api');

        const roommate = data.results[0];

        const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));
        const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));

        const gastosRoommate = gastosJSON.gastos;
        const datosRoommate = roommatesJSON.roommates;
        const largoRoommate = datosRoommate.length;

        // Agrega un nuevo Roommate con un monto de Debe correspondiente al resultado sumado de cada gasto y dividido por el total de Roommates

        let monto = 0;

        gastosRoommate.map((data) =>
        {
            monto += parseInt(data.monto);
        });

        const user =
        {
            id: uuidv4().slice(30),
            correo: roommate.email,
            nombre: `${roommate.name.first} ${roommate.name.last}`,
            debe: parseInt(monto / largoRoommate),
            recibe: 0,
        };

        return user;
    }
    catch (e)
    {
        throw e;
    }
}

const guardarRoommate = (roommate) =>
{
    const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));

    roommatesJSON.roommates.push(roommate);

    fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON));

    const datosRoommate = roommatesJSON.roommates;
    const largoRoommate = datosRoommate.length;

    // Actualiza los montos de Debe y Recibe de cada Roommate al dividir su monto actual por el total de Roommates y luego restar ese resultado a su monto actual

    datosRoommate.map((data) =>
    {
        let debe;
        let recibe;

        if (data.debe > 0)
        {
            debe = parseInt(data.debe - (data.debe / largoRoommate));

            data.debe = debe;
        }

        if (data.recibe > 0)
        {
            recibe = parseInt(data.recibe - (data.recibe / largoRoommate));

            data.recibe = recibe;
        }

        fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
    });
}

module.exports = { nuevoRoommate, guardarRoommate };
