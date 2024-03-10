const {ufc_data} = require("./index-NRM");
const API_BASE = "/api/v1";



module.exports = (app, dbUfc) => {

    let dataset = [];


    // CREAR initial data
    app.get(API_BASE+"/ufc-events-data/loadInitialData", (req, res) => {
        dbUfc.find({}, (err, docs) => {
            if (err) {
                res.sendStatus(500, 'Internal Error');
            } else {
                if (docs.length === 0) {
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
                        }
                        dbUfc.insert(obj);
                    
                } 
                res.sendStatus(201, "Created");
            } else {
                    res.sendStatus(409, 'Conflict');
            }   
            }
        });
    });        

    // GET Base
    app.get(API_BASE+"/ufc-events-data", (req, res) => {
        dbUfc.find({}, (err, events) => {
            if (err) {
                res.sendStatus(500, 'Internal Error');
            } else {
                // Consultas con parámetros
                if (!(Object.keys(req.query).length === 0)) {

                    if (req.query.limit && req.query.offset) {
                        let limit = parseInt(req.query.limit);
                        let offset = parseInt(req.query.offset);
                        res.send(JSON.stringify(events.slice(offset, limit)));
                    } else if(req.query.limit && !req.query.offset){
                        let limit = parseInt(req.query.limit);
                        res.send(JSON.stringify(events.slice(0, limit)));
                    } else if (!req.query.limit && req.query.offset) {
                        let offset = parseInt(req.query.offset);
                        res.send(JSON.stringify(events.slice(offset)));
                    } else {
                        let mostrar = []
                        let queryParams = Object.keys(req.query);
                        for (let i = 0; i < events.length; i++) {
                            let match = true;
                            for (let j = 0; j < queryParams.length; j++) {
                                if (events[i][queryParams[j]] !== req.query[queryParams[j]]) {
                                    match = false;
                                    break;
                                }
                            }
                            if (match) {
                                mostrar.push(events[i]);
                            }
                        }
                        res.send(JSON.stringify(mostrar));
                    }
                // Consultas sin parámetros
                } else {
                    res.send(JSON.stringify(events));
                }
            }
        })
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
        dbUfc.findOne({fighter1: fight.fighter1, fighter2: fight.fighter2, date: fight.date}, (err, existingFight) => {
            if (err) {
                return res.status(500).send('Internal Error');
            }

            if (existingFight) {
                return res.status(409).send('Conflict');
            }
            dbUfc.insert(fight, (err, newFight) => {
                if (err) {
                    return res.status(500).send('Internal Error');
                } else {
                    return res.status(201).send('Created');
                }
            });
        });
    });




    // DELETE de todo
app.delete(API_BASE+"/ufc-events-data", (req, res) => {
    dbUfc.find({}, (err, dat) => {
        if (err) {
            res.sendStatus(500, "Internal Error");
        } else {
            if (dat.length === 0) {
                res.sendStatus(404, 'No data found to delete.')
            } else {
                dbUfc.remove({}, {multi: true}, (err, removed) => {
                    if (err) {
                        res.sendStatus(500, "Internal Error");
                    } else {
                        res.status(200).send(`OK, ${removed} data deleted.`)
                    }
                });
            }
        }
    });
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

        dbUfc.find({weight_class: peso}, (err, datosFiltrados) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (datosFiltrados.length === 0) {
                    res.sendStatus(404, "Not Found");
                } else {
                    res.send(JSON.stringify(datosFiltrados));
                }
            }
        })
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

        dbUfc.update(
            {fighter1: f1, fighter2: f2, date: fdate},
            { $set: sw},
            {},
            (err, affected) => {
                if (err) {
                    res.status(500).send('Internal Error');
                } else {
                    if (affected === 1) {
                        res.status(200).send("OK");
                    } else {
                        res.status(404).send("Not Found");
                    }
                }
            }
        )
    });

    // DELETE El recurso peso
    app.delete(API_BASE+"/ufc-events-data/:peso", (req, res) => {
        const peso = req.params.peso;
        
        dbUfc.remove({weight_class: peso}, { multi: true}, (err, removed) => {

            if (err) {
                return res.sendStatus(500, "Internal Error");
            } else {
                if (removed >= 1) {
                    return res.sendStatus(200, `OK, ${removed} data removed.`);
                } else {
                    return res.sendStatus(404, "Not Found");
                }
            }
        })
    });

    
    //Documentación Postman
    app.get(API_BASE + "/ufc-events-data/docs", (req, res) => {
        res.status(301).redirect("https://documenter.getpostman.com/view/32992444/2sA2xh3tEg")
    });

}
