<script>
    import {onMount} from "svelte";
    import { Container, Button, Col, Row, Input, Alert } from '@sveltestrap/sveltestrap';
    import { dev } from "$app/environment";

    let API = "/api/v1/movies-dataset";
    if(dev)
        API = "http://localhost:10002"+API

    onMount(() => {
        getMovies();
    });

    let placeholderMovie = {"index": 10, "budget": 270000000, "genres": "Adventure, Fantasy, Action, Science, Fiction", "id": 1452, "keywords": "saving the world dc comics invulnerability sequel superhero", "original_language": "en", "original_title": "Superman Returns", "overview": "Superman returns to discover his 5-year absence has allowed Lex Luthor to walk free, and that those he was closest too felt abandoned and have moved on. Luthor plots his ultimate revenge that could see millions killed and change the face of the planet forever, as well as ridding himself of the Man of Steel.", "popularity": 57.925623, "production_companies": "DC Comics, Legendary Pictures, Warner Bros., Bad Hat Harry Productions", "production_countries": "United States of America", "release_date": "2006-06-28", "revenue": 391081192, "runtime": 154, "status": "Released", "tagline": "", "title": "Superman Returns", "vote_average": 5.4, "vote_count": 1400, "director": "Bryan Singer"}
    const camposPelículas = Object.keys(placeholderMovie)

    let movies = []
    let errorMsg = ""
    let successMsg = ""

    let totalPeliculas = []
    let cantidadPeliculas = 0

    async function getMovies() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API, {
                                        method: "GET"
                                    });
            let data = await response.json();
            movies = data;
            totalPeliculas = movies;
            cantidadPeliculas = totalPeliculas.length
            
            if (response.status != 200) {
                errorMsg = "No se ha encontrado la colección."
            }
        } catch (error) {
            errorMsg = error;
        }
    }

    async function createMovie() {
        successMsg, errorMsg = "", "";
        try {
            placeholderMovie.index = cantidadPeliculas
            let response = await    fetch(API, {
                                        method: "POST",
                                        headers:{
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(placeholderMovie)
                                    });
            let status = await response.status;
            console.log(`Creation response status ${status}`); 
            
            if (status == 201) {
                successMsg = "Pelicula añadida correctamente."
                setTimeout(() => {
                    window.location.href = "/movies-dataset"
                }, 1000);
            }
            else
                errorMsg = `Ya existe una pelicula con titulo ${placeholderMovie.original_title}.`
        } catch (error) {
            errorMsg = error;
        }
        
    }

    export { camposPelículas };
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
        <Col><h1>Añadir Película</h1></Col><hr>
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
</Container>