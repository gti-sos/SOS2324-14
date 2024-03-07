const movies_data = require("./index-EGO.js")

const API_BASE = "/api/v1";

module.exports = (app, dbMovies) => {
    
    let dataset = new Array();

    app.get(API_BASE+"/movies-dataset/loadInitialData", (req, res) => {
        // if (dataset.length === 0) {
        //     for(let i=0; i < movies_data.length; i++){
        //         dataset.push(movies_data[i]);
        //     }
        //     res.sendStatus(201, "Created");
        // } else {
        //     // 16.2 POST A recurso existente
        //     res.sendStatus(409, "Conflict");
        // }
        dbMovies.insert(movies_data);
        res.sendStatus(200, "OK");
    });

    // GET Base
    app.get(API_BASE+"/movies-dataset", (req, res) => {
        //res.send(JSON.stringify(dataset));
        dbMovies.find({}, (err, movies) => {
            if(err){
                res.sendStatus(500, "Internal Error");    
            } else {
                res.send(JSON.stringify(movies))
                // res.send(JSON.stringify(movies.map((c) => {
                //     delete c._id;
                //     return c;
                // })));
                res.sendStatus(200, "OK");
            }
        })
    });
    // POST Nueva pelicula
    app.post(API_BASE+"/movies-dataset", (req, res) => {
        // Lista de boleanos para comprobar
        let comprueba = [];
        let movie = req.body;
        // Lista con los campos a cumplir
        let camposOriginal = Object.keys(dbMovies[0]);
        for(let i=0; i<Object.keys(movie).length;i++) {
            // Para cada campo dentro de cada nueva pelicula añadida en el post, comprueba si todos los campos son correctos
            comprueba.push(camposOriginal.includes(Object.keys(movie)[i]));
        }
        // Comprueba si el resultado de hacer una operacion AND a toda la lista es true o false
        if (comprueba.reduce((a,b) => a && b)) {
            if (dbMovies.find(objeto => objeto.original_title === movie.original_title)) {
                // En caso de que haya un objeto con el titulo original repetido no se podrá añadir
                res.sendStatus(409, "Conflict")
            } else {
                // Si todos los campos estan correctos, se añade el recurso
                dataset.push(movie);
                res.sendStatus(200, "OK");
            }
        } else {
            // 16.3 BAD REQUEST POST
            res.sendStatus(400, "Bad Request");
        }
    });
    // DELETE Del recurso
    app.delete(API_BASE+"/movies-dataset", (req, res) => {
        while(dataset.length > 0) {
            dataset.pop();
        }
        res.sendStatus(200, "OK");
    });
    // 16.4 GET Un recurso inexistente
    app.get(API_BASE+"/datos-peliculas", (req, res) => {
        res.sendStatus(404, "Not Found");
    });
    // 16.5 PUT No permitido
    app.put(API_BASE+"/movies-dataset", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });
    // GET Del recurso Avatar
    app.get(API_BASE+"/movies-dataset/Avatar", (req, res) => {
        if (dataset.filter(objeto => objeto.original_title === "Avatar")) {
            res.send(JSON.stringify(dataset.filter(objeto => objeto.original_title === "Avatar")));
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "Not Found");
        }
    });
    // POST No permitido en un recurso
    app.post(API_BASE+"/movies-dataset/:name", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    //16.1 PUT Con el mismo id
    app.put(API_BASE+"/movies-dataset/Avatar", (req,res) => {
        let cambio = req.body;
        if (cambio.original_title === "Avatar"){
            dataset[dataset.findIndex(objeto => objeto.original_title === "Avatar")] = cambio;
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(400, "Bad Request");
        }
    })
    // DELETE El recurso Avatar
    app.delete(API_BASE+"/movies-dataset/:title", (req, res) => {
        let title = req.params.title;

        if (title.includes("%20")) {
            title = encodeURIComponent(nombre);
        }

        dbMovies.remove({"original_title": title}, {}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (numRemoved >= 1) {
                    res.sendStatus(200, "OK");
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        })
    });
}