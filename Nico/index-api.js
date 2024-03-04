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
    app.post(API_BASE+"/ufc-events-data", (req, res) => {

        let comp = [];
        let fight = req.body;

        let camposData = Object.keys(dataset[0]);
        for(let i=0; i<Object.keys(fight).length;i++){
            comp.push(camposData.includes(Object.keys(fight)[i]));
        }
        if (comp.reduce((a,b) => a && b)) {
            if (dataset.find(obj => obj.fighter1 === fight.fighter1 && 
                obj.fighter2 === fight.fighter2 && 
                obj.date === fight.date)) {
                
                    res.sendStatus(409, "Conflict")
            } else {
                dataset.push(fight);
                res.sendStatus(200, "OK");
            }
        } else {
            res.sendStatus(400, "Bad Request");
        }
    });

    // DELETE del recurso
    app.delete(API_BASE+"/ufc-events-data", (req, res) => {
        while (dataset.length > 0) {
            dataset.pop();
        }
        res.sendStatus(200, 'OK');
    });

    // 16.4 GET Rec inexistente
    app.get(API_BASE+"/dataset_ufc", (req, res) =>{
        res.sendStatus(404, "Not Found");
    });

    // 16.5 PUT No permitido
    app.put(API_BASE+"/ufc-events-data", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    // GET del recurso Welterweight
    app.get(API_BASE+"/ufc-events-data/Welterweight", (req, res) => {
        const datosFiltrados = dataset.filter(obj => obj.weight_class === "Welterweight");

        if (datosFiltrados.length === 0) {
            res.sendStatus(404,"Not Found");
        } else {
            res.send(JSON.stringify(datosFiltrados));
            res.sendStatus(200,"OK");
        }
    });

    // POST No permitido en un recurso
    app.post(API_BASE+"/ufc-events-data/Welterweight", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    // 16.1 PUT Mismo recurso
    app.put(API_BASE+"/ufc-events-data/Welterweight", (req, res) => {
        const sw = req.body;

        const index = dataset.findIndex(item => item.fighter1 === sw.fighter1 &&
                                        item.fighter2 === sw.fighter2 &&
                                        item.date === sw.date) 
        if (index !== -1) {
            Object.assign(dataset[index], sw);
            res.sendStatus(200, 'OK');
        } else {
            res.sendStatus(400, "Bad Request");
        }
    });

    // DELETE El recurso Avatar
    app.delete(API_BASE+"/ufc-events-data/Welterweight", (req, res) => {
        if (dataset.find(obj => obj.weight_class === "Welterweight")) {
            dataset = dataset.filter(obj => obj.weight_class !== "Welterweight");
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "Not Found");
        }
    });


    

}
module.exports = api_NRM;