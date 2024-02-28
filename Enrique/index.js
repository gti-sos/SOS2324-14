const movies_data = require("./index-EGO")

const API_BASE = "/api/v1";

module.exports = (app) => {
    
    let dataset = new Array();

    app.get(API_BASE+"/movies-dataset/loadInitialData", (req, res) => {
        if (dataset.length === 0) {
            for(let i=0; i < movies_data.length; i++){
                dataset.push(movies_data[i]);
            }
            res.sendStatus(201, "Created");
        } else {
            res.sendStatus(201, "Created");
            //res.send("<html><body><h1>Data has been already loaded.</h1></body></html>");
        }
    });
    
    
    app.get(API_BASE+"/movies-dataset", (req, res) => {
            res.send(JSON.stringify(dataset));
    });

}