<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount, afterUpdate } from 'svelte';
    import { Container } from '@sveltestrap/sveltestrap';

    let youtubeData = [];
    let twitchData = [];
    let chart;

    onMount(async () => {
        try {
            //Datos de mi API de Youtube Trends
            const youtubeResponse = await fetch('https://sos2324-14.appspot.com/api/v1/youtube-trends');
            youtubeData = await youtubeResponse.json();

            //Datos de la API de Twitch
            const twitchOptions = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '4ad194731fmsh0bfac21b82a5fd3p1c6490jsndd3f42f6728a',     //CLAVE
                    'X-RapidAPI-Host': 'twitch-api8.p.rapidapi.com'
                }
            };

            const twitchResponse = await fetch('https://twitch-api8.p.rapidapi.com/get_channel_videos?channel=xqc', twitchOptions);
            const twitchDataRaw = await twitchResponse.json();
            console.log('Twitch Response:', twitchDataRaw); // Imprimir la respuesta de la API de Twitch
            console.log('YouTubeTrends Response:', youtubeData);

            // Verificar y manejar la estructura de la respuesta de la API de Twitch
            if (twitchDataRaw.user && twitchDataRaw.user.videoShelves) {
                const videoShelves = twitchDataRaw.user.videoShelves;
                const twitchVideos = videoShelves.edges.flatMap(edge => edge.node.items);
                twitchData = twitchVideos.map(video => ({
                    title: video.title,
                    view_count: video.viewCount,
                    source: 'Twitch'
                }));
            } else {
                console.error('Error: No se encontraron datos de videos en la respuesta de la API de Twitch.');
            }
            
            // Llamar a la función renderChart después de obtener datos de ambas API
            renderChart();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    afterUpdate(() => {
        if (chart) {
            // Actualizar el gráfico después de cada actualización de datos
            updateChart();
        }
    });

    function renderChart() {
        if ((!youtubeData || !youtubeData.length) || (!twitchData || !twitchData.length)) {
            console.error('No data available.');
            return;
        }

        console.log('Rendering chart...');

        // Combinar los datos de YouTube y Twitch
        const combinedChartData = [...youtubeData, ...twitchData];
        console.log('Combined Chart Data:', combinedChartData);

        // Verificar si hay datos
        if (!combinedChartData.length) {
            console.error('No combined chart data available.');
            return;
        }

        // Crear las etiquetas para la gráfica
        const labels = combinedChartData.map(data => data.title);
        console.log('Labels:', labels);

        // Crear una serie de colores para las barras
        const colors = combinedChartData.map(data => data.source === 'YouTube' ? '#FF0000' : '#800080');
        console.log('Colors:', colors);

        // Crear un arreglo de datos para las barras
        const data = combinedChartData.map(data => data.view_count);
        console.log('Data:', data);

        // Configurar la gráfica de Highcharts
        chart = Highcharts.chart('chart', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'View Count by Video Title'
            },
            xAxis: {
                categories: labels,
                title: {
                    text: 'Video Title'
                }
            },
            yAxis: {
                title: {
                    text: 'View Count'
                }
            },
            series: [{
                name: 'View Count',
                data: data,
                color: '#800080' // Color de las barras
            }]
        });
    }

    function updateChart() {
        // Actualizar la serie de datos del gráfico de Highcharts
        chart.series[0].setData(combinedChartData.map(data => data.view_count));
    }
</script>

<Container>
    <h1>Integración 1: Datos YouTube-Trends y API de Twitch(Highcharts)</h1>
    <div id="chart"></div>
</Container>

<style>
    #chart {
        width: 100%;
        height: auto;
    }
</style>

