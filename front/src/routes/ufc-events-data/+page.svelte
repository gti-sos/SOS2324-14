<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    
    import { Button, Container, Row, Col, ListGroup, ListGroupItem, NavLink, Alert } from '@sveltestrap/sveltestrap';
  
    let API = "/api/v2/ufc-events-data";
  
    if (dev)
      API = "http://localhost:10002" + API;
  
    let events = [];
    let errorMsg = "";
    let successMsg="";
    
  

    function clearSuccessMsg() {
        successMsg = "";
    }

    function clearErrorMsg() {
        errorMsg = "";
    }

    function checkError(error) {
      if (error === 409)
        errorMsg = "Estás intentando introducir datos que ya están en la base de datos.";
      else if (error === 400)
        errorMsg = "Mala petición. Has introducido valores erróneos.";
      else if (error === 201)
        successMsg = "Contenido añadido con éxito.";
      else
        errorMsg = "";

      if (errorMsg !== "") {
          setTimeout(clearErrorMsg, 3000);
      } else if (successMsg !== "") {
          setTimeout(clearSuccessMsg, 3000);
      }
    }
  
    async function loadInitialData() {
      try {
        let response = await fetch(API + "/loadInitialData", { method: "GET" });
        if (response.ok) {
          console.log(`Éxito cargando eventos de UFC.`);
          getEvents();
          checkError(response.status);
        } else {
          checkError(response.status);
        }
      } catch (error) {
        checkError(error);
      }
    }
  
    async function getEvents() {
        successMsg, errorMsg = "", "";
        try {
            let response = await fetch(API, { method: "GET" });
            if (response.ok) {
            events = await response.json(); // Update events with fetched data
            console.log(events);
            checkError(response.status);
            }
            else if (response.status != 200) {
                errorMsg = "No se ha encontrado la colección."
            } 

        } catch (error) {
            checkError(error);
        }
    }
 
    async function deleteEvent(fighter1, fighter2, date) {
        try {
        // Encode fighter names and date for URL safety
            const encodedFighter1 = encodeURIComponent(fighter1);
            const encodedFighter2 = encodeURIComponent(fighter2);
            const encodedDate = encodeURIComponent(date);

            const response = await fetch(`${API}/stats/${encodedFighter1}/${encodedFighter2}/${encodedDate}`, {
                method: "DELETE",
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                getEvents(); // Refresh the event list after successful deletion
                successMsg = "Elemento eliminado con éxito"
            } else {
                checkError(response.status);
            }
        } catch (error) {
            checkError(error);
        }
    }

  
    async function deleteAllEvents() {
      try {
        let response = await fetch(API, { method: "DELETE" });
        console.log(`Deleted`);
        if (response.ok) {
          getEvents();
          checkError(response.status);
          successMsg = "Colección eliminada con éxito"
        } else {
          checkError(response.status);
        }
      } catch (error) {
        checkError(error);
      }
    }
  
    onMount(getEvents);
</script>
  
<style>
  .event-box {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
</style>

<Container>
  <Row>
    {#if errorMsg != ""}
        <Alert color="danger">
            <h4>Error</h4>
            {errorMsg}
            <script>
              setTimeout(clearErrorMsg, 2000);
            </script>
        </Alert>
    {:else if successMsg != ""}
        <Alert color="success">
            <h4>Exito</h4>
            {successMsg}
            <script>
              setTimeout(clearSuccessMsg, 2000);
            </script>
        </Alert>
    {/if}
</Row>

  <h1><strong>Eventos de UFC</strong></h1>
  <Row>
    {#if events.length === 0}
      <p>La lista está vacía</p>
    {/if}
  </Row>
  <div class="event-box">
    <ListGroup>
        {#each events as event }
          <ListGroupItem>
            <Row class="event-box">
              <Col xs="10">
                <NavLink href="ufc-events-data/{encodeURIComponent(event.fighter1)}/{encodeURIComponent(event.fighter2)}/{encodeURIComponent(event.date)}">
                  <strong>{event.fighter1} vs {event.fighter2} </strong><br>
                  <span><strong>Fecha:</strong> {event.date}, <strong>Lugar:</strong> {event.location}</span>
                </NavLink>
              </Col>
              <Col xs="2">
                <Button size="sm" color="danger" on:click={deleteEvent(event.fighter1, event.fighter2, event.date)}>Borrar</Button>

              </Col>
            </Row>
          </ListGroupItem>
        {/each}
      </ListGroup>
      
  </div>
  {#if events.length !== 0}
    <Row class="justify-content-center">
      <Col xs="auto">Eliminar todos los eventos -> <Button outline size="sm" color="danger" on:click={deleteAllEvents}>Borrar Todo</Button></Col>
      <Col xs="auto">Crear un nuevo evento -> <Button href="/ufc-events-data/postEvent" outline size="sm" color="success">Crear Evento</Button></Col>
    </Row>
  {/if}
  {#if events.length === 0}
    <Row class="justify-content-center">
      <Col xs="auto">Insertar datos -> <Button size="sm" outline color="primary" on:click={loadInitialData}>Insertar</Button></Col>
      <Col xs="auto">Crear un nuevo evento -> <Button href="/ufc-events-data/postEvent" outline size="sm" color="success">Crear Evento</Button></Col>
    </Row>
  {/if}
</Container>
