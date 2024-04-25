<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { page } from '$app/stores';
    import { Button, ListGroup, ListGroupItem, NavLink, Container, Row, Col, Alert, Pagination, PaginationItem, PaginationLink, Input } from '@sveltestrap/sveltestrap';



    let API = "/api/v1/movies-dataset";

    if(dev)
        API = "http://localhost:10002"+API

    

    // Variables necesarias 
    let movies = []                         // Almacenar las peliculas a mostrar
    let errorMsg = ""; let successMsg = ""  // Almacenar los mensajes de error o exito de la pagina
    
    let limit = 10;   // Almacenar los valores necesarios para paginar
    let offset=0;
    let camposPelicula = []
    // let objBusqueda = {}
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
        let parametros = "";
        let data = []
        // Almacenar los valores necesarios para paginar
        if($page.url.searchParams.get('offset'))
            offset=$page.url.searchParams.get('offset');
        // Comprobar si hay que paginar
        if ($page.url.searchParams.get('offset') || !document.getElementById('campoBusqueda')) {
            // Si hay que paginar, construimos la query que vamos añadir a la url
            parametros = `?offset=${offset}&limit=${limit}`;
        // En caso contrario, es busqueda por campo, si es que esta esa query en la url
        } else if(document.getElementById('valorBusqueda').value) {
            // Almacenamos los parametros de busqueda que se han introducido en el filtro de busqueda
            let campo = document.getElementById('campoBusqueda').value;
            let valor = document.getElementById('valorBusqueda').value;
            
            //window.location.href = `?${campo}=${valor}`
            // En caso que se pulse el boton buscar sin indicar el valor se indicará al usuario
            if(valor === "") {
                errorMsg = "No has introducido ningun valor a buscar"
            } else {
                // Si todo va bien, construimos la query que vamos a añadir a la url
                parametros = `?${campo}=${valor}`;
            }
        }
        
        try {
            // Contar cuantas paginas hay en el front
            let cantidad = await    fetch(API, {
                                        method: "GET"
                                    });
            let cant = await cantidad.json();
            cantidadPeliculas = cant.length;
            // Actualizamos listaPags, añadiendo un valor de 1 hasta la cantidad de paginas que necesitamos
            for(let i = 1; i <= Math.ceil(cantidadPeliculas / 10); i++) {listaPags.push(i)};
            // Esto nos sireve para hacer la paginacion por paginas

            // Obtener las peliculas a mostrar por cada pagina
            let response = await    fetch(API+parametros, { // En caso de haber querys se añadiran a la busqueda en la API
                                        method: "GET"
                                    });
            data = await response.json();
            // Cabe la posibilidad que al hacer una busqueda, dicha busqueda devuelva unn array vacio de datos
            if (data[0] instanceof Object && cantidadPeliculas != 0) {
                // Almacenamos las peliculas que vamos a mostrar
                movies = data;
                // Almacenamos las claves para hacer el select de la 
                if (movies[0] instanceof Object) 
                    camposPelicula = Object.keys(movies[0]);
                console.log(movies);
            }else if(cantidadPeliculas != 0) {
                // Si los datos obtenidos estan vacios informa al usuario
                errorMsg = "No hay registrados datos relacionados con esta búsqueda";
            }
            // En caso de hacer paginación, recargamos la pagina, sino, lo tendría que hacer el usuario
            if($page.url.searchParams.get('offset') || document.getElementById('valorBusqueda'))
                window.location.reload;
            if(response.method === "DELETE")
                window.location.reload;
            if (response.status != 200) {
                errorMsg = "No se ha encontrado la colección."
            }
        } catch (error) {
            errorMsg = error;
        }
    }

    function bucarCampos() {
        // Para tener un select con todos los campos 
        camposPelicula = Object.keys(movies[0])
        // Almacenamos los parametros de busqueda que se han introducido en el filtro de busqueda
        let campo = document.getElementById('campoBusqueda').value;
        let valor = document.getElementById('valorBusqueda').value;
            
        //window.location.href = `?${campo}=${valor}`
        // En caso que se pulse el boton buscar sin indicar el valor se indicará al usuario
        if(valor === "") {
            errorMsg = "No has introducido ningun valor a buscar"
        } else {
            // Si todo va bien, construimos la query que vamos a añadir a la url
            // parametros = `?${campo}=${valor}`;
            window.location.href = `?${campo}=${valor}`;
        }
    }

    function anteriorPagina(ofs) {
        if(ofs > 0) {
            window.location.href = `?offset=${ofs-10}&limit=10`
            getMovies();
        } else {
            errorMsg = "Esta es la primera página, no puedes retroceder mas"
        }   
    }

    function siguientePagina(ofs) {
        if (parseInt(ofs) >= Math.trunc(cantidadPeliculas / 10)*10 || cantidadPeliculas === 10) {
            errorMsg = "Esta es la última página, no puedes avanzar mas"
        } else {
            ofs = parseInt(ofs) + 10
            window.location.href = `?offset=${ofs}&limit=10`
        }
    }

    function paginar(pagina) {
        let ofs = $page.url.searchParams.get('offset');
        // Si estoy en la pagina 1, tengo que usar offset=0, pagina(1)-1*ofs(0)=0
        // Si estoy en la pagina 2, tengo que usar offset=10, pagina(2)-1(1)*ofs(10)=10
        ofs = (pagina-1)*limit
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
                await getMovies();
                if (cantidadPeliculas === 10)
                    window.location.href = "/movies-dataset"
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
                setTimeout(()=>{
                    window.location.href = "/movies-dataset"

                },1000)
                getMovies();
                successMsg = "Colección borrada con exito."
            } else
                errorMsg = "La colección ya estaba vacía."
        } catch (error) {
            errorMsg = error;
        }
    }
    // Codigo para futuro
    // function firstOlast(pagina) {
    //     console.log("Estamos en la "+pagina)
    //     if (pagina === "Primera")
    //         window.location.href = "/movies-dataset?offset=0&llimit=10"
    //     else if (pagina == "Ultima")
    //         window.location.href = `/movies-dataset?offset=${Math.ceil(cantidadPeliculas / 10)*10}&llimit=10`
    // }
    //             <PaginationItem>
    //                 <PaginationLink first on:click={firstOlast}/>
    //             </PaginationItem>
    //             <PaginationItem>
    //                 <PaginationLink last on:click={firstOlast}/>
    //             </PaginationItem>
</script>
<svelte:head>
    <title>Front Movies</title>
</svelte:head>
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
        {#if !movies.length == 0}
            <Col><Button href='movies-dataset/graphs' color='info'>Gráficas</Button></Col>
        {/if}
    </Row>
    <Row>
        {#if movies.length == 0}
            <p>La lista está vacía</p>
            <p>Para insertar datos pulsa este botón -> <Button label="loadData" size="md" outline color="primary" on:click={loadInitialData}>Rellenar</Button></p>
        {:else}
            <Col>
                Búsqueda por campos 
            </Col>
            <Col xs=2>
                <Input bsSize=sm type="select" id="campoBusqueda">
                    {#each camposPelicula as campo}
                      <option>{campo}</option>
                    {/each}
                </Input>
            </Col>
            <Col xs=2>
                <Input bsSize=sm id="valorBusqueda"></Input>
            </Col>
            <Col xs=2>
                <Button class="buscarCampo" on:click={getMovies}>Buscar</Button>
            </Col>
        {/if}
    </Row>
    <div>
        <ListGroup class="movieList">
            {#each movies as movie}
            <ListGroupItem label="movieItem">
                <Row>
                    <Col xs=10>
                        <NavLink active href="movies-dataset/{movie.original_title}">{movie.index+1}. {movie.original_title}</NavLink>
                        
                        <strong>Director:</strong> {movie.director}, <strong>Estreno:</strong> {movie.release_date}
                    </Col>
                    
                    <Col sm="12" md={{ size: 2, offset: 'auto' }}>
                        <div class="d-flex justify-content-center align-items-center">
                            <Button style="margin-top: auto;" size="sm" color="danger" on:click={deleteMovie(movie.original_title)}>Borrar</Button>
                        </div>
                    </Col> 
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
            <Col sm="12" md={{ size: 4, offset: 4 }} class="d-flex justify-content-center">
                <Pagination size="md" ariaLabel="Paginacion del front-end">
                    <PaginationItem>
                        <PaginationLink class="AnteriorPag" previous on:click={anteriorPagina(offset)}/>
                    </PaginationItem>
                    {#each listaPags as pagina}
                    <PaginationItem>
                        <PaginationLink class="BotonPagina{pagina}" on:click={paginar(pagina)}>{pagina}</PaginationLink>
                    </PaginationItem>
                    {/each}
                    <PaginationItem>
                        <PaginationLink class="SiguientePag" next on:click={siguientePagina(offset)}/>
                    </PaginationItem>
                </Pagination>
            </Col>
        </Row>
        {/if}
    {/if}
</Container>