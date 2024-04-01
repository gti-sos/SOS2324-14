<script>
    import { page } from '$app/stores';
    import { Button, Input, Container, Row, Col, Alert } from '@sveltestrap/sveltestrap';
    import { dev } from "$app/environment";
	import { onMount } from 'svelte';
    
    let title = $page.params.title;

    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    onMount(() => {
        getMovieObject(title);
    })

    let movie = {}
    let errorMsg = ""
    let successMsg = ""

    async function getMovieObject(title) {
        try {
            let response = await    fetch(API+`/${title}`, {
                                        method: "GET"
                                    });
            let data = await response.json();
            movie = data;
            console.log(movie);
        } catch (error) {
            errorMsg = error;
        }
    }

    async function actualizaPelicula() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API+`/${title}`, {
                                        method: "PUT",
                                        headers:{
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(movie)
                                    });
            let status = await response.status;
            console.log(`Creation response status ${status}`); 
            
            if (status == 201){
                successMsg = "Pelicula actualizada correctamente."
                setTimeout(() => {
                    window.location.href = `/movies-dataset/${title}`
                }, 2000)
            }
            else
                errorMsg = "No esta permitido cambiar el titulo original de la película al editar"
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
        <h1>Editar {title}</h1><hr>
    </Row>
    <Row cols={4}>
        {#each Object.keys(movie) as clave}
            <Col><strong>{clave}:</strong> <Input bind:value={movie[clave]}/></Col>
        {/each}
    </Row>
    <Row>
        <Col xs="auto"><Button size="md" color="success" on:click={actualizaPelicula}>Confirmar</Button></Col>
    </Row>
</Container>