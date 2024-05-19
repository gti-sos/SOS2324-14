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

    async function getAPIData() {
        try {
            // Llamamos al proxy para los datos
            const response = await fetch(rutaAPI+'/MarvelSnapData', {
                method:'GET'
            }) 
            let datos = await response.json();
            // Una vez tenemos los datos, los ordenamos en funcion de cuantas variantes tienen
            let ordenados = datos.sort((a, b) => b.numVariants - a.numVariants);
            // Obtenemos las 10 mejores
            let mejores = ordenados.slice(0,10);
            console.log(mejores)
            //console.log('No hay datos')
            generaGrafica(mejores)
        } catch (error) {
            console.log(error)
        }
    }

    function generaGrafica(datos) {
        let grafica = datos.map(carta => {
            return [carta.name, carta.numVariants]
        })
        let nombres = datos.map(carta=>{return carta.name})
        const chart = bb.generate({
            data: {
                columns: datos.map(item => [item.name, item.numVariants]),
                type: 'pie'
            },
            bindto: '#chart'
        });
        const categories = ['x'];
        const series = datos.map(item => item.numVariants);
        const chart2 = bb.generate({
            data: {
                x: 'x',
                columns: [
                    ['x', ...datos.map(item => item.name)],
                    ['Cantidad de variantes', ...series]
                ],
                type: 'step'
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        centered: true
                    }
                }
            },
            bindto: '#chart'
        });
    }
</script>
<Container>
    <h1>Cartas con más variantes</h1>
    <div id='chart'></div>
</Container>