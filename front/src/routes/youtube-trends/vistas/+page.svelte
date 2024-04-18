<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { dev } from '$app/environment';
    import { Container } from '@sveltestrap/sveltestrap';

    let API = '/api/v1/youtube-trends';

	if (dev) API = 'http://localhost:10002' + API;

    async function getData(){
    try{
        const res = await fetch(API);
        const data = await res.json();
        console.log(`Dato recibido`);
        if(data.length > 0) {
            fillBarChart(data);
            createScatterPlot(data);
        } else {
            console.log('No hay datos disponibles');
            showNoDataMessage();
        }
    } catch(error){
        console.log(`Error: ${error}`)
    }
}

    function fillBarChart(data){
        const countriesData = processDataForBarChart(data);
        
        const chart = Highcharts.chart('bar-container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Visitas por País'
            },
            xAxis: {
                categories: countriesData.map(item => item.country)
            },
            yAxis: {
                title: {
                    text: 'Visitas'
                }
            },
            series: [{
                name: 'Visitas',
                data: countriesData.map(item => item.view_count)
            }]
        });
    }

    function processDataForBarChart(data){
        const countriesData = {};
        data.forEach(item => {
            if(countriesData[item.country]){
                countriesData[item.country] += item.view_count;
            } else {
                countriesData[item.country] = item.view_count;
            }
        });
        return Object.entries(countriesData).map(([country, view_count]) => ({ country, view_count }));
    }

    function createScatterPlot(data){
        const chartData = processDataForScatterPlot(data);

        Highcharts.chart('scatter-container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Relación entre comentarios y visualizaciones'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Visualizaciones'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Comentarios'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.title}: {point.y} comentarios, {point.x} visualizaciones'
                    }
                }
            },
            series: [{
                name: 'Videos',
                color: 'rgba(223, 83, 83, .5)',
                data: chartData
            }]
        });
    }

    function processDataForScatterPlot(data){
        return data.map(video => ({
            x: video.view_count,
            y: video.comment_count,
            title: video.title
        }));
    }

    function showNoDataMessage() {
        console.log('Showing no data message');
        const container = document.getElementById('chart-container');
        container.innerHTML = '<p style="margin-left: 20px;">No hay datos para mostrar gráficas</p>';
    }

    onMount(()=>{
        getData();
    })

</script>
<Container>
    <h1><strong>Gráficas</strong></h1>
</Container>

<Container id="chart-container">
    <div id="bar-container" style="width:100%; height:400px;"></div>
    <div id="scatter-container" style="width:100%; height:400px;"></div>
</Container>




