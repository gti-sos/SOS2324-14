<svelte:head>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


</svelte:head>

<script>
	import { onMount } from "svelte";
  import { Container } from "@sveltestrap/sveltestrap";

async function fetchTeamData(teamIds) {
  try {
    const promises = teamIds.map(async teamId => {
      const response = await fetch(`/proxyTennis?teamIds=${teamId}`);
      if (response.ok) {
        return response.json();
      } else {
        console.error(`Error al obtener datos para el equipo con ID ${teamId}: ${response.statusText}`);
        return null;
      }
    });

    const data = await Promise.all(promises);
    return data.filter(item => item !== null); // Filtrar los elementos nulos por si hubo algún error en alguna solicitud
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return null;
  }
}
const nombres = [];
const puntos = [];
const torneosJugados = [];

onMount(async () => {
    const teamIds = [23581, 14882, 163504, 275923]; // Lista de IDs de los equipos que deseas obtener
    const data = await fetchTeamData(teamIds);
    if (data) {
      // Procesar los datos obtenidos
      console.log(data);
      data.forEach(item => {
        console.log(item[0])
        item.rankings.forEach(ranking => {
          nombres.push(ranking.rowName);
          puntos.push(ranking.points);
          torneosJugados.push(ranking.tournamentsPlayed);
          console.log(nombres)
          console.log(puntos)
          console.log(torneosJugados)
        });
      });

      crearGrafica();

    } else {
      console.error('No se pudieron obtener los datos de los equipos.');
    }
  });

  function crearGrafica() {
    const ctx = document.getElementById('graficaPuntos').getContext('2d');
    new Chart(ctx, {
      type: 'scatter',
      data: {
        labels: nombres,
        datasets: [{
          label: 'Puntos vs Torneos Jugados',
          data: puntos.map((punto, index) => ({ x: punto, y: torneosJugados[index] })),
          backgroundColor: 'blue' // Color de los puntos
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Puntos'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Torneos Jugados'
            }
          }
        }
      }
    });
  }
</script>

<Container>
<canvas id="graficaPuntos" width="400" height="400"></canvas>

</Container>
