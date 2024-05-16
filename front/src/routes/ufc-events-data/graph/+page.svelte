<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</svelte:head>
<script>
	import { onMount } from "svelte";
    import { Container, Button, Row, Col } from '@sveltestrap/sveltestrap';
    import { dev } from "$app/environment";
    // import Highcharts from 'highcharts/highstock';


    let API = "/api/v2/ufc-events-data";
    if(dev)
        API = "http://localhost:10002" + API;

    async function getData() {
        
        try {
            const res = await fetch(API);
            const dataJSON = await res.json();
            console.log(`fetched data: ${dataJSON}`)
            fillChart(dataJSON);
            fillPieChart(dataJSON);
            fillChartGoogle(dataJSON);
            fillPieChartGoogle(dataJSON);
        } catch (error) {
            console.log(`error => ${error}`)
        }
    }
   

    async function fillChart(dt) {
        
        const weights = [...new Set(dt.map(item => item.weight_class))];
        const methods =[...new Set(dt.map(item => item.method))];

        const seriesData = methods.map(method => ({
            name: method,
            data: weights.map(weight => {
                const victories = dt.filter(item => item.method === method && item.weight_class === weight).length;
                return victories;
            })
        }));
        console.log(`series -> ${seriesData}`)

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'bar', 
                backgroundColor: '#D3D3D3',
                borderColor: '66CDAA',
                borderWidth: 2

            },
            title: {
                text: 'Victorias de Método x peso',
                style: {
                        fontFamily: 'Monserrat, sans-serif',
                        color: '#36454F',
                        fontWeight: 'bold'
                    }
            },
            xAxis: {
                categories: weights, 
                title: {
                    text: 'Pesos',
                    style: {
                        fontFamily: 'Monserrat, sans-serif',
                        color: '#36454F'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Cantidad de Victorias',
                    style: {
                        fontFamily: 'Monserrat, sans-serif',
                        color: '#36454F'
                    }
                },
                labels: {
                    style: {
                        fontFamily: 'Monserrat, sans-serif',
                        color: '#36454F'
                    }
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    shadow: true
                }
            },
            series: seriesData
        });
        console.log('Fin fill charts')
    }

    async function fillChartGoogle(dt) {
        const weights = [...new Set(dt.map(item => item.weight_class))];
        const methods = [...new Set(dt.map(item => item.method))];

        const seriesData = methods.map(method => [
            method,
            ...weights.map(weight => dt.filter(item => item.method === method && item.weight_class === weight).length)
        ]);

        const data = [
            ['Method', ...weights],
            ...seriesData
        ];

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            const dataTable = google.visualization.arrayToDataTable(data);

            const options = {
                title: 'Victorias de Método x peso',
                hAxis: { title: 'Pesos' },
                vAxis: { title: 'Cantidad de Victorias' },
                backgroundColor: '#D3D3D3',
                isStacked: true
            };

            const chart = new google.visualization.BarChart(document.getElementById('container-google'));
            chart.draw(dataTable, options);
        }
    }

    async function fillPieChart(dt) {
        console.log('Entro en pie charts');
        const durationMap = new Map();
        dt.forEach(item => {
            // parseo duracion
            const min = item.time.split(':')[0];
            let interval;
            if (min < 1) {
                interval = '-1 min';
            } else if (min >= 1 && min < 2) {
                interval = '1-2 min';
            } else if (min >= 2 && min < 3) {
                interval = '2-3 min';
            } else if (min >= 3 && min < 4) {
                interval = '3-4 min';
            } else {
                interval = '+4 min';
            }
            durationMap.set(interval, (durationMap.get(interval) || 0) + 1);
        });
        console.log('durationMap:');
        for (let [key, value] of durationMap) {
            console.log(`${key}: ${value}`);
        }

        const durationDistributionData = Array.from(durationMap).map(([interval, fights]) => ({
        interval,
        fights
        }));

        const dataPie = durationDistributionData.map(item => ({
            name: item.interval,
            y: item.fights
        }));
        
        console.log('dataPie:');
        console.log(dataPie);

        const charts = Highcharts.chart('pie-container', {
            chart: {
                type: 'pie', 
                backgroundColor: '#D3D3D3',
                borderColor: '66CDAA',
                borderWidth: 2

            },
            title: {
                text: 'Distribución de Peleas x Duración',
                style: {
                        fontFamily: 'Monserrat, sans-serif',
                        color: '#36454F',
                        fontWeight: 'bold'
                    }
            },
            tooltip: {
                pointFormat: '<b>{point.name}:</b> {point.y}'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name:'Peleas',
                colorByPoint: true,
                data: dataPie
            }]
        });
    }

    async function fillPieChartGoogle(dt) {
        const durationMap = new Map();
        dt.forEach(item => {
            const min = item.time.split(':')[0];
            let interval;
            if (min < 1) {
                interval = '-1 min';
            } else if (min >= 1 && min < 2) {
                interval = '1-2 min';
            } else if (min >= 2 && min < 3) {
                interval = '2-3 min';
            } else if (min >= 3 && min < 4) {
                interval = '3-4 min';
            } else {
                interval = '+4 min';
            }
            durationMap.set(interval, (durationMap.get(interval) || 0) + 1);
        });

        const dataPie = [['Interval', 'Fights']];
        durationMap.forEach((value, key) => {
            dataPie.push([key, value]);
        });

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawPieChart);

        function drawPieChart() {
            if (dataPie.length < 2) {
                console.error('No data available for pie chart');
                return;
            }

            const dataTable = google.visualization.arrayToDataTable(dataPie);

            const options = {
                title: 'Distribución de Peleas x Duración',
                backgroundColor: '#D3D3D3',
            };

            const chart = new google.visualization.PieChart(document.getElementById('pie-container-google'));
            chart.draw(dataTable, options);
        }
    }

    onMount(() => {

        getData();
        

    })
</script>
<Container>
<Row class="justify-content-center">
    <div id="container" style="width:100%; height:400px;"></div>
    <div id="pie-container" style="width:100%; height:400px;"></div>
    <div id="container-google" style="width:100%; height:400px;"></div>
    <div id="pie-container-google" style="width:100%; height:400px;"></div>
    <Col xs="auto">Volver -> <Button href="/ufc-events-data" outline size="sm" color="danger">Volver</Button></Col>
</Row>
</Container>

