<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { dev } from '$app/environment';
    import { Container, ListGroup, ListGroupItem } from '@sveltestrap/sveltestrap';

    let players = [];

    onMount(async () => {
        try {
            let API = 'https://sos2324-14.appspot.com/api/v2'; 
            if (dev) API = 'http://localhost:10002/api/v2'; 

            const response = await axios.get(`${API}/youtube-trends/proxyBasketVEG`);
            
            if (response.data && response.data.results) {
                players = response.data.results;

                if (players.length > 0) {
                    const chartData = {
                        labels: players.map(player => player.entity.name),
                        series: players.map(player => player.score)
                    };

                    const options = {
                        chart: {
                            type: 'pie',
                            height: 400
                        },
                        labels: chartData.labels,
                        series: chartData.series,
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200
                                },
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        }]
                    };

                    new ApexCharts(document.querySelector('#chart'), options).render();
                }
            } else {
                console.error('No se recibieron datos válidos de la API.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
</script>

<Container>
    <h1>Uso Textual/Widget API Externa 3 (Basket API): con proxy</h1>
    <h5>Detalles de jugadores con nombre "Kevin"</h5>
    {#if players.length > 0}
        <ListGroup>
            {#each players as player}
                <ListGroupItem>
                    <p>Nombre: {player.entity.name}</p>
                    <p>Equipo: {player.entity.team.name}</p>
                    <p>Posición: {player.entity.position}</p>
                    <p>Puntuación: {player.score}</p>
                </ListGroupItem>
            {/each}
        </ListGroup>
    {:else}
        <p>No hay datos disponibles.</p>
    {/if}

    <div id="chart"></div>
</Container>

<style>
    #chart {
        margin-top: 20px;
        width: 100%;
        height: 400px;
    }
</style>




