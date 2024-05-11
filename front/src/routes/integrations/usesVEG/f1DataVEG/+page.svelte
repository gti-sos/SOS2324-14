<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { Container } from '@sveltestrap/sveltestrap';

	let pilotData = [];

	const options = {
		method: 'GET',
		url: 'https://f1-live-motorsport-data.p.rapidapi.com/drivers/standings/2024',
		headers: {
			'X-RapidAPI-Key': 'c4dcccf12bmshb28d319bf18afe1p17ebd3jsn3d5ff8dfec68',    //CLAVE
			'X-RapidAPI-Host': 'f1-live-motorsport-data.p.rapidapi.com'
		}
	};

	onMount(async () => {
		try {
			const response = await axios.request(options);
			if (response.data.results && response.data.results.length > 0) {
				pilotData = response.data.results.map((driver) => ({
					name: driver.driver_name,
					points: parseInt(driver.points)
				}));
				renderChart();
			} else {
				console.error('La respuesta de la API no contiene datos válidos.');
			}
		} catch (error) {
			console.error('Error al obtener los datos de los pilotos:', error);
		}
	});

	function renderChart() {
		const chartElement = document.querySelector('#chart');
		if (!chartElement) {
			console.error('Elemento #chart no encontrado en el DOM.');
			return;
		}

		var options = {
			chart: {
				type: 'bar',
				height: 350,
				id: 'chart'
			},
			series: [
				{
					name: 'Puntos',
					data: pilotData.map((driver) => driver.points)
				}
			],
			xaxis: {
				type: 'category',
				categories: pilotData.map((driver) => driver.name),
				labels: {
					rotate: -45
				}
			}
		};

		var chart = new ApexCharts(chartElement, options);
		chart.render();
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<Container>
    <h1>Uso Widget API Externa 2(F1 Live Motorsport Data): sin proxy</h1>
    <h5>Clasificación mundial de pilotos por temporada (2024)</h5>
	<div id="chart"></div>

	{#if pilotData.length === 0}
		<p>Cargando datos...</p>
	{/if}
</Container>
