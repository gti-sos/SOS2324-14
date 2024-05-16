<svelte:head>
    <script src="https://d3js.org/d3.v7.min.js"></script>
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
                    'X-RapidAPI-Key': '4ad194731fmsh0bfac21b82a5fd3p1c6490jsndd3f42f6728a',
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

        // Crear las etiquetas para la gráfica
        const labels = combinedChartData.map(data => data.title);

        // Crear un array de objetos con datos x e y para D3
        const dataForD3 = combinedChartData.map(data => ({ x: data.view_count, y: data.title }));

        // Configurar el tamaño de la gráfica
        const margin = { top: 30, right: 30, bottom: 70, left: 100 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Crear escala para el eje x
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(dataForD3, d => d.x)])
            .range([0, width]);

        // Crear escala para el eje y
        const yScale = d3.scaleBand()
            .domain(labels)
            .range([0, height])
            .padding(0.1);

        // Crear contenedor SVG
        const svg = d3.select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Crear barras
        svg.selectAll('rect')
            .data(dataForD3)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', d => yScale(d.y))
            .attr('width', d => xScale(d.x))
            .attr('height', yScale.bandwidth())
            .attr('fill', 'steelblue');

        // Agregar etiquetas de texto para el eje x
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', margin.bottom - 10)
            .attr('fill', '#000')
            .attr('text-anchor', 'middle')
            .text('View Count');

        // Agregar etiquetas de texto para el eje y
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left)
            .attr('x', -height / 2)
            .attr('dy', '1em')
            .attr('fill', '#000')
            .attr('text-anchor', 'middle')
            .text('Title');
    }
</script>

<Container>
    <h1>Integración 2: Datos YouTube-Trends y API de Spotify(d3)</h1>
    <div id="chart"></div>
</Container>

<style>
    #chart {
        width: 100%;
        height: 500px;
    }
</style>

