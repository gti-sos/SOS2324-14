<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import { Container } from '@sveltestrap/sveltestrap';

    let youtubeData = [];
    let spotifyData = [];

    onMount(async () => {
        try {
            // Obtener datos de la API de Youtube Trends
            const youtubeResponse = await fetch('https://sos2324-14.appspot.com/api/v1/youtube-trends');
            youtubeData = await youtubeResponse.json();
            console.log('YouTube Response:', youtubeData);

            // Obtener datos de la API de Spotify
            const spotifyOptions = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'c4dcccf12bmshb28d319bf18afe1p17ebd3jsn3d5ff8dfec68',
                    'X-RapidAPI-Host': 'spotify-statistics-and-stream-count.p.rapidapi.com'
                }
            };
            const spotifyResponse = await fetch('https://spotify-statistics-and-stream-count.p.rapidapi.com/album/57MtV6axHjkNZxMPHjI2Oz', spotifyOptions);
            const spotifyDataRaw = await spotifyResponse.json();
            console.log('Spotify Response:', spotifyDataRaw); // Imprimir la respuesta de la API de Spotify

            // Verificar y manejar la estructura de la respuesta de la API de Spotify
            if (spotifyDataRaw.tracks) {
                spotifyData = spotifyDataRaw.tracks.map(track => ({
                    title: track.name,
                    view_count: track.streamCount
                }));
            } else {
                console.error('Error: No se encontraron datos de pistas en la respuesta de la API de Spotify.');
            }

            // Llamar a la función renderChart después de obtener datos de ambas API
            renderChart();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    function renderChart() {
        if (youtubeData.length === 0 || spotifyData.length === 0) {
            console.error('No data available.');
            return;
        }

        // Combinar los datos de YouTube y Spotify
        const combinedChartData = [...youtubeData, ...spotifyData];

        // Crear la serie de datos para la gráfica
        const seriesData = combinedChartData.map(data => data.view_count);

        // Crear las etiquetas para la gráfica
        const labels = combinedChartData.map(data => data.title);

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
    <h1>Integración 2: Datos YouTube-Trends y API de Spotify</h1>
    <div id="chart"></div>
</Container>

<style>
    #chart {
        width: 100%;
        height: 400px;
    }
</style>

