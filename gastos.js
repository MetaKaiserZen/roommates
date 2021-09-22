const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const agregarGasto = async (body) =>
{
    try
    {
        const roommate = body.roommate;
        const descripcion = body.descripcion;
        const monto = body.monto;

        const gasto =
        {
            id: uuidv4().slice(30),
            roommate: roommate,
            descripcion: descripcion,
            monto: monto,
        };

        const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));

        const datosRoommate = roommatesJSON.roommates;
        const largoRoommate = datosRoommate.length;

        // Suma a cada Roommate la cantidad del monto del gasto agregado dividido por el total de Roommates

        datosRoommate.map((data) =>
        {
            if (data.nombre == body.roommate)
            {
              let recibe

              recibe = parseInt(body.monto / largoRoommate);

              data.recibe += recibe;
            }
            else if (data.nombre !== body.roommate)
            {
              let debe

              debe = parseInt(body.monto / largoRoommate);

              data.debe += debe;
            }

            fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
        });

        return gasto;
    }
    catch (e)
    {
        throw e;
    }
}

const registrarGasto = (gasto) =>
{
    const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));

    gastosJSON.gastos.push(gasto);

    fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
}

const deleteGasto = (id) =>
{
    const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));
    const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));

    const datosRoommate = roommatesJSON.roommates;
    const largoRoommate = datosRoommate.length;

    gastosRoommate = gastosJSON.gastos.filter((gasto) => gasto.id == id);

    // Resta a cada Roommate la cantidad del monto del gasto eliminado dividido por el total de Roommates

    const resultadoGasto = parseInt(gastosRoommate[0].monto / largoRoommate);

    datosRoommate.map((data) =>
    {
        if (data.nombre == gastosRoommate[0].roommate)
        {
            let recibe;

            recibe = data.recibe - resultadoGasto;

            data.recibe = recibe;
        }
        else if (data.nombre != gastosRoommate[0].roommate)
        {
            let debe;

            debe = data.debe - resultadoGasto;

            data.debe = debe;
        }

        fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
    });

    gastosJSON.gastos = gastosJSON.gastos.filter((gasto) => gasto.id !== id);

    fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
}

const updateGasto = (body) =>
{
    const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));
    const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));

    // Esta sección que actualiza el JSON de Gastos a diferencia de otras secciones debe ir antes
    // O de lo contrario no se actualizan los montos

    gastosAnterior = gastosJSON.gastos.filter((gasto) => gasto.id == body.id);

    gastosJSON.gastos = gastosJSON.gastos.map((data) =>
    {
        if (data.id == body.id)
        {
            return body;
        }
        else
        {
            return data;
        }
    });

    fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));

    // Fin de la sección que actualiza el JSON de Gastos

    const datosRoommate = roommatesJSON.roommates;
    const largoRoommate = datosRoommate.length;

    gastosRoommate = gastosJSON.gastos.filter((gasto) => gasto.id == body.id);

    // Reglas que actualizan el Debe y el Recibe comparando el monto anterior con el monto actual
    // Tomó más de una semana para implementar y ejecutar correctamente esta lógica

    const resultadoMayor = parseInt((gastosAnterior[0].monto - gastosRoommate[0].monto) / largoRoommate);
    const resultadoMenor = parseInt((gastosRoommate[0].monto - gastosAnterior[0].monto) / largoRoommate);

    datosRoommate.map((data) =>
    {
        if (data.nombre == body.roommate)
        {
            let recibe;

            if (gastosAnterior[0].monto > gastosRoommate[0].monto)
            {
                recibe = data.recibe - resultadoMayor;
            }
            else if (gastosAnterior[0].monto < gastosRoommate[0].monto)
            {
                recibe = data.recibe + resultadoMenor;
            }
            else if (gastosAnterior[0].monto == gastosRoommate[0].monto)
            {
                recibe = data.recibe;
            }

            data.recibe = recibe;
        }
        else if (data.nombre != body.roommate)
        {
            let debe;

            if (gastosAnterior[0].monto > gastosRoommate[0].monto)
            {
                debe = data.debe - resultadoMayor;
            }
            else if (gastosAnterior[0].monto < gastosRoommate[0].monto)
            {
                debe = data.debe + resultadoMenor;
            }
            else if (gastosAnterior[0].monto == gastosRoommate[0].monto)
            {
                debe = data.debe;
            }

            data.debe = debe;
        }

        fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
    });
}

module.exports = { agregarGasto, registrarGasto, deleteGasto, updateGasto };
