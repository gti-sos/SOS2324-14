<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { page } from '$app/stores';
    import { Button, Container, Row, Col, ListGroup, ListGroupItem, NavLink, Alert, Pagination, PaginationItem, PaginationLink } from '@sveltestrap/sveltestrap';
  
    let API = "/api/v2/ufc-events-data";
  
    if (dev)
      API = "http://localhost:10002" + API;
  
    let events = [];
    let errorMsg = "";
    let successMsg="";
    
    let limit = 10; 
    
    let listaPeleas = [];
    let cantPeleas = 0;

    let filters = [];

    onMount(() => {
      getEvents();
      loadFilters();
    });

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
      listaPeleas = []
      let offset = $page.url.searchParams.get('offset');

      if (!offset)
        offset = 0;
      console.log("offset: "+offset);
      try {

        let cantidad = await fetch(API, { 
          method: "GET" 
        });
        let cant = await cantidad.json();
        cantPeleas = cant.length;

        console.log("peleas:"+cantPeleas + " y offset "+offset);
        console.log(Math.ceil(cantPeleas / 10));

        for (let i = 1; i <= Math.ceil(cantPeleas / 10); i++) {
            listaPeleas.push(i);
        };
        console.log(listaPeleas)
        let response = await fetch(`${API}?offset=${offset}limit=${limit}}`, { 
          method: "GET" 
        });
        let data = await response.json();
        events = data; // Update events with fetched data
        console.log(events);
        console.log(response.status);
        // checkError(response.status);            
        if($page.url.searchParams.get('offset')){
          window.location.reload;
        } else if (response.status != 200) {
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

    function siguientePagina(ofs) {
        let sigPag = parseInt(ofs) + 10;
        paginar(sigPag);
        getEvents();
    }

    function paginar(pagina) {
      let ofs = $page.url.searchParams.get('offset');
      ofs = (pagina - 1) * limit;
      
      window.location.href = `/ufc-events-data?offset=${ofs}&limit=10`;
    }

    let filterDropdownOpen = false; // Variable para controlar si el menú desplegable de filtros está abierto o cerrado

    function toggleFilterDropdown() {
      filterDropdownOpen = !filterDropdownOpen;
    }

    async function loadFilters() {
    try {
      let response = await fetch(API, { method: "GET" });
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        // Iterar sobre las claves de la primera entrada para obtener los nombres de los filtros
        Object.keys(data[0]).forEach(key => {
          filters.push({ name: key, value: '' }); // Agregar cada filtro al array
        });
        console.log(filters);
      }
    } catch (error) {
      console.error("Error al cargar los filtros:", error);
    }
  }

    async function applyFilters() {
      let queryParams = filters
        .filter(filter => filter.value !== '') // Filtrar los filtros con valores no vacíos
        .map(filter => `${filter.name}=${filter.value}`) // Crear un array de cadenas "clave=valor"
        .join('&'); // Unir los elementos del array con el signo "&"
    
      // Redirigir a la página con los filtros aplicados
      window.location.href = `${API}?${queryParams}`;
  }
    
  
    
</script>
  
<style>
  .event-box {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .filter-dropdown {
    display: none;
  }

  .filter-dropdown.open {
    display: block;
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
  <Button color="primary" on:click={toggleFilterDropdown} class="filter-dropdown-toggle">Filtrar</Button>
  <Row class="justify-content-center">
    <div class="filter-dropdown" class:open={filterDropdownOpen}>
    <ul>
      {#each filters as filter}
        <li>
          <label for={filter.name}>{filter.name}</label>
          <input type="text" id={filter.name} bind:value={filter.value}>
        </li>
      {/each}
    </ul>
    <Button color="primary" on:click={applyFilters}>Aplicar filtros</Button>
  </div>
    
  </Row>
  
  <Row class="justify-content-center">
    <!-- <Col xs="auto">Página actual: {currentPage}</Col> -->
    <Col xs="auto">Total de eventos: {cantPeleas}</Col>
  </Row>
  <Row class="justify-content-center">
    <Col xs="auto">Eliminar todos los eventos -> <Button outline size="sm" color="danger" on:click={deleteAllEvents}>Borrar Todo</Button></Col>
    <Col xs="auto">Crear un nuevo evento -> <Button href="/ufc-events-data/postEvent" outline size="sm" color="success">Crear Evento</Button></Col>
  </Row>
  <Row>
    {#if listaPeleas.length != 0}
    <Row>
      <Pagination size="md" ariaLabel="Paginacion del front-end">
          <PaginationItem>
            <PaginationLink first on:click={() => {
              getEvents();
              window.location.href = `?offset=0&limit=${limit}`;
          }}/>
          </PaginationItem>
          {#each listaPeleas as pelea}
          <PaginationItem>
              <PaginationLink on:click={paginar(pelea)}>{pelea}</PaginationLink>
          </PaginationItem>
          {/each}
          <PaginationItem>
            <PaginationLink next on:click={() => {
              getEvents();
              window.location.href = `?offset=${parseInt($page.url.searchParams.get('offset'))+10}&limit=${limit}`;
            }}/>
          </PaginationItem>
          <PaginationItem>
              <PaginationLink last on:click={() => {
                getEvents();
                window.location.href = `?offset=${-((listaPeleas.length - 1) * limit)}&limit=${limit}`;
            }}/>
          </PaginationItem>
      </Pagination>
    </Row>
    {/if}
</Row>
  {/if}
  {#if events.length === 0}
    <Row class="justify-content-center">
      <Col xs="auto">Insertar datos -> <Button size="sm" outline color="primary" on:click={loadInitialData}>Insertar</Button></Col>
      <Col xs="auto">Crear un nuevo evento -> <Button href="/ufc-events-data/postEvent" outline size="sm" color="success">Crear Evento</Button></Col>
    </Row>
  {/if}
</Container>
