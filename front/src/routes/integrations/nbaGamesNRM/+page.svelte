<script>
    import axios from 'axios';
    import { Container, Button, Input, ListGroup, ListGroupItem, Row, Col} from '@sveltestrap/sveltestrap';

    let inputSeason;
    let inputTeam;
    let games = [];

    async function fetchNBAGamesData() {
        
       

        const options = {
            method: 'GET',
            url: 'https://api-nba-v1.p.rapidapi.com/games',
            params: {
                season: inputSeason,
                team: inputTeam
            },
            headers: {
                'X-RapidAPI-Key': '88a523cd96msh3544e0ee37800ebp1845b1jsnf31a7971dadb',
                'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
            }
        };

        try {
	        const response = await axios.request(options);
	        console.log(response.data);
            games = response.data.response;
            console.log(response.data.response);
            console.log(games.length);
        } catch (error) {
        	console.error(error);
        }
    }

    function convertirFecha(fecha) {
        const fechaObj = new Date(fecha);
        const dia = fechaObj.getDate().toString().padStart(2, '0');
        const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaObj.getFullYear();
        const hora = fechaObj.getHours().toString().padStart(2, '0');
        const minutos = fechaObj.getMinutes().toString().padStart(2, '0');

        return `${dia}-${mes}-${año};${hora}:${minutos}`;
    }
</script>

<style>
    .search-container {
        border-radius: 20px;
        border:solid;
        width: 50%;
        background-color: #f2f2f2;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        margin-top: 40px;
}

.games-container {
        overflow-y: auto;
        height: 50%;
        padding-top: 2px; /* Ajusta el espacio para el buscador fijo */
}
</style>
<Container style="align-items: center;">
    <div class="search-container" style="width: 50%; margin: auto;">
        <Container class="d-flex flex-column align-items-center">
            <Input class="mb-2" type="text" bind:value={inputSeason} placeholder="Temporada" />
            <Input class="mb-2" type="text" bind:value={inputTeam} placeholder="Equipo" />
            <Button on:click={fetchNBAGamesData}>Buscar</Button>
        </Container>
    </div>

    <div class="games-container">
        {#if games.length > 0}
            <ListGroup>
                {#each games as game}
                <ListGroupItem class="gameItem">
                    <Row >
                    <Col xs="8" style="justify-content: center;">
                        <span><b>{game.teams.home.name} vs {game.teams.visitors.name}</b></span><br>
                        <span>{game.scores.home.points} - {game.scores.visitors.points}</span>
                    </Col>
                    <Col xs="4">
                        <span>Fecha: {convertirFecha(game.date.start)}</span><br>
                        <span>Estadio: {game.arena.name}</span>
                    </Col>
                    </Row>
                </ListGroupItem>
                {/each}
            </ListGroup>
        {:else}
            <p>No se encontraron juegos para la temporada y equipo especificados.</p>
        {/if}
    </div>
</Container>