<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { page } from '$app/stores';


    let ranking = $page.params.ranking;

    let API = "/api/v1/youtube-trends";
    if (dev) API = "http://localhost:10002" + API;

    let video = {};
    let errorMsg = "";
    let successMsg = "";

    // Función para cargar los detalles del video
    async function cargarDetalles(ranking) {
        try {
            const response = await fetch(`${API}/${ranking}`);
            video = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    // Obtener los detalles del video al montar el componente
    onMount(() => {
        cargarDetalles(ranking);
    });

    // Función para guardar cambios en el video
    async function guardarCambios() {
    try {
        const response = await fetch(`${API}/${ranking}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(video)
        });
        if (response.status === 200) {
            successMsg = "Los cambios se guardaron correctamente.";
            setTimeout(() => {
                successMsg = "";
            }, 3000);
        } else {
            errorMsg = "Error al guardar los cambios";
            setTimeout(() => {
                errorMsg = "";
            }, 3000);
        }
    } catch (error) {
        console.error(error);
        errorMsg = "Error al guardar los cambios";
        setTimeout(() => {
            errorMsg = "";
        }, 3000); 
    }
}

</script>

<h1>Editar video con ranking = {ranking}</h1>

<table>
    <thead>
        <tr>
            <th>Ranking</th>
            <th>Country</th>
            <th>Title</th>
            <th>Published at</th>
            <th>Channel title</th>
            <th>Category ID</th>
            <th>Trending date</th>
            <th>View count</th>
            <th>Comment count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{video.ranking}</td>
            <td><input type="text" bind:value="{video.country}"></td>
            <td><input type="text" bind:value="{video.title}"></td>
            <td><input type="text" bind:value="{video.published_at}"></td>
            <td><input type="text" bind:value="{video.channel_title}"></td>
            <td><input type="number" bind:value="{video.category_id}"></td>
            <td><input type="text" bind:value="{video.trending_date}"></td>
            <td><input type="number" bind:value="{video.view_count}"></td>
            <td><input type="number" bind:value="{video.comment_count}"></td>
        </tr>
    </tbody>
</table>

<button on:click="{guardarCambios}">Save Changes</button>

{#if errorMsg != ""}
    <div class="alert alert-danger" role="alert">
        {errorMsg}
    </div>
{/if}

{#if successMsg != ""}
    <div class="alert alert-success" role="alert">
        {successMsg}
    </div>
{/if}
