<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import { Container } from '@sveltestrap/sveltestrap';

    let youtubeData = [];
    let twitchData = [];

    onMount(async () => {
        try {
            //Datos de mi API de Youtube Trends
            const youtubeResponse = await fetch('https://sos2324-14.appspot.com/api/v1/youtube-trends');
            youtubeData = await youtubeResponse.json();

            //Datos de la API de Twitch
            const twitchOptions = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'c4dcccf12bmshb28d319bf18afe1p17ebd3jsn3d5ff8dfec68',     //CLAVE
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

    function renderChart() {
        if (youtubeData.length === 0 || twitchData.length === 0) {
            console.error('No data available.');
            return;
        }

        // Combinar los datos de YouTube y Twitch
        const combinedChartData = [...youtubeData, ...twitchData];

        // Crear la serie de datos para la gráfica
        const seriesData = combinedChartData.map(data => data.view_count);

        // Crear las etiquetas para la gráfica
        const labels = combinedChartData.map(data => data.title);

        // Crear una serie de colores para las barras
        const colors = combinedChartData.map(data => data.source === 'YouTube' ? '#FF0000' : '#800080');

        // Configurar opciones de la gráfica
        const options = {
            series: [{
                data: seriesData
            }],
            chart: {
                type: 'bar',
                height: 400
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                    colors: colors
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: labels
            },
            yaxis: {
                title: {
                    text: 'View Count'
                }
            }
        };

        // Renderizar la gráfica con ApexCharts
        const chart = new ApexCharts(document.querySelector('#chart'), options);
        chart.render();
    }
</script>

<Container>
    <h1>Integración 1: Datos YouTube-Trends y API de Twitch</h1>
    <div id="chart"></div>
</Container>

<style>
    #chart {
        width: 100%;
        height: 400px;
    }
</style>
