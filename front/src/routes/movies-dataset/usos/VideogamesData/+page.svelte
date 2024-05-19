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
        getAPIData();
    });

    let datosResultantes;;

    async function getAPIData() {
        const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '2e4d5b2831mshbb891bdf16ada77p130f6fjsna74180befe42',
                'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(url, options);
            const result = await response.text();
            let datos = JSON.parse(result);//console.log(datos);  
            // Crear un objeto para contar juegos por publisher
            let publisherCount = {};
            // Iterar sobre los datos y actualizar el conteo
            datos.forEach(game => {
                let publisher = game.publisher;
                if (publisherCount[publisher]) {
                    publisherCount[publisher]++;
                } else {
                    publisherCount[publisher] = 1;
                }
            });
            // Convertir el objeto de conteo a un array de objetos
            datosResultantes = Object.keys(publisherCount).map(publisher => ({
                publisher: publisher,
                juegos: publisherCount[publisher]
            }));//console.log(datosResultantes)
            let ordenados = datosResultantes.sort((a, b) => b.juegos - a.juegos)
            datosResultantes = ordenados.slice(0,10);
            
            generaGrafica(datosResultantes)
        } catch (error) {
            console.error(error);
        }
    }

    function generaGrafica(data) {
            // Convertir los datos al formato adecuado para el Donut Chart
            const formattedData = data.map(({ publisher, juegos }) => ([publisher, juegos]));

            // Crear el Donut Chart
            const chart = bb.generate({
                data: {
                    columns: formattedData,
                    type: "donut"
                },
                donut: {
                    title: "Proporción por Publisher"
                },
                bindto: "#chart"
            });
        }
</script>
<Container>
    <h1>Publishers con mas juegos gratis publicados</h1>
    <div id='chart'></div>
</Container>