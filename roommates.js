const fs = require('fs');

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const nuevoRoommate = async () =>
{
    try
    {
        const { data } = await axios.get('https://randomuser.me/api');

        const roommate = data.results[0];

        const user =
        {
            id: uuidv4().slice(30),
            correo: roommate.email,
            nombre: `${roommate.name.title} ${roommate.name.first} ${roommate.name.last}`,
            debe: 0,
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
}

module.exports = { nuevoRoommate, guardarRoommate };
