<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
</svelte:head>
<script>
	import { onMount } from "svelte";
    import { Container, Button, Row, Col } from '@sveltestrap/sveltestrap';
    // import Highcharts from 'highcharts/highstock';


    let DATAAPI = "http://localhost:10002/data";

    async function getData() {
        
        try {
            const res = await fetch(DATAAPI);
            const dataJSON = await res.json();
            console.log(`fetched data: ${dataJSON}`)
            fillChart(dataJSON);
            
        } catch (error) {
            console.log(error)
        }
    }
    async function getDataPie(){
        try {
            const res = await fetch(DATAAPI);
            const dataJSON = await res.json();
            console.log(`fetched data: ${dataJSON}`)
            fillPieChart(dataJSON);
        } catch (error) {
            console.log(error)
        }
    }

    async function fillChart(dt) {
        
        const weights = [...new Set(dt.map(item => item.weight_class))];
        const methods =[...new Set(dt.map(item => item.method))];

        // console.log(`weights -> ${weights}`)
        // console.log(`methods -> ${methods}`)
        // Matriz de datos
        

        const seriesData = methods.map(method => ({
            name: method,
            data: weights.map(weight => {
                const victories = dt.filter(item => item.method === method && item.weight_class === weight).length;
                return victories;
            })
        }));
        // console.log(`series -> ${seriesData}`)

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
        
        console.log('durationDistributionData:');
        console.log(durationDistributionData);

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
                data: durationDistributionData
            }]
        });
    }

    onMount(() => {

        getData();
        getDataPie();

    })
</script>

<Row class="justify-content-center">
    <div id="container" style="width:100%; height:400px;"></div>
    <div id="pie-container" style="width:100%; height:400px;"></div>
    <Col xs="auto">Volver -> <Button href="/ufc-events-data" outline size="sm" color="danger">Volver</Button></Col>
</Row>

