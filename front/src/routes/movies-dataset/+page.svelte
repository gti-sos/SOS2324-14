<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Button, Col, Row } from '@sveltestrap/sveltestrap';

    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    let movies = []
    let newMovie = {}
    let errorMsg = ""

    onMount(() => {
        getMovies();
    });

    async function loadInitialData() {
        try {
            let response = await    fetch(API+"/loadInitialData", {
                                        method: "GET"
                                    });
            console.log(`Exito cargando peliculas.`);
            if (response.status == 201)
                getMovies();
            else
                errorMsg = "code: "+ response.status;
        } catch (error) {
            errorMsg = error;
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
        } catch (error) {
            errorMsg = error;
        }
        
    }
    
    // async function createMovie() {
    //     let nextMovie = {"index": 10, "budget": 270000000, "genres": "Adventure, Fantasy, Action, Science, Fiction", "id": 1452, "keywords": "saving the world dc comics invulnerability sequel superhero", "original_language": "en", "original_title": "Superman Returns", "overview": "Superman returns to discover his 5-year absence has allowed Lex Luthor to walk free, and that those he was closest too felt abandoned and have moved on. Luthor plots his ultimate revenge that could see millions killed and change the face of the planet forever, as well as ridding himself of the Man of Steel.", "popularity": 57.925623, "production_companies": "DC Comics, Legendary Pictures, Warner Bros., Bad Hat Harry Productions", "production_countries": "United States of America", "release_date": "2006-06-28", "revenue": 391081192, "runtime": 154, "status": "Released", "tagline": "", "title": "Superman Returns", "vote_average": 5.4, "vote_count": 1400, "director": "Bryan Singer"}
    //     try {
    //         let response = await    fetch(API, {
    //                                     method: "POST",
    //                                     headers:{
    //                                         "Content-Type":"application/json"
    //                                     },
    //                                     body: JSON.stringify(newMovie)
    //                                 });
    //         let status = await response.status;
            
    //         console.log(`Creation response status ${status}`);
    //         if (status == 201)
    //             getMovies();
    //         else
    //             errorMsg = "code: "+ status;
    //     } catch (error) {
    //         errorMsg = error;
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
                errorMsg = "code: "+ response.status;
        } catch (error) {
            errorMsg = error;
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
                errorMsg = "code: "+ response.status;

        } catch (error) {
            errorMsg = error;
        }
    }

</script>

{#if movies.length == 0}
Inicialmente la lista está vacia
Pulsa este botón para llenarla 
{/if}
<Button outline size="md" color="primary" on:click={loadInitialData()}>Cargar</Button>


<ul>
    {#each movies as movie}
        <li><a href="movies-dataset/{movie.original_title}">{movie.original_title}</a>, <strong>Director:</strong> {movie.director}, <strong>Estreno:</strong> {movie.release_date} <Button size="sm" color="danger" on:click={deleteMovie(movie.original_title)}>Borrar</Button></li>
    {/each}
</ul>

{#if !(movies.length == 0)}
Mal
{/if}
<Button outline size="md" color="danger" on:click={deleteColection()}>Borrar Todo</Button>
{#if errorMsg != ""}
ERROR: {errorMsg}
{/if}