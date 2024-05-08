<script>
    import axios from 'axios';
    import { onMount } from 'svelte';
    import { Container, ListGroup, ListGroupItem } from '@sveltestrap/sveltestrap';

    //Para los detalles de un canal
    const options1 = {
        method: 'GET',
        url: 'https://youtube-data8.p.rapidapi.com/channel/details/',
        params: {
            id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw'
        },
        headers: {
            'X-RapidAPI-Key': 'c4dcccf12bmshb28d319bf18afe1p17ebd3jsn3d5ff8dfec68',
            'X-RapidAPI-Host': 'youtube-data8.p.rapidapi.com'
        }
    };

    // Variable que guarda los detalles del canal
    let channelDetails = null;

    // Función para obtener los datos del primer endpoint
    const fetchChannelDetails = async () => {
        try {
            const response = await axios.request(options1);
            channelDetails = response.data;
        } catch (error) {
            console.error('Error al obtener los detalles del canal:', error);
        }
    };

    //Para la playlist
    const options2 = {
        method: 'GET',
        url: 'https://youtube-data8.p.rapidapi.com/playlist/videos/',
        params: {
            id: 'PLcirGkCPmbmFeQ1sm4wFciF03D_EroIfr',
            hl: 'en',
            gl: 'US'
        },
        headers: {
            'X-RapidAPI-Key': 'c4dcccf12bmshb28d319bf18afe1p17ebd3jsn3d5ff8dfec68',
            'X-RapidAPI-Host': 'youtube-data8.p.rapidapi.com'
        }
    };

    // Variable que guarda los datos de la segunda llamada a la API
    let playlistVideos = null;

    // Función para obtener los datos del segundo endpoint
    const fetchPlaylistVideos = async () => {
        try {
            const response = await axios.request(options2);
            playlistVideos = response.data;
        } catch (error) {
            console.error('Error al obtener los videos de la lista de reproducción:', error);
        }
    };

    onMount(() => {
        fetchChannelDetails();
        fetchPlaylistVideos();
    });
</script>

<Container>
    <h1>Uso Textual API Externa 1 (YouTube Data): sin proxy</h1>
    <h5>Detalles de un canal</h5>
    {#if channelDetails}
        <ListGroup>
            <ListGroupItem>Título: {channelDetails.title}</ListGroupItem>
            <ListGroupItem>Nombre de usuario: {channelDetails.username}</ListGroupItem>
            <ListGroupItem>Suscriptores: {channelDetails.stats.subscribersText}</ListGroupItem>
            <ListGroupItem>Videos: {channelDetails.stats.videosText}</ListGroupItem>
            <ListGroupItem>Vistas: {channelDetails.stats.views}</ListGroupItem>
            <ListGroupItem>Descripción: {channelDetails.description}</ListGroupItem>
            <ListGroupItem>
                Enlaces:
                <ul>
                    {#each channelDetails.links as link}
                        <li><a href={link.targetUrl} target="_blank">{link.title}</a></li>
                    {/each}
                </ul>
            </ListGroupItem>
        </ListGroup>
    {:else}
        <p>Cargando detalles del canal...</p>
    {/if}
    <hr>
    <h5>Videos de la Lista de Reproducción</h5>

    {#if playlistVideos}
        <ListGroup>
            {#each playlistVideos.contents as video}
                <ListGroupItem>
                    <a href={`https://www.youtube.com/watch?v=${video.video.videoId}`} target="_blank">{video.video.title}</a>
                    <p>Duración: {video.video.lengthSeconds} segundos</p>
                </ListGroupItem>
            {/each}
        </ListGroup>
    {:else}
        <p>Cargando videos de la lista de reproducción...</p>
    {/if}
</Container>



