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

    let datosResultantes = [];

    async function getAPIData() {
        const url = 'https://epic-store-games.p.rapidapi.com/onSale?searchWords=Mount&locale=us&country=us';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '2e4d5b2831mshbb891bdf16ada77p130f6fjsna74180befe42',
                'X-RapidAPI-Host': 'epic-store-games.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.text();
            let datos = JSON.parse(result);
            datos.forEach(juego => {
                let nombre = juego.title;
                let precio = juego.price.totalPrice.fmtPrice.discountPrice
                precio = parseFloat(precio.replace('$', ''))
                datosResultantes.push({nombre:nombre, precio:precio})
            })
            console.log(datosResultantes)
            generaGrafica(datosResultantes)
        } catch (error) {
            console.error(error);
        }
    }

    // Heat Map
    function generaGrafica(datos) {
        let datosFormat = [];
        datos.forEach(entrada => {
            datosFormat.push([entrada.nombre, entrada.precio])
        })
        
        var chart = bb.generate({
            
            padding: {
                top: 15,
                bottom: 15
            },
            data: {
                columns: datosFormat,
                type: "treemap", // for ESM specify as: treemap()
                labels: {
                colors: "#fff"
                }
            },
            treemap: {
                label: {
                threshold: 0.03
                }
            },
            bindto: "#chart"
        });
    }
</script>
<Container>
    <h1>Proporción de juegos mas caros en EpicGames Store</h1>
    <div id='chart'></div>
</Container>