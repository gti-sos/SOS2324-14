import {movies_data} from "./data-EGO.js";

const API_BASE = "/api/v2";

//Funcion comprueba campos
function compruebaCampos(movie) {
    // Lista de boleanos para comprobar
    let comprueba = [];
    // Lista para los campos originales
    let camposOriginal = Object.keys(movies_data[0]);
    for(let i=0; i<Object.keys(movie).length;i++) {
        // Para cada campo dentro de cada nueva pelicula añadida en el post, comprueba si todos los campos son correctos
        comprueba.push(camposOriginal.includes(Object.keys(movie)[i])); // Movie es un parametro de entrada en la funcion
    }
    
    return comprueba.reduce((a,b) => a && b);
}

function api_EGO_v2(app, dbMovies) {
    
    app.get(API_BASE+"/movies-dataset/loadInitialData", (req, res) => {
        dbMovies.find({}, (err, docs) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {   
                if (docs.length === 0) {
                    // Si la base de datos esta vacía añade los 10 primeros datos
                    dbMovies.insert(movies_data);
                    res.sendStatus(201, "Created");
                } else {
                    // Si la base de datos no esta vacía muestra el error 409
                    res.sendStatus(409, "Conflict");
                }
            }
        })
    });

    // GET Para la documentación en postman
    app.get(API_BASE+"/movies-dataset/docs", (req, res) => {
        res.redirect(302, 'https://documenter.getpostman.com/view/33038669/2sA3BobXoX');
    })

    // GET Base
    app.get(API_BASE+"/movies-dataset", (req, res) => {
        dbMovies.find({}).sort({ index: 1 }).exec((err, movies) => {
            if(err){
                res.sendStatus(500, "Internal Error");    
            } else {
                let sinIdMovies = movies.map((c) => {
                    delete c._id;
                    return c
                });
                if (!(Object.keys(req.query).length === 0)) {

                    // Si hay una query para paginar, pagina el recurso
                    if (req.query.limit && req.query.offset) {
                        let limit = req.query.limit;
                        let offset = req.query.offset;

                        res.send(JSON.stringify(sinIdMovies.slice(offset, offset+limit)));
                    // Si solo esta el campo limit, muestra la cantidad de elementos que indica limit
                    } else if (req.query.limit && !req.query.offset) {
                        let limit = req.query.limit;

                        res.send(JSON.stringify(sinIdMovies.slice(0, limit)));
                    // Si solo esta el campo offset, muestra el objeto que esta en esa posicion
                    } else if (!req.query.limit && req.query.offset) {
                        let offset = req.query.offset;

                        res.send(JSON.stringify(sinIdMovies[offset]));
                    // En otro caso la query es para buscar por un campo
                    } else if (req.query){
                        let showMovies = [];

                        let campos = Object.entries(req.query);
                        sinIdMovies.forEach(movie => {
                            let verdad = [];
                            let specialFields = ['genres', 'keywords', 'production_companies', 'production_countries', 'release_date'];
                            campos.forEach(entrada => {
                                let clave = entrada[0];
                                let valor = entrada[1];
                                // Si la clave se refiere a index, al ser un valor numérico hay que parsearlo
                                if (clave === 'index') {
                                    verdad.push(movie[clave] === parseInt(valor));
                                // Si el la clave del parámetro de busqueda coincide con alguno de la lista specialFields, se hara la busqueda especial para ellos
                                } else if (specialFields.includes(clave)) {
                                    verdad.push(movie[clave].includes(valor));
                                // Si no requiere ningun filtrado especial se busca sin mas
                                } else {
                                    verdad.push(movie[clave] === valor);
                                }
                            })
                            // Comprueba que la busqueda haya sido correcta
                            if (verdad.reduce((a, b) => a && b)) {
                                showMovies.push(movie);
                            }
                        })
                        // Devuelve los objetos que coincidan con la busqueda 
                        res.send(JSON.stringify(showMovies));
                    }
                } else {
                    // Si no, muestra el recurso entero
                    res.send(JSON.stringify(sinIdMovies));
                } 
            }
        });
    });

    app.get(API_BASE+"/movies-dataset/dataLollipop", (req, res) => {
        let graphData = []
        dbMovies.find({}).sort({ revenue: -1 }).limit(10).exec((err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                let sinIdMovies = doc.map((c) => {
                    delete c._id;
                    return c
                });
                sinIdMovies.forEach(movie => {
                    graphData.push({
                                    'name':movie.original_title,
                                    'y':movie.revenue
                                    });
                });
                res.send(JSON.stringify(graphData));
            }
        });
    });

    // POST Nueva pelicula
    app.post(API_BASE+"/movies-dataset", (req, res) => {
        let movie = req.body;
        
        dbMovies.find({}, (err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } 
            if (doc.length !== 0){
            // Si la base de datos no esta vacia:
                // Comprobar si la pelicula es un Array o un JSON
                if (movie instanceof Array) {
                    // Por ahora solo contemplo que los POST se hagan con un JSON, si en el body hay un Array, sera un POST no válido
                    res.status(415).send("Unsupported Media Type. Arrays are not currently supported by the API.");
                } else {
                    // Comprueba el resultado de la funcion compruebaCampos
                    if (compruebaCampos(movie)) {
                        // Comprobamos que en la base de datos no haya una pelicula con el mismo nombre que el post
                        if (doc.find(pelis => pelis.original_title === movie.original_title)) {
                            // 16.2 POST A recurso existente
                            res.sendStatus(409, "Conflict");
                        } else {
                            // Si todos los campos son correctos y no hay otra pelicula igual, hacemos el POST
                            dbMovies.insert(movie);
                            res.sendStatus(201, "Created");
                        }
                    } else {
                        // 16.3 BAD REQUEST POST, los campos del objeto en el POST no son correctos
                        res.sendStatus(400, "Bad Request");
                    }
                } 
            } else {
                // Si la base de datos está vacía, se puede hacer el post correctamente, siempre que los campos coincidan con los esperados
                if (compruebaCampos(movie)) {
                    dbMovies.insert(movie);
                    res.sendStatus(201, "Created");
                } else {
                    res.sendStatus(400, "Bad Request");
                }
            }    
        });
    });

    // DELETE Del la colección
    app.delete(API_BASE+"/movies-dataset", (req, res) => {
        dbMovies.find({}, (err, docs) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {  
                if (docs.length === 0) {
                    // Si la base de datos ya esta vacía, devuelve un codigo 409
                    res.sendStatus(409, "Conflict");
                } else {
                    dbMovies.remove({}, { multi: true }, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500, "Internal Error");
                        } else {
                            res.status(200).send(`OK, ${numRemoved} data deleted`);
                        }
                    });
                }
            }
        });
    });

    // D01 punto 3 de por persona, filtrar por genero, compañia y año por defecto
    app.get(API_BASE+"/movies-dataset/:genero/:company/:year", (req, res) => {
        let genero = req.params.genero;
        let company = req.params.company;
        let year = req.params.year;
        dbMovies.find({}, (err, movies) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                let sinIdMovies = movies.map((c) => {
                    delete c._id;
                    return c;
                });
                let resPelis = {};
                sinIdMovies.forEach(movie => {
                    if (movie.genres.includes(genero) && movie.release_date.includes(year) && movie.production_companies.includes(company)) {
                        resPelis = movie;
                    }
                })
                if (Object.entries(resPelis).length === 0) {
                    res.sendStatus(404, "Not Found");
                } else {
                    res.send(JSON.stringify(resPelis));
                }
            }
        });
    });

    //D01 hacer un put al recurso con propiedades indicadas en genero y año
    app.put(API_BASE+"/movies-dataset/:genero/:company/:year", (req, res) => {
        let cambio = req.body;
        let genero = req.params.genero;
        let company = req.params.company;
        let year = req.params.year;
        dbMovies.update({ genres: { $regex: eval(`/`+genero+`/`)}, production_companies: {$regex: eval(`/`+company+`/`)}, release_date: {$regex: eval(`/`+year+`/`)} }, cambio, {}, (err, numUpdated) => {
            if (err) {
                res.sendStatus(500);
            } else {
                if (compruebaCampos(cambio)) {
                    if (numUpdated >= 1) {
                        res.sendStatus(201, "Created");
                    } else {
                        res.sendStatus(404, "Not Found");
                    }
                } else {
                    res.sendStatus(400, "Bad Request");
                }
            }
        });
    });

    // D01 borrar los recursos que coincidan con las propiedades indicadas
    app.delete(API_BASE+"/movies-dataset/:genero/:company/:year", (req, res) => {
        let genero = req.params.genero;
        let company = req.params.company;
        let year = req.params.year;
        dbMovies.remove({ genres: { $regex: eval(`/`+genero+`/`)}, production_companies: {$regex: eval(`/`+company+`/`)}, release_date: {$regex: eval(`/`+year+`/`)} }, {}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500), "Internal Error";
            } else {
                if (numRemoved >= 1) {
                    res.status(200).send(`Ok. ${numRemoved} resource removed `);
                } else {
                    res.sendStatus(404);
                }
            }
        });
    });

    // 16.4 GET Un recurso inexistente
    app.get(API_BASE+"/datos-peliculas", (req, res) => {
        res.sendStatus(404, "Not Found");
    });

    // 16.5 PUT No permitido
    app.put(API_BASE+"/movies-dataset", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    // GET Del un recurso por su titulo
    app.get(API_BASE+"/movies-dataset/:title", (req, res) => {
        let title = req.params.title;
        // Buscamos las peliculas cuyo titulo original coincide con el recurso buscado
        dbMovies.find({ original_title: title }, (err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                let sinIdMovies = doc.map((c) => {
                    delete c._id;
                    return c;
                });
                if (doc.length === 0) {
                    res.sendStatus(404, "Not Found");
                } else {
                    res.send(JSON.stringify(sinIdMovies[0]));
                }
            }
        });
    });

    // POST No permitido en un recurso
    app.post(API_BASE+"/movies-dataset/:title", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    //16.1 PUT Con el mismo id
    app.put(API_BASE+"/movies-dataset/:title", (req,res) => {
        let cambio = req.body;
        let title = req.params.title;
        dbMovies.find({ original_title: title}, (err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (compruebaCampos(cambio)) {
                    let objeto = doc[0];
                    if (doc.length === 0) {
                        res.sendStatus(404, "Not Found");
                    } else {
                        if (cambio.original_title === objeto.original_title) {
                            // Utilizo inser con upsert = true para que el objeto ya existente se actualice, es decir se haga el PUT
                            dbMovies.update({ original_title: title}, cambio, { upsert: true }); 
                            res.sendStatus(201, "Created");
                        } else {
                            res.sendStatus(400, "Bad Request");
                        }
                    }
                } else {
                    res.sendStatus(400, "Bad Request");
                }
            }
        });
    });

    // DELETE El recurso por su titulo
    app.delete(API_BASE+"/movies-dataset/:title", (req, res) => {
        let title = req.params.title;

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
        });
    });
}

export { api_EGO_v2 };