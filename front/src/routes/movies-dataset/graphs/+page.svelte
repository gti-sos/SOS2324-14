<script>
	import { onMount } from 'svelte';
	import { Alert } from '@sveltestrap/sveltestrap';


	let rutaAPI = 'http://localhost:10002/api/v2/movies-dataset';
    let errorMsg = "";

	async function getData() {
		try {
			const res = await    fetch(rutaAPI, {
                                        method: "GET"
                                    });
			const dataWord = await res.json();
			console.log(`Data received for WordCloud: ${JSON.stringify(dataWord, null, 2)}`);
			fillWordCloud(dataWord);
			const resL = await    fetch(rutaAPI+"/dataLollipop", {
                                        method: "GET"
                                    });
			const dataLollipop = await resL.json();
			if (dataWord.length === 0)
				errorMsg = "No hay datos para mostrar.\nPor favor inserte datos iniciales."
			console.log(`Data received for Lollipop Chart: ${JSON.stringify(dataLollipop, null, 2)}`);
			fillLollipop(dataLollipop);
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function fillWordCloud(datos) {
		let cadena = "";
		datos.forEach(movie => {
			cadena += movie.keywords+" "; // Tambien quedaría bien con keywords
		});
		cadena = cadena.replace(/[():'?0-9]+/g, '').split(/[,\. ]+/g)
    	let data = cadena.reduce((arr, word) => {
        	let obj = Highcharts.find(arr, obj => obj.name === word);
        	if (obj) {
            	obj.weight += 1;
        	} else {
            	obj = {
                	name: word,
                	weight: 1
            	};
            	arr.push(obj);
        	}
        	return arr;
    	}, []);

		Highcharts.chart('container-word', {
    		accessibility: {
        		screenReaderSection: {
            		beforeChartFormat: '<h5>{chartTitle}</h5>' +
                		'<div>{chartSubtitle}</div>' +
                		'<div>{chartLongdesc}</div>' +
                		'<div>{viewTableButton}</div>'
        		}
    		},
    		series: [{
        		type: 'wordcloud',
        		data,
        		name: 'Películas'
    		}],
    		title: {
        		text: 'Palabras clave más frecuentes'
    		},
    		tooltip: {
        		headerFormat: '<span style="font-size: 16px"><b>{point.key}</b></span><br>'
    		}
		});
	}

	function fillLollipop(datos) {
		
		Highcharts.chart('container-lollipop', {
		chart: {
			type: 'lollipop'
		},
		accessibility: {
			point: {
				valueDescriptionFormat: '{index}. {xDescription}, {point.y}.'
			}
		},
		legend: {
			enabled: false
		},
		title: {
			text: 'Top 10 Películas con mas beneficios'
		},
		tooltip: {
			shared: true
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {
			title: {
				text: 'Beneficio'
			}
		},
		series: [{
					name: 'Beneficio',
					data: datos
				}]
		});
	}

	onMount(() => {
		getData();
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/wordcloud.js"></script>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
	<script src="https://code.highcharts.com/modules/dumbbell.js"></script>
	<script src="https://code.highcharts.com/modules/lollipop.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
{#if errorMsg != ""}
    <Alert color="danger">
        <h4>Error</h4>
        {errorMsg}
    </Alert>
{/if}
<div id="container-word" style="width:100%; height:400px;"></div>
<hr>
<div id="container-lollipop" style="width:100%; height:400px;"></div>
