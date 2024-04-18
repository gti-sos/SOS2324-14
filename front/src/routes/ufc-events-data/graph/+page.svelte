<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>
<script>
	import { onMount } from "svelte";

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

    async function fillChart(dt) {
        
        const weights = [...new Set(dt.map(item => item.weight_class))];
        const methods =[...new Set(dt.map(item => item.method))];

        console.log(`weights -> ${weights}`)
        console.log(`methods -> ${methods}`)
        // Matriz de datos
        

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
    }
    onMount(() => {
        
        getData();
    })
</script>

<div id="container" style="width:100%; height:400px;"></div>

