<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Button, ListGroup, ListGroupItem, NavLink, Container, Row, Col } from '@sveltestrap/sveltestrap';

    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    let movies = []
    let errorMsg = ""

    function compruebaError(error) {
        if(error==409)
            errorMsg = "Estás intentando introducir datos que ya estan en la base de datos."
        else if (error == 400)
            errorMsg = "Mala petición. Has introducido valores erroneos."
        else if (error==201 || error == 200)
            errorMsg = ""
    }

    onMount(() => {
        getMovies();
    });

    async function loadInitialData() {
        try {
            let response = await    fetch(API+"/loadInitialData", {
                                        method: "GET"
                                    });
            console.log(`Exito cargando peliculas.`);
            response.type
            if (response.status == 201)
                getMovies();
            else
                compruebaError(response.status);
        } catch (error) {
            compruebaError(error);
        }
    }

    async function getMovies() {
        try {
            let response = await    fetch(API, {
                                        method: "GET"
                                    });
            let data = await response.json();
            movies = data;
            console.log(movies);
            
            compruebaError(response.status);
        } catch (error) {
            compruebaError(error);
        }
    }
    
    // async function createMovie() {
    //     //let addedMovie = {}
        
    //     try {
    //         let response = await    fetch(API, {
    //                                     method: "POST",
    //                                     headers:{
    //                                         "Content-Type": "application/json"
    //                                     },
    //                                     body: JSON.stringify(newMovie)
    //                                 });
    //         let status = await response.status;
    //         console.log(`Creation response status ${status}`);
    //         if(newMovie.original_title != "Superman Returns"){
    //             window.location.href = `movies-dataset/${newMovie.original_title}`;
    //         } 
            
    //         if (status == 201)
    //             getMovies();
    //         else
    //             compruebaError(status);
    //     } catch (error) {
    //         compruebaError(error);
    //     }
        
    // }

    async function deleteMovie(title) {
        try {
            console.log(`Deleting movie with title ${title}`);

            let response = await    fetch(API+`/${title}`, {
                                        method: "DELETE"
                                    });
            if (response.status == 200)
                getMovies();
            else
                compruebaError(response.status);
        } catch (error) {
            compruebaError(error);
        }
        
    }

    async function deleteColection() {
        try {
            let response = await    fetch(API, {
                                        method: "DELETE"
                                    });
            console.log(`Deleted`);
            if (response.status == 200)
                getMovies();
            else
                compruebaError(response.status);
        } catch (error) {
            compruebaError(error);
        }
    }
</script>
<Container>
    <Row>
        <h1><strong>Lista de Películas</strong></h1>
    </Row>
    <Row>
        {#if movies.length == 0}
            <p>La lista está vacía</p>
            <p>Para insertar datos pulsa este botón <Button size="md" outline color="primary" on:click={loadInitialData}>Rellenar</Button></p>
        {/if}
    </Row>
    <Row>
        <ListGroup>
            {#each movies as movie} 
            <ListGroupItem>
                <NavLink active href="movies-dataset/{movie.original_title}">
                    {movie.original_title}</NavLink><strong>Director:</strong> {movie.director}, <strong>Estreno:</strong> {movie.release_date} <Button size="sm" color="danger" on:click={deleteMovie(movie.original_title)}>Borrar</Button></ListGroupItem>
            {/each}
        </ListGroup>
    </Row>
    {#if !movies.length == 0}
    <Row>
        <Col xs="auto">Añade una nueva película <Button href="movies-dataset/añadirPelicula" size="md" color="warning">Añadir</Button></Col>
    </Row>
    <Row>
        <Col xs="auto">Eliminar la coleccion <Button outline size="md" color="danger" on:click={deleteColection}>Borrar Todo</Button></Col>
    </Row>
    {/if}
    
    <Row>
        {#if errorMsg != ""}
            ERROR: {errorMsg}
        {/if}
    </Row>
</Container>