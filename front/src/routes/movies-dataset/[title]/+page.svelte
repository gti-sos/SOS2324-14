<script>
    import {onMount} from "svelte";
    import { page } from '$app/stores';
    import { Button, ListGroup, ListGroupItem, Container, Row, Col } from '@sveltestrap/sveltestrap';
    import { dev } from "$app/environment";
    
    let title = $page.params.title;


    let API = "/api/v1/movies-dataset";
    if(dev)
        API = "http://localhost:10002"+API

    let movie = {}
    let errorMsg = ""

    onMount(() => {
        getMovie(title);
    });

    async function getMovie(title) {
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

</script>
<Container>
    <Row>
        <Col  xs="6" sm="4"><Button size="sm" href="/movies-dataset">Volver a la API </Button></Col>
    </Row>
    <Row>
        <h2>Detalles de {title}</h2>
    </Row>
    <Row>
        <ListGroup>
            {#each Object.keys(movie) as campo} 
            <ListGroupItem>
                <strong>{campo}</strong> : {movie[campo]}</ListGroupItem>
            {/each}
        </ListGroup>
    </Row>
</Container>