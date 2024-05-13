<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Container } from '@sveltestrap/sveltestrap';

	let API = '/api/v2/youtube-trends';

	if (dev) API = 'http://localhost:10002' + API;

	async function getData() {
		try {
			const res = await fetch(API);
			const data = await res.json();
			console.log(`Dato recibido`);
			if (data.length > 0) {
				fillBarChart(data);
				createScatterPlot(data);
			} else {
				console.log('No hay datos disponibles');
				showNoDataMessage();
			}
		} catch (error) {
			console.log(`Error: ${error}`);
		}
	}

	function fillBarChart(data) {
		const countriesData = processDataForBarChart(data);

		const options = {
			chart: {
				type: 'bar'
			},
			series: [
				{
					name: 'Visitas',
					data: countriesData.map((item) => item.view_count)
				}
			],
			xaxis: {
				categories: countriesData.map((item) => item.country)
			},
			yaxis: {
				title: {
					text: 'Visitas'
				}
			},
			title: {
				text: 'Visitas por País'
			}
		};

		const chart = new ApexCharts(document.querySelector('#bar-container'), options);
		chart.render();
	}

	function processDataForBarChart(data) {
		const countriesData = {};
		data.forEach((item) => {
			if (countriesData[item.country]) {
				countriesData[item.country] += item.view_count;
			} else {
				countriesData[item.country] = item.view_count;
			}
		});
		return Object.entries(countriesData).map(([country, view_count]) => ({ country, view_count }));
	}

	function createScatterPlot(data) {
		const chartData = processDataForScatterPlot(data);

		const options = {
			chart: {
				type: 'scatter',
				zoom: {
					enabled: true,
					type: 'xy'
				}
			},
			series: [
				{
					name: 'Videos',
					data: chartData
				}
			],
			xaxis: {
				title: {
					text: 'Visualizaciones'
				}
			},
			yaxis: {
				title: {
					text: 'Comentarios'
				}
			},
			title: {
				text: 'Relación entre comentarios y visualizaciones'
			},
			markers: {
				size: 5
			},
			tooltip: {
				custom: function ({ dataPointIndex }) {
					const videoTitle = data[dataPointIndex].title;
					const visualizaciones = data[dataPointIndex].view_count;
					const comentarios = data[dataPointIndex].comment_count;
					const ranking = data[dataPointIndex].ranking;
					const country = data[dataPointIndex].country;
					const published_at = data[dataPointIndex].published_at;
					const channel_title = data[dataPointIndex].channel_title;
					const category_id = data[dataPointIndex].category_id;
					const trending_date = data[dataPointIndex].trending_date;

					return `<div class="apexcharts-tooltip-title">${videoTitle}</div>
                <div>Comentarios: ${comentarios}</div>
                <div>Visualizaciones: ${visualizaciones}</div>
                <div>Ranking: ${ranking}</div>
                <div>Country: ${country}</div>
                <div>Published_at: ${published_at}</div>
                <div>Channel_title: ${channel_title}</div>
                <div>Category_id: ${category_id}</div>
                <div>Trending_date: ${trending_date}</div>`;
				}
			}
		};

		const chart = new ApexCharts(document.querySelector('#scatter-container'), options);
		chart.render();
	}

	function processDataForScatterPlot(data) {
		return data.map((video) => ({
			x: video.view_count,
			y: video.comment_count
		}));
	}

	function showNoDataMessage() {
		console.log('Showing no data message');
		const container = document.getElementById('chart-container');
		container.innerHTML = '<p style="margin-left: 20px;">No hay datos para mostrar gráficas</p>';
	}

	onMount(() => {
		getData();
	});
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<title>YouTubeTrends</title>
</svelte:head>

<Container>
	<h1><strong>Gráficas</strong></h1>
</Container>

<Container id="chart-container">
	<div id="bar-container" style="width: 80%; height: 300px;"></div>
	<div id="scatter-container" style="width: 80%; height: 300px;"></div>
</Container>
