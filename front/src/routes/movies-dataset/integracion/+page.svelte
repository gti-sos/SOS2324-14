<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/billboard.js/dist/billboard.min.css">
    <script src="https://cdn.jsdelivr.net/npm/d3@6"></script>
    <script src="https://cdn.jsdelivr.net/npm/billboard.js/dist/billboard.min.js"></script>
</svelte:head>
<script>
   	import { onMount } from 'svelte';
	import { dev } from "$app/environment";
    import { Container } from '@sveltestrap/sveltestrap';

	let rutaAPI = "/api/v2/movies-dataset";
    
    if(dev)
        rutaAPI = "http://localhost:10002"+rutaAPI
    
    onMount(() => {
        getTituloRating();
	});

    // Obtenemos los datos de nuestra API necesarios
    async function getTituloRating() {  
        let datosExternos = [];
        let datosInternos = [];
        try {
            // Obtener los datos de mi api
            const response = await    fetch(rutaAPI, {
                method: "GET"
            });
            const movies = await response.json();
            // Coger de cada pelicula los datos necesarios
            movies.forEach(async (movie) => {
                // Almacenamos los datos para una pelicula de mi api
                datosInternos.push({ title: movie.original_title, rating: movie.vote_average });
                // Cogemos los el pais principal de la pelicula para la peticion a la api
                let pais;
                let paises = movie.production_countries;
                paises = paises.split(',').map(valor => valor.trim());
                if ((paises[0]) != 'Albania' && (paises[0]) != 'Croacia' && (paises[0]) != 'España' && (paises[0]) != 'Francia') {
                    pais = paises[0];
                } else {
                    pais = paises[1];
                }
                // Para los datos iniciales de mi api propia api estos son los dos paises que hay, que se correspondan con la externa
                if (pais === 'United States of America')
                    pais = 'US';
                else if (pais === 'United Kingdom')
                    pais = 'GB';
                // Hacemos la petición a la API externa
                let response = await    fetch(`${rutaAPI}/proxyData/${movie.original_title}/${pais}`, {
                                        method: "GET"
                                    });
                let apiData = await response.json();
                // Esperamos a que lleguen los datos 
                datosExternos.push(await apiData)
                generaGrafica(datosInternos, datosExternos)
                
            });
        }
        catch (error) {
            console.log(error)
        }
    }
    // Creamos una funcion para coger procesar los datos para usarlos en la grafica
    function generaGrafica(data1, data2) {
        let titles = data1.map(movie => movie.title);

        let ratings1 = ['API Interna'].concat(data1.map(movie => movie.rating));
        let ratings2 = ['API Externa'].concat(data2.map(movie => movie.rating));
        const chart = bb.generate({
            data: {
                columns: [
                    ratings1,
                    ratings2
                ],
                type: "bar",
            },
            axis: {
                x: {
                    type: "category",
                    categories: titles,
                    tick: {
                        multiline: false,
                        rotate:-45
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            bindto: "#chart"
        });
    }
</script>
<Container>
<h1>Comparativa entre los ratings en mi dataset respecto a los de una API externa</h1>

<div id='chart'></div>
</Container>