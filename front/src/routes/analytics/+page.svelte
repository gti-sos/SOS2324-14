<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <title>Entertainment Trends</title>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { dev } from "$app/environment";
  // Define las URLs de las dos APIs
  let moviesAPI = "/api/v1/movies-dataset";
  let ufcAPI = "/api/v2/ufc-events-data";
  let youtubeTrendsAPI = '/api/v1/youtube-trends';

    if (dev){
      moviesAPI = "http://localhost:10002" + moviesAPI;
      ufcAPI = "http://localhost:10002" + ufcAPI;
      youtubeTrendsAPI = 'http://localhost:10002' + youtubeTrendsAPI;
    }
      
  
  

  let countryData = [];

  // Función para obtener datos de la API de YouTube Trends
  async function fetchYoutubeTrendsData() {
    const response = await fetch(youtubeTrendsAPI);
    const data = await response.json();
    return data;
  }

  // Función para obtener datos de la API de UFC
  async function fetchUfcData() {
    const response = await fetch(ufcAPI);
    const data = await response.json();
    return data;
  }
  
  // Función para obtener datos de la API Movies
  async function fetchMoviesData() {
    const response = await fetch(moviesAPI);
    const data = await response.json();
    return data;
  }

  // Función para procesar los datos
  async function processCountryData() {
    const youtubeTrendsData = await fetchYoutubeTrendsData();
    const ufcData = await fetchUfcData();
    const moviesData = await fetchMoviesData();

    // Crear un mapa para almacenar la suma de view_count por país
    const countryMap = {};

    moviesData.forEach(row => {
      let country = row.production_countries.split(',')[0];
      if (country === "United States of America")
        country = 'USA'
      else if (country === "United Kingdom")
        country = 'UK'
      let popularity = row.revenue;
      if (!countryMap[country]) {
        countryMap[country] = { country: country, view_count_youtube: 0, view_count_ufc: 0, view_count_movies: 0};
      }
      countryMap[country].view_count_movies += Math.round(popularity/(195*6)); // Divido entre los paises que hay y el precio aproximado de la entrada del cine
      // Hago esto asi porque al ser beneficio para calcular aproximadamente las visitas que ha tenido
    });

    // Procesar datos de la API de YouTube Trends
    youtubeTrendsData.forEach(entry => {
      const country = entry.country;
      const viewCount = entry.view_count;
      if (!countryMap[country]) {
        countryMap[country] = { country: country, view_count_youtube: 0, view_count_ufc: 0, view_count_movies: 0};
      }
      countryMap[country].view_count_youtube += viewCount;
    });

    // Procesar datos de la API de UFC
    ufcData.forEach(entry => {
      const country = entry.location.split(' ')[0]; // Tomar el primer valor de location
      const views = parseInt(entry.views); // Convertir las vistas a número
      if (!countryMap[country]) {
        countryMap[country] = { country: country, view_count_youtube: 0, view_count_ufc: 0, view_count_movies: 0};
      }
      countryMap[country].view_count_ufc += views;
    });

    // Convertir el mapa en un array
    countryData = Object.values(countryMap);
  }

  // Función para crear el gráfico
  function createChart() {
    Highcharts.chart('chart-container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Entertainment Trends'
      },
      xAxis: {
        title: {
          text: 'País'
        },
        categories: countryData.map(country => country.country)
      },
      yAxis: {
        title: {
          text: 'Vistas'
        }
      },
      series: [{
        name: 'YouTube Trends',
        data: countryData.map(country => country.view_count_youtube)
      }, {
        name: 'UFC Events',
        data: countryData.map(country => country.view_count_ufc)
      }, {
        name: 'Movies Data',
        data: countryData.map(country => country.view_count_movies)
      }]
    });
  }

  onMount(async () => {
    try {
      await processCountryData();
      createChart();
    } catch (error) {
      console.error('Error al obtener datos o crear el gráfico:', error);
    }
  });
</script>

<style>
  #chart-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
</style>

<div id="chart-container"></div>
