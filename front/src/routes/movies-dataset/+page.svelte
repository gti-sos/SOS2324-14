<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { page } from '$app/stores';
    import { Button, ListGroup, ListGroupItem, NavLink, Container, Row, Col, Alert, Pagination, PaginationItem, PaginationLink } from '@sveltestrap/sveltestrap';

    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    

    // Variables necesarias 
    let movies = []                         // Almacenar las peliculas a mostrar
    let errorMsg = ""; let successMsg = ""  // Almacenar los mensajes de error o exito de la pagina
    let paged = false
    //if (!paged===true)
    /*let offset= $page.url.searchParams.get('offset'); */let limit = 10;   // Almacenar los valores necesarios para paginar
    // if(!$page.url.searchParams.get('offset'))
    //     offset=0;
    let cantidadPeliculas = 0;               // Saber cuantas peliculas hay, mas de 10 habra que paginar
    let listaPags = []

    onMount(() => {
        getMovies();
    });

    async function loadInitialData() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API+"/loadInitialData", {
                                        method: "GET"
                                    });
            
            if (response.status == 201){
                console.log(`Exito cargando peliculas.`);
                console.log(await response.data);
                getMovies(); 
                successMsg = "Datos iniciales cargados con exito."
            } else { 
                errorMsg = "La base de datos esta llena, no se puede volver a cargar."
            }
        } catch (error) {
            errorMsg = error;
        }
    }

    async function getMovies() {
        listaPags = []
        successMsg, errorMsg = "", "";
        let offset= $page.url.searchParams.get('offset');// Almacenar los valores necesarios para paginar
        if(!$page.url.searchParams.get('offset'))
            offset=0;
        console.log("offset:"+offset);
        try {
            // Contar cuantas paginas hay en el front
            let cantidad = await    fetch(API, {
                                        method: "GET"
                                    });
            let cant = await cantidad.json();
            cantidadPeliculas = cant.length;
            console.log("peliculas"+cantidadPeliculas +"y offset"+offset);
            console.log(Math.ceil(cantidadPeliculas / 10));
            for(let i = 1; i <= Math.ceil(cantidadPeliculas / 10); i++) {listaPags.push(i)};
            console.log(listaPags)
            // Obtener las peliculas a mostrar por cada pagina
            let response = await    fetch(API+`?offset=${offset}&limit=${limit}`, {
                                        method: "GET"
                                    });
            let data = await response.json();
            movies = data;
            console.log(movies);
            if($page.url.searchParams.get('offset'))
                window.location.reload;
            if (response.status != 200) {
                errorMsg = "No se ha encontrado la colección."
            }
        } catch (error) {
            errorMsg = error;
        }
    }

    function siguientePagina(ofs) {
        num = Math.ceil(cantidadPeliculas / 10)
        sigPag = num * ofs
        getMovies();
    }

    function paginar(pagina) {
        let ofs = $page.url.searchParams.get('offset');
        // Si estoy en la pagina 1, tengo que usar offset=0, pagina(1)-1*ofs(0)=0
        // Si estoy en la pagina 2, tengo que usar offset=10, pagina(2)-1(1)*ofs(10)=10
        ofs = (pagina-1)*limit
        console.log(`Cuanto coño vale ${ofs}`)
        window.location.href = `/movies-dataset?offset=${ofs}&llimit=10`
    }

    async function deleteMovie(title) {
        successMsg, errorMsg = "", "";
        try {
            console.log(`Deleting movie with title ${title}`);

            let response = await    fetch(API+`/${title}`, {
                                        method: "DELETE"
                                    });
            if (response.status == 200){
                getMovies();
                successMsg = `La pelicula ${title} se ha borrado correctamente.`
            }
            else
                errorMsg = `No se ha podido borrar la pelicula ${title}. \nSeguramente no exista`
        } catch (error) {
            errorMsg = error;
        }
        
    }

    async function deleteColection() {
        successMsg, errorMsg = "", "";
        try {
            let response = await    fetch(API, {
                                        method: "DELETE"
                                    });
            console.log(`Deleted`);
            if (response.status == 200){
                getMovies();
                successMsg = "Colección borrada con exito."
            } else
                errorMsg = "La colección ya estaba vacía."
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
        <h1><strong>Lista de Películas</strong></h1>
    </Row>
    <Row>
        {#if movies.length == 0}
            <p>La lista está vacía</p>
            <p>Para insertar datos pulsa este botón -> <Button size="md" outline color="primary" on:click={loadInitialData}>Rellenar</Button></p>
        {/if}
    </Row>
    <div>
        <ListGroup>
            {#each movies as movie}
            <ListGroupItem>
                <Row>
                    <Col xs=10>
                        <NavLink active href="movies-dataset/{movie.original_title}">{movie.index}. {movie.original_title}</NavLink>
                        
                        <strong>Director:</strong> {movie.director}, <strong>Estreno:</strong> {movie.release_date}
                    </Col>
                    
                    <Col xs="2" class="d-flex justify-content-center"><Button size="sm" color="danger" on:click={deleteMovie(movie.original_title)}>Borrar</Button></Col> 
                </Row>
            </ListGroupItem>
            {/each}
        </ListGroup>
    </div>
    {#if !movies.length == 0}
    <Row>
        <Col xs="auto">Añade una nueva película <Button href="movies-dataset/añadirPelicula" size="sm" color="warning">Añadir</Button></Col>
    </Row>
    <Row>
        <Col xs="auto">Eliminar la coleccion <Button outline size="sm" color="danger" on:click={deleteColection}>Borrar Todo</Button></Col>
    </Row>
        {#if listaPags.length != 0}
        <Row>
            <Pagination size="md" ariaLabel="Paginacion del front-end">
                <PaginationItem>
                    <PaginationLink first href="?offset=0&limit={limit}" />
                </PaginationItem>
                {#each listaPags as pagina}
                <PaginationItem>
                    <PaginationLink on:click={paginar(pagina)}>{pagina}</PaginationLink>
                </PaginationItem>
                {/each}
                <PaginationItem>
                    <PaginationLink next  href="" on:click={siguientePagina($page.url.searchParams.get('offset'))}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href="?offset={(listaPags.length-1)*limit}&limit={limit}" />
                </PaginationItem>
            </Pagination>
        </Row>
        {/if}
    {/if}
</Container>