<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { page } from '$app/stores';
	import { Container } from "@sveltestrap/sveltestrap";

    let ranking = $page.params.ranking;
    let API = "/api/v1/youtube-trends";
    if (dev) API = "http://localhost:10002" + API;

    let video = {};
    let errorMsg = "";
    let successMsg = "";

    async function cargarDetalles(ranking) {
        try {
            const response = await fetch(`${API}/${ranking}`);
            if (response.ok) {
                video = await response.json();
            } else {
                throw new Error(`Error al obtener los detalles del video: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
            errorMsg = "Error al cargar los detalles del video";
        }
    }

    // Obtener los detalles del video al montar el componente
    onMount(() => {
        if (Object.keys(video).length === 0) { // Verificar si el objeto video está vacío
            cargarDetalles(ranking);
        }
    });

    async function deleteVideo(ranking) {
        try {
            let response = await    fetch(API+`/${ranking}`, {
                                        method: "DELETE"
                                    });
            if (response.status == 200){
                successMsg = "El dato se ha borrado correctamente";
                setTimeout(() => {
                    successMsg = "";
                    window.location.href = '/youtube-trends';
                }, 3000);
            }
            else
                compruebaError(response.status);
        } catch (error) {
            compruebaError(error);
        }
        
    }

    async function guardarCambios() {
        try {
            const response = await fetch(`${API}/${ranking}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(video)
            });
            if (response.ok) {
                successMsg = "Los cambios se guardaron correctamente.";
                setTimeout(() => {
                    successMsg = "";
                    window.location.href = '/youtube-trends';
                }, 3000);
            } else {
                throw new Error(`Error al guardar los cambios`);
            }
        } catch (error) {
            console.error(error);
            errorMsg = "Error al guardar los cambios";
        }
    }
</script>

<Container>
<h1><strong>Editar video con ranking = {ranking}</strong></h1>

<Container>
    <table>
        <thead>
            <tr>
                <th>Ranking</th>
                <th>Country</th>
                <th>Title</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{video.ranking}</td>
                <td><input type="text" bind:value="{video.country}"></td>
                <td><input type="text" bind:value="{video.title}"></td>
            </tr>
            <tr>
                <th>Published at</th>
                <th>Channel title</th>
                <th>Category ID</th>
            </tr>
            <tr>
                <td><input type="text" bind:value="{video.published_at}"></td>
                <td><input type="text" bind:value="{video.channel_title}"></td>
                <td><input type="number" bind:value="{video.category_id}"></td>
            </tr>
            <tr>
                <th>Trending date</th>
                <th>View count</th>
                <th>Comment count</th>
            </tr>
            <tr>
                <td><input type="text" bind:value="{video.trending_date}"></td>
                <td><input type="number" bind:value="{video.view_count}"></td>
                <td><input type="number" bind:value="{video.comment_count}"></td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 20px;">
        <button on:click="{guardarCambios}" class="btn btn-success">Guardar Cambios</button>
        <button on:click={() => deleteVideo(ranking)} class="btn btn-danger">Eliminar</button>
    </div>
</Container>


{#if errorMsg != ""}
    <div style="margin-top: 10px;" class="alert alert-danger" role="alert">
        {errorMsg}
    </div>
{/if}

{#if successMsg != ""}
    <div style="margin-top: 10px;" class="alert alert-success" role="alert">
        {successMsg}
    </div>
{/if}

</Container>
