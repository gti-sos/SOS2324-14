<script>
    import { onMount } from "svelte";
    import { page } from '$app/stores';
    import { Button, ListGroup, ListGroupItem, Container, Row, Col } from '@sveltestrap/sveltestrap';
    import { dev } from "$app/environment";
    

    let fighter1 = $page.params.fighter1;
    let fighter2 = $page.params.fighter2;
    let date = $page.params.date;
    let name = `${fighter1}/${fighter2}/${date}`
    let title = `${fighter1} vs ${fighter2}`;

    let API = "/api/v1/ufc-events-data";
    if(dev)
        API = "http://localhost:10002" + API;

    let event = {};
    let errorMsg = "";

    onMount(() => {
        getEventDetails(fighter1, fighter2, date);
    });

    async function getEventDetails(fighter1, fighter2, date) {
        try {
            let response = await fetch(`${API}/stats/${fighter1}/${fighter2}/${date}`, {
                method: "GET"
            });
            if (response.ok) {
                event = await response.json();
            } else {
                errorMsg = `Error: ${response.status}`;
            }
        } catch (error) {
            errorMsg = `Error: ${error.message}`;
        }
    }

    async function updateEvent(fighter1, fighter2, date) {
        await getEventDetails(fighter1, fighter2, date);
        
        try {
            let response = await fetch(`${API}/stats/${fighter1}/${fighter2}/${date}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            });
            
            let status = await response.status;
            console.log(`Update response status ${status}`);
            
            if (status === 200) {
                window.location.href = "/ufc-events-data";
            } else {
                checkError(status);
            }
        } catch (error) {
            checkError(error);
        }
    }
</script>

<Container>
    <Row>
        <Col xs="6" sm="4"><Button color="danger" size="sm" href="/ufc-events-data">Volver a la API</Button></Col>
    </Row>
    <Row>
        <Col><h2>{title}</h2></Col> 
        <Col class="d-flex justify-content-end">
            <Button href="/ufc-events-data/{fighter1}/editar{fighter2}" size="md" color="warning">Editar recurso</Button>
        </Col>
    </Row>
    <ListGroup>
        {#if Object.keys(event).length > 0}
            {#each Object.keys(event) as field} 
                <ListGroupItem>
                    <Row>
                        <Col><strong>{field}</strong> : {event[field]} </Col>
                    </Row>
                </ListGroupItem>
            {/each}
        {:else}
            <ListGroupItem>
                <Row>
                    <Col>Error: {errorMsg}</Col>
                </Row>
            </ListGroupItem>
        {/if}
    </ListGroup>
</Container>
