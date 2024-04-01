<script>
    import {onMount} from "svelte";
    import { Container, Button, Col, Row, Input } from '@sveltestrap/sveltestrap';
    import { dev } from "$app/environment";

    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    onMount(() => {
        getMovies();
    });

    let placeholderMovie = {"index": 10, "budget": 270000000, "genres": "Adventure, Fantasy, Action, Science, Fiction", "id": 1452, "keywords": "saving the world dc comics invulnerability sequel superhero", "original_language": "en", "original_title": "Superman Returns", "overview": "Superman returns to discover his 5-year absence has allowed Lex Luthor to walk free, and that those he was closest too felt abandoned and have moved on. Luthor plots his ultimate revenge that could see millions killed and change the face of the planet forever, as well as ridding himself of the Man of Steel.", "popularity": 57.925623, "production_companies": "DC Comics, Legendary Pictures, Warner Bros., Bad Hat Harry Productions", "production_countries": "United States of America", "release_date": "2006-06-28", "revenue": 391081192, "runtime": 154, "status": "Released", "tagline": "", "title": "Superman Returns", "vote_average": 5.4, "vote_count": 1400, "director": "Bryan Singer"}
    //let newMovie = {"index": 0, "budget": 0, "genres": "", "id": 0, "keywords": "", "original_language": "", "original_title": "", "overview": "", "popularity": 0.0, "production_companies": "", "production_countries": "", "release_date": "", "revenue": 0, "runtime": 0, "status": "", "tagline": "", "title": "", "vote_average": 0.0, "vote_count": 0, "director": ""}

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

    let totalPeliculas = []
    let cantidadPeliculas = 0

    async function getMovies() {
        try {
            let response = await    fetch(API, {
                                        method: "GET"
                                    });
            let data = await response.json();
            movies = data;
            totalPeliculas = movies;
            console.log(movies);
            cantidadPeliculas = totalPeliculas.length
            console.log(`Total peliculas: ${cantidadPeliculas}`)
            
            compruebaError(response.status);
        } catch (error) {
            compruebaError(error);
        }
    }

    async function createMovie() {
        //let addedMovie = {}
        
        try {
            let response = await    fetch(API, {
                                        method: "POST",
                                        headers:{
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(placeholderMovie)
                                    });
            let status = await response.status;
            console.log(`Creation response status ${status}`); 
            
            if (status == 201)
                window.location.href = "/movies-dataset"
            else
                compruebaError(status);
        } catch (error) {
            compruebaError(error);
        }
        
    }
// tienes que añadir despes del boton añadir una comprobacion de si no da error volver y si da error permanecer
</script>
<Container>
    <Row>
        <Col><h1>Añadir Película</h1></Col>
        <hr>
    </Row>
    <Row cols={4}>
        {#each Object.keys(placeholderMovie) as clave}
            {#if clave==="index"}
                <Col><strong>{clave}:</strong> <Input bind:value={cantidadPeliculas}/></Col>
            {:else}
                <Col><strong>{clave}:</strong> <Input bind:value={placeholderMovie[clave]}/></Col>
            {/if}
        {/each}
    </Row>
    <Row>
        <Col xs="auto"><Button size="md" color="success" on:click={createMovie}>Añadir</Button></Col>
    </Row>
    <Row>
        {#if errorMsg != ""}
            ERROR: {errorMsg}
        {/if}
    </Row>
</Container>