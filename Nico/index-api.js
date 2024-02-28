const ufc_data = require("./index-NRM")

const API_BASE = "/api/v1";

module.exports = (app) => {

    let dataset = new Array();

    app.get(API_BASE+"/ufc-events-data/loadInitialData", (req, res) => {
        if (dataset.length === 0) {
            for(let i=0; i< ufc_data_data.length; i++){
                dataset.push(ufc_data[i]);
            }
            res.sendStatus(201, "Created");
        } else {
            res.sendStatus(201, "Data has been already loaded");
        }
    })

    app.get(API_BASE+"/ufc-events-data", (req, res) => {
        res.send(JSON.stringify(dataset));
    })
}