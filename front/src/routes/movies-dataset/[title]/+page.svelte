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
    let successMsg = ""

    onMount(() => {
        getMovieObject();
    });

    async function getMovieObject() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API+`/${title}`, {
                                        method: "GET"
                                    });
            let data = await response.json();
            movie = data;
            console.log(movie);
            if (response.status != 200) {
                errorMsg = `No se ha podido encontrar la pelicula ${title}.`
            }
        } catch (error) {
            errorMsg = error;
        }
        
    }
</script>
<Container>
    <Row>
        <Col  xs="6" sm="4"><Button color="danger" size="sm" href="/movies-dataset">Volver a la API </Button></Col>
    </Row>
    <Row>
        <Col><h2>Detalles de {title}</h2></Col> 
        <Col class="d-flex justify-content-end">
            <div class="d-flex justify-content-center align-items-center">
                <Button style="margin-top: auto;" size="sm" color="warning" href="/movies-dataset/{title}/editar{title}">Editar recurso</Button>
            </div>
        </Col>
    </Row>
    <ListGroup>
        {#each Object.keys(movie) as campo} 
            <ListGroupItem>
                <Row>
                    <Col><strong>{campo}</strong> : {movie[campo]} </Col>
                </Row>
            </ListGroupItem>
        {/each}
    </ListGroup>
</Container>