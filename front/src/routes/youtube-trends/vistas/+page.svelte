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
				createBarChartWithHighcharts(data);
				createScatterPlotWithHighcharts(data);
				createBarChartWithApexCharts(data); // Nueva función agregada
			} else {
				console.log('No hay datos disponibles');
				showNoDataMessage();
			}
		} catch (error) {
			console.log(`Error: ${error}`);
		}
	}

	function createBarChartWithHighcharts(data) {
		const countriesData = processDataForBarChart(data);

		const options = {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Visitas por País (Highcharts)'
			},
			xAxis: {
				categories: countriesData.map((item) => item.country),
				title: {
					text: 'País'
				}
			},
			yAxis: {
				title: {
					text: 'Visitas'
				}
			},
			series: [
				{
					name: 'Visitas',
					data: countriesData.map((item) => item.view_count)
				}
			]
		};

		Highcharts.chart('highcharts-bar-container', options);
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

	function createScatterPlotWithHighcharts(data) {
		const chartData = processDataForScatterPlot(data);

		const options = {
			chart: {
				type: 'scatter',
				zoomType: 'xy'
			},
			title: {
				text: 'Relación entre comentarios y visualizaciones (Highcharts)'
			},
			xAxis: {
				title: {
					text: 'Visualizaciones'
				}
			},
			yAxis: {
				title: {
					text: 'Comentarios'
				}
			},
			tooltip: {
				headerFormat: '<b>{series.name}</b><br>',
				pointFormat:
					'Comentarios: {point.y}, Visualizaciones: {point.x}<br>' +
					'Title: {point.title}<br>' +
					'Ranking: {point.ranking}<br>' +
					'Country: {point.country}<br>' +
					'Published_at: {point.published_at}<br>' +
					'Channel_title: {point.channel_title}<br>' +
					'Category_id: {point.category_id}<br>' +
					'Trending_date: {point.trending_date}'
			},
			series: [
				{
					name: 'Videos',
					data: chartData
				}
			]
		};

		Highcharts.chart('highcharts-scatter-container', options);
	}

	function processDataForScatterPlot(data) {
		return data.map((video) => ({
			x: video.view_count,
			y: video.comment_count,
			title: video.title,
			ranking: video.ranking,
			country: video.country,
			published_at: video.published_at,
			channel_title: video.channel_title,
			category_id: video.category_id,
			trending_date: video.trending_date
		}));
	}

	function createBarChartWithApexCharts(data) {
		const videosData = processDataForBarChartApexCharts(data);

		const options = {
			chart: {
				type: 'bar',
				height: 400,
				toolbar: {
					show: false
				}
			},
			plotOptions: {
				bar: {
					horizontal: true,
					distributed: true,
					dataLabels: {
						position: 'top'
					}
				}
			},
			dataLabels: {
				enabled: false
			},
			series: [
				{
					data: videosData.map((item) => item.view_count)
				}
			],
			xaxis: {
				categories: videosData.map((item) => item.title),
				labels: {
					show: false
				}
			},
			yaxis: {
				title: {
					text: 'Título del Video'
				}
			},
			title: {
				text: 'Visitas Por Video (ApexCharts)',
				align: 'center',
				margin: 20,
				style: {
					fontSize: '20px'
				}
			},
			tooltip: {
				enabled: true,
				custom: function ({ series, seriesIndex, dataPointIndex, w }) {
					const title = w.globals.labels[dataPointIndex];
					const view_count = series[seriesIndex][dataPointIndex];
					return `<div>Título: ${title}</div><div>Visualizaciones: ${view_count}</div>`;
				}
			}
		};

		const chart = new ApexCharts(document.querySelector('#apexcharts-bar-container'), options);
		chart.render();
	}

	function processDataForBarChartApexCharts(data) {
		const videosData = {};
		data.forEach((item) => {
			videosData[item.title] = item.view_count;
		});
		return Object.entries(videosData).map(([title, view_count]) => ({ title, view_count }));
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
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<title>YouTubeTrends</title>
</svelte:head>

<Container>
	<h1><strong>Gráficas</strong></h1>
</Container>

<Container id="chart-container">
	<div id="highcharts-bar-container" style="width: 80%; height: 300px;"></div>
	<div id="highcharts-scatter-container" style="width: 80%; height: 300px;"></div>
	<div id="apexcharts-bar-container" style="width: 80%; height: 500px;"></div>
</Container>
