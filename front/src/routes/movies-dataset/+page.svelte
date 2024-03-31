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
        <h1><strong>Lista de Películas</strong></h1>
    <Row>
        {#if movies.length == 0}
            <p>La lista está vacía</p>
            <p>Para insertar datos pulsa este botón <Button size="md" outline color="primary" on:click={loadInitialData}>Rellenar</Button></p>
        {/if}
    </Row>
    <div>
        <ListGroup>
            {#each movies as movie}
            <ListGroupItem>
                <Row>
                    <Col xs=10>
                        <NavLink active href="movies-dataset/{movie.original_title}">{movie.original_title}</NavLink>
                        
                        <strong>Director:</strong> {movie.director}, <strong>Estreno:</strong> {movie.release_date}
                    </Col>
                    
                    <Col xs="2" class="d-flex justify-content-center"><Button size="sm" color="danger" on:click={deleteMovie(movie.original_title)}>Borrar</Button></Col> 
                </Row>
            </ListGroupItem>
            {/each}
        </ListGroup>
    </div>
    
    {#if !movies.length == 0}
    <Row>
        <Col xs="auto">Añade una nueva película <Button href="movies-dataset/añadirPelicula" size="sm" color="warning">Añadir</Button></Col>
    </Row>
    <Row>
        <Col xs="auto">Eliminar la coleccion <Button outline size="sm" color="danger" on:click={deleteColection}>Borrar Todo</Button></Col>
    </Row>
    {/if}
    
    <Row>
        {#if errorMsg != ""}
            ERROR: {errorMsg}
        {/if}
    </Row>
</Container>