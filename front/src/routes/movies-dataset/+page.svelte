<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Button, ListGroup, ListGroupItem, NavLink, Container, Row, Col, Alert } from '@sveltestrap/sveltestrap';

    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    let movies = []
    let errorMsg = ""
    let successMsg = ""

    onMount(() => {
        getMovies();
    });

    async function loadInitialData() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API+"/loadInitialData", {
                                        method: "GET"
                                    });
            console.log(`Exito cargando peliculas.`);
            response.type
            if (response.status == 201){
                getMovies(); 
                successMsg = "Datos iniciales cargados con exito."
            } else { 
                errorMsg = "La base de datos esta llena, no se puede volver a cargar."
            }
        } catch (error) {
            errorMsg = error;
        }
    }

    async function getMovies() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API, {
                                        method: "GET"
                                    });
            let data = await response.json();
            movies = data;
            console.log(movies);
            
            if (response.status != 200) {
                errorMsg = "No se ha encontrado la colección."
            }
        } catch (error) {
            errorMsg = error;
        }
    }

    async function deleteMovie(title) {
        successMsg, errorMsg = "", "";
        try {
            console.log(`Deleting movie with title ${title}`);

            let response = await    fetch(API+`/${title}`, {
                                        method: "DELETE"
                                    });
            if (response.status == 200){
                getMovies();
                successMsg = `La pelicula ${title} se ha borrado correctamente.`
            }
            else
                errorMsg = `No se ha podido borrar la pelicula ${title}. \nSeguramente no exista`
        } catch (error) {
            errorMsg = error;
        }
        
    }

    async function deleteColection() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API, {
                                        method: "DELETE"
                                    });
            console.log(`Deleted`);
            if (response.status == 200){
                getMovies();
                successMsg = "Colección borrada con exito."
            } else
                errorMsg = "La colección ya estaba vacía."
        } catch (error) {
            errorMsg = error;
        }
    }
</script>
<Container>
    <Row>
        {#if errorMsg != ""}
            <Alert color="danger">
                <h4>Error</h4>
                {errorMsg}
            </Alert>
        {:else if successMsg != ""}
            <Alert color="success">
                <h4>Exito</h4>
                {successMsg}
            </Alert>
        {/if}
    </Row>
    <Row>
        <h1><strong>Lista de Películas</strong></h1>
    </Row>
    <Row>
        {#if movies.length == 0}
            <p>La lista está vacía</p>
            <p>Para insertar datos pulsa este botón -> <Button size="md" outline color="primary" on:click={loadInitialData}>Rellenar</Button></p>
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
</Container>