const { ufc_data, calcularMediaTiempoPelea } = require("./index-NRM");
const API_BASE = "/api/v1";



function api_NRM(app) {

    let dataset = [];

    // CREAR initial data
    app.get(API_BASE+"/ufc-events-data/loadInitialData", (req, res) => {
        if (dataset.length === 0) {
            for (let i = 0; i < ufc_data.length; i++) {
                const fields = ufc_data[i].split('\t');
                const obj = {
                    location: fields[0],
                    fighter1: fields[1],
                    fighter2: fields[2],
                    fighter_1_kd: parseFloat(fields[3]),
                    fighter_2_kd: parseFloat(fields[4]),
                    fighter_1_str: parseFloat(fields[5]),
                    fighter_2_str: parseFloat(fields[6]),
                    fighter_1_td: parseFloat(fields[7]),
                    fighter_2_td: parseFloat(fields[8]),
                    fighter_1_sub: parseFloat(fields[9]),
                    fighter_2_sub: parseFloat(fields[10]),
                    weight_class: fields[11],
                    method: fields[12],
                    round: parseFloat(fields[13]),
                    time: fields[14],
                    event_name: fields[15],
                    date: fields[16],
                    winner: fields[17]
                };
                dataset.push(obj);
            }
            res.send(dataset); // Enviar dataset como array de objetos
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
    });

    // GET Base
    app.get(API_BASE+"/ufc-events-data", (req, res) => {
        res.status(200).json(dataset);
    });
    
    // POST Nuevo evento
    app.post(API_BASE + "/ufc-events-data", (req, res) => {
        const requiredFields = ['location', 'fighter1', 'fighter2', 'fighter_1_kd', 'fighter_2_kd', 
            'fighter_1_str', 'fighter_2_str', 'fighter_1_td', 'fighter_2_td', 'fighter_1_sub', 'fighter_2_sub', 
            'weight_class', 'method', 'round', 'time', 'event_name', 'date', 'winner'];
    
        // Verificar si el tipo de contenido es JSON
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).send('Content not application/JSON');
        }
    
        const fight = req.body;
    
        // Verificar si todos los campos requeridos están presentes y no son nulos o indefinidos
        const isValid = requiredFields.every(field => field in fight && fight[field] !== null && fight[field] !== undefined);
        if (!isValid) {
            return res.status(400).send('Incorrect JSON');
        }
        // Verificar si ya existe un evento con los mismos luchadores y fecha
        const exists = dataset.some(obj => obj.fighter1 === fight.fighter1 && obj.fighter2 === fight.fighter2 && obj.date === fight.date);
        if (exists) {
            return res.status(409).send('Conflict');
        }
        // Agregar el nuevo evento al dataset
        dataset.push(fight);
        return res.status(201).send('Created');
    });




    // DELETE de todo
app.delete(API_BASE+"/ufc-events-data", (req, res) => {
    if (dataset.length === 0) {
        return res.sendStatus(404, 'No data found to delete');
    } else {
        while (dataset.length > 0) {
            dataset.pop();
        }
        return res.sendStatus(200, 'OK');
    }
});

    // 16.4 GET Rec inexistente
    app.get(API_BASE+"/ufc-events", (req, res) =>{
        res.sendStatus(404, "Not Found");
    });

    // 16.5 PUT No permitido
    app.put(API_BASE+"/ufc-events-data", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    // GET del recurso especificado
    app.get(API_BASE+"/ufc-events-data/:peso", (req, res) => {
        const peso = req.params.peso;
        const datosFiltrados = dataset.filter(obj => obj.weight_class === peso);

        if (datosFiltrados.length === 0) {
            res.sendStatus(404,"Not Found");
        } else {
            res.send(JSON.stringify(datosFiltrados));
            res.sendStatus(200,"OK");
        }
    });

    // POST No permitido en un recurso
    app.post(API_BASE+"/ufc-events-data/:peso", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    // 16.1 PUT recurso existente
    app.put(API_BASE+"/ufc-events-data/:fighter1/:fighter2/:date", (req, res) => {
        const f1 = req.params.fighter1;
        const f2 = req.params.fighter2;
        const fdate = req.params.date;
        const sw = req.body;

        // Verificación
        if (!f1 || !f2 || !fdate || !sw) {
            res.sendStatus(400, "Bad Request: Missing required data");
            return;
        }

        // const identificador = `${f1}:${f2}:${fdate}`;

        const index =  dataset.findIndex(item => {
            return (
                item.fighter1 === f1 &&
                item.fighter2 === f2 &&
                item.date === fdate
            );
        });
        if (index !== -1) {
            Object.assign(dataset[index], sw);
            res.sendStatus(200, 'OK');
        } else {
            res.sendStatus(400, "Bad Request");
        }
    });

    // DELETE El recurso peso
    app.delete(API_BASE+"/ufc-events-data/:peso", (req, res) => {
        const peso = req.params.peso;
        
        if (dataset.find(obj => obj.weight_class === peso)) {
            dataset = dataset.filter(obj => obj.weight_class !== peso);
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "Not Found");
        }
    });

}
module.exports = api_NRM;