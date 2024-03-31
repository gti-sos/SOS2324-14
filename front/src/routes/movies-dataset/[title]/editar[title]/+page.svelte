<script>
    import { page } from '$app/stores';
    import { Button, Input, Container, Row, Col } from '@sveltestrap/sveltestrap';
    import { dev } from "$app/environment";
    
    let title = $page.params.title;

    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    let movie = {}
    let errorMsg = ""

    function compruebaError(error) {
        if(error==409)
            errorMsg = "Estás intentando introducir datos que ya estan en la base de datos."
        else if (error == 400) 
            errorMsg = "Mala petición. Has introducido valores erroneos."
        else if (error==201 || error == 200)
            errorMsg = ""
    }

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

    movie = getMovieObject(title);

    async function actualizaPelicula() {
        
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
            
            if (status == 201)
                window.location.href = "/movies-dataset"
            else
                compruebaError(status);
        } catch (error) {
            compruebaError(error);
        }
        
    }

</script>
<Container>
    <h1>Editar Película</h1>
    <Row cols={4}>
        {#each Object.keys(movie) as clave}
            <Col><strong>{clave}:</strong> <Input bind:value={movie[clave]}/></Col>
        {/each}
    </Row>
    <Row>
        <Col xs="auto"><Button size="md" color="success" on:click={actualizaPelicula}>Confirmar</Button></Col>
    </Row>
    <Row>
        {#if errorMsg != ""}
            ERROR: {errorMsg}
        {/if}
    </Row>
</Container>