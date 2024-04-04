<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    
    import { Button, Container, Row, Col, ListGroup, ListGroupItem, NavLink } from '@sveltestrap/sveltestrap';
  
    let API = "/api/v1/ufc-events-data";
  
    if (dev)
      API = "http://localhost:10002" + API;
  
    let events = [];
    let errorMsg = "";
  
    function checkError(error) {
      if (error === 409)
        errorMsg = "Estás intentando introducir datos que ya están en la base de datos.";
      else if (error === 400)
        errorMsg = "Mala petición. Has introducido valores erróneos.";
      else if (error === 201 || error === 200)
        errorMsg = "";
    }
  
    async function loadInitialData() {
      try {
        let response = await fetch(API + "/loadInitialData", { method: "GET" });
        if (response.ok) {
          console.log(`Éxito cargando eventos de UFC.`);
          getEvents();
        } else {
          checkError(response.status);
        }
      } catch (error) {
        checkError(error);
      }
    }
  
    async function getEvents() {
      try {
        let response = await fetch(API, { method: "GET" });
        if (response.ok) {
          let eventData = await response.json();
          events = eventData.map(item => ({
            id: `${item.fighter1}/${item.fighter2}/${item.date}`, // Crear ID único
            name: `${item.fighter1} vs ${item.fighter2}`,
            date: item.date,
            location: item.location
          }));
          console.log(events);
          checkError(response.status);
        } else {
          checkError(response.status);
        }
      } catch (error) {
        checkError(error);
      }
    }
 
    async function deleteEvent(id) {
  try {
    // console.log(`Deleting event with fighter1: ${fighter1}, fighter2: ${fighter2}, date: ${date}`); // Mensaje de registro para verificar los datos de entrada
    let response = await fetch(`${API}/stats/${id}`, { method: "DELETE" });
    console.log("Response status:", response.status); // Mensaje de registro para verificar el estado de la respuesta
    if (response.ok) {
      getEvents();
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
  <h1><strong>Eventos de UFC</strong></h1>
  <Row>
    {#if events.length === 0}
      <p>La lista está vacía</p>
      <p>Crea los datos pulsando aquí</p>
      <p><Button size="s" outline color="primary" on:click={loadInitialData}>Insertar</Button></p>
    {/if}
  </Row>
  <div class="event-box">
    <ListGroup>
        {#each events as event (event.id)}
          <ListGroupItem>
            <Row class="event-box">
              <Col xs="10">
                <NavLink href="ufc-events-data/{event.id}">
                  <strong>{event.name}</strong><br>
                  <span><strong>Fecha:</strong> {event.date}, <strong>Lugar:</strong> {event.location}</span>
                </NavLink>
              </Col>
              <Col xs="2">
                <Button size="sm" color="danger" on:click={deleteEvent(event.id)}>Borrar</Button>

              </Col>
            </Row>
          </ListGroupItem>
        {/each}
      </ListGroup>
      
  </div>
  {#if events.length !== 0}
    <Row>
      <Col xs="auto">Eliminar todos los eventos<Button outline size="sm" color="danger" on:click={deleteAllEvents}>Borrar Todo</Button></Col>
    </Row>
  {/if}
  <Row>
    {#if errorMsg !== ""}
      ERROR: {errorMsg}
    {/if}
  </Row>
</Container>
