<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { Container } from '@sveltestrap/sveltestrap';

    let youtubeData = [];
    let twitchData = [];

    onMount(async () => {
        try {
            //Datos de mi API de Youtube Trends
            const youtubeResponse = await axios.get('https://sos2324-14.appspot.com/api/v1/youtube-trends');
            youtubeData = youtubeResponse.data;

            //Datos de la API de Twitch
            const twitchOptions = {
                method: 'GET',
                url: 'https://twitch-api8.p.rapidapi.com/get_channel_videos',
                params: {channel: 'xqc'},
                headers: {
                    'X-RapidAPI-Key': 'c4dcccf12bmshb28d319bf18afe1p17ebd3jsn3d5ff8dfec68',     //CLAVE
                    'X-RapidAPI-Host': 'twitch-api8.p.rapidapi.com'
                }
            };

            const twitchResponse = await axios.request(twitchOptions);
            console.log('Twitch Response:', twitchResponse.data); // Imprimir la respuesta de la API de Twitch
            console.log('YouTubeTrends Response:', youtubeResponse.data);

            // Verificar y manejar la estructura de la respuesta de la API de Twitch
            twitchData = twitchResponse.data;
            
            // Llamar a la función renderChart después de obtener datos de ambas API
            renderChart();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    function renderChart() {
    if (youtubeData.length === 0 || !twitchData || !twitchData.user || !twitchData.user.videoShelves) {
        console.error('No data available.');
        return;
    }

    const videoShelves = twitchData.user.videoShelves;
    const twitchVideos = videoShelves.edges.flatMap(edge => edge.node.items);

    // Formatear los datos para la gráfica
    const youtubeChartData = youtubeData.map(video => ({
        title: video.title,
        view_count: video.view_count,
        source: 'YouTube'
    }));
    const twitchChartData = twitchVideos.map(video => ({
        title: video.title,
        view_count: video.viewCount,
        source: 'Twitch'
    }));

    // Combinar los datos de las dos APIs
    const combinedChartData = [...youtubeChartData, ...twitchChartData];

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
