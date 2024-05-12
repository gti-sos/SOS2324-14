<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>
<script>
	import axios from 'axios';
    import { onMount } from 'svelte';
    import { Container, Button, Input} from '@sveltestrap/sveltestrap';

    let targetCurrency;

async function fetchMetalData() {

    

    const options = {
        method: 'GET',
        url: `https://live-metal-prices.p.rapidapi.com/v1/latest/XAU,XAG,PA,PL,GBP,USD,EUR/${targetCurrency}/gram`,
        headers: {
            'X-RapidAPI-Key': '88a523cd96msh3544e0ee37800ebp1845b1jsnf31a7971dadb',
            'X-RapidAPI-Host': 'live-metal-prices.p.rapidapi.com'
        }
    };

    try {
	    const response = await axios.request(options);
	    console.log(response.data);
        createChart(response.data.rates);
        console.log(response.data.rates);
    } catch (error) {
	    console.error(error);
    }
}

async function createChart(metalData) {

    const currencies = Object.keys(metalData); // Obtener las claves del objeto

    console.log(currencies);
    const seriesData = currencies.map(currency => {
        return {
            name: currency,
            data: [metalData[currency]] // Obtener el precio asociado a la moneda
        };
    });

    const chartOptions = {
      chart: {
        type: 'column' 
      },
      title: {
        text: `Precios de metales en ${targetCurrency}`
      },
      xAxis: {
        title: {
        text: `Monedas/Metales`
        }
      },
      yAxis: {
        title: {
          text: `Precio (en ${targetCurrency})`
        }
      },
      series: seriesData
    };

    Highcharts.chart('metal-chart', chartOptions); // Crear gráfica en el contenedor 'metal-chart'
  }



</script>

<Container>
    <h2>Precios de metales</h2>
    <Input type="text" bind:value={targetCurrency} placeholder="USD/EUR/GBP" />
    <Button on:click={fetchMetalData}>Buscar</Button>
    <div id="metal-chart"></div>
</Container>