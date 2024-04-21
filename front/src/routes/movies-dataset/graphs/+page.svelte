<script>
	import { onMount } from 'svelte';

	let rutaAPI = 'http://localhost:10002/api/v2/movies-dataset/dataHeat';
    //let data;

	async function getData() {
		try {
			const res = await    fetch(rutaAPI, {
                                        method: "GET"
                                    });
			const data = await res.json();
			console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
			//fillChart(data.map((o) => o.v));
			fillHeatMap(data);
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	async function fillHeatMap(d) {
		// let categorias = await d.forEach(element => {
		// 	categorias.push(element.release_date)
		// });
		console.log(d)
		let chart = // Substring template helper for the responsive labels
			(Highcharts.Templating.helpers.substr = (s, from, length) => s.substr(from, length));

		// Create the chart
		Highcharts.chart('container', {
			chart: {
				type: 'heatmap',
				marginTop: 40,
				marginBottom: 80,
				plotBorderWidth: 1
			},

			title: {
				text: 'Beneficios de peliculas por genero y año',
				style: {
					fontSize: '1em'
				}
			},

			xAxis: { // Años
				categories: [
					2012
				]
			},

			yAxis: { // Generos
				title: {
                    text: 'Beneficio'
                }
			},

			accessibility: {
				point: {
					descriptionFormat:
						'{(add index 1)}. ' +
						'{series.xAxis.categories.(x)} sales ' +
						'{series.yAxis.categories.(y)}, {value}.'
				}
			},

			colorAxis: {
				min: 0,
				minColor: '#FFFFFF',
				maxColor: Highcharts.getOptions().colors[0]
			},

			legend: {
				align: 'right',
				layout: 'vertical',
				margin: 0,
				verticalAlign: 'top',
				y: 25,
				symbolHeight: 280
			},

			tooltip: {
				format:
					'<b>{series.xAxis.categories.(point.x)}</b> sold<br>' +
					'<b>{point.value}</b> items on <br>' +
					'<b>{series.yAxis.categories.(point.y)}</b>'
			},

			series: d,

			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500
						},
						chartOptions: {
							yAxis: {
								labels: {
									format: '{substr value 0 1}'
								}
							}
						}
					}
				]
			}
		});
	}

	onMount(() => {
		getData();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/heatmap.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:400px;"></div>
