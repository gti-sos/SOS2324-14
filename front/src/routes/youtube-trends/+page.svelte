<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Button, Container, ListGroup, ListGroupItem, NavLink } from '@sveltestrap/sveltestrap';

	let API = '/api/v1/youtube-trends';

	if (dev) API = 'http://localhost:10002' + API;

	let videos = [];
	let newVideo = {
		ranking: 11,
		country: 'España',
		title: 'Prueba',
		published_at: '2022-11-26T22:00:12Z',
		channel_title: 'Canal de prueba',
		category_id: 33,
		trending_date: '22.11.26',
		view_count: 5130167,
		comment_count: 3641
	};

	let errorMsg = '';
	let successMsg = ''; // Mensaje de éxito

	onMount(() => {
		getVideos();
	});

	async function loadInitialData() {
		try {
			let response = await fetch(API + '/loadInitialData', {
				method: 'GET'
			});
			if (response.status == 201) {
				getVideos();
				successMsg = 'Datos iniciales cargados exitosamente';
				setTimeout(() => {
					successMsg = '';
				}, 3000);
			} else {
				errorMsg = 'Error al cargar los datos iniciales';
				setTimeout(() => {
					errorMsg = '';
				}, 3000);
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	async function getVideos() {
		try {
			// Construir la URL de la solicitud con los parámetros de paginación y filtros de búsqueda
			let url = `${API}?offset=${offset}&limit=${limit}`;
			for (const attribute in searchInputs) {
				if (searchInputs[attribute].trim() !== '') {
					url += `&${attribute}=${searchInputs[attribute]}`;
				}
			}

			let response = await fetch(url, {
				method: 'GET'
			});
			let data = await response.json();

			// Actualizar la lista de videos
			videos = data;

			// Restablecer el mensaje de error
			errorMsg = '';
		} catch (error) {
			// Manejar errores
			errorMsg = error.message || 'Se produjo un error al cargar los datos';
		}
	}

	async function createVideo() {
		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newVideo)
			});
			let status = await response.status;

			if (status == 201) {
				successMsg = 'El video se ha creado exitosamente';
				getVideos();
				setTimeout(() => {
					successMsg = '';
				}, 3000);
			} else {
				errorMsg = 'Error al crear el video';
				setTimeout(() => {
					errorMsg = '';
				}, 3000);
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	async function deleteCollection() {
		try {
			let response = await fetch(API, {
				method: 'DELETE'
			});
			if (response.status == 200) {
				successMsg = 'Los videos se han borrado exitosamente';
				getVideos();
				setTimeout(() => {
					successMsg = '';
				}, 3000);
			} else {
				errorMsg = 'Error al borrar todos los videos';
				setTimeout(() => {
					errorMsg = '';
				}, 3000);
			}
		} catch (error) {
			errorMsg = error;
		}
	}

	let searchInputs = {};
	let attributes = [
		'ranking',
		'country',
		'title',
		'published_at',
		'channel_title',
		'category_id',
		'trending_date',
		'view_count',
		'comment_count'
	];

	// Inicializar searchInputs con atributos como claves y valores predeterminados como cadenas vacías
	attributes.forEach((attribute) => {
		searchInputs[attribute] = '';
	});

	let successMsgSearch = '';
	let errorMsgSearch = '';

	async function search() {
		// Limpiar mensajes anteriores
		successMsgSearch = '';
		errorMsgSearch = '';

		// Obtener todos los videos si la búsqueda está vacía
		if (Object.values(searchInputs).every((input) => input.trim() === '')) {
			getVideos();
			return;
		}

		try {
			let response = await fetch(API, {
				method: 'GET'
			});
			let data = await response.json();

			// Filtrar los videos según la búsqueda en los campos seleccionados
			let filteredVideos = data.filter((video) => {
				return attributes.every((attribute) => {
					const value = video[attribute];
					if (typeof value === 'string') {
						return value.toLowerCase().includes(searchInputs[attribute].toLowerCase());
					} else if (typeof value === 'number') {
						return value.toString().includes(searchInputs[attribute]);
					} else {
						return false;
					}
				});
			});

			// Actualizar la lista de videos
			videos = filteredVideos;

			// Mostrar mensaje de éxito si se encontraron datos
			if (filteredVideos.length > 0) {
				successMsgSearch = 'Datos encontrados';
				setTimeout(() => {
					successMsgSearch = '';
				}, 2000);
			} else {
				// Mostrar mensaje de error si no se encontraron datos
				errorMsgSearch = 'No se ha encontrado datos con esas características';
				setTimeout(() => {
					errorMsgSearch = '';
				}, 2000);
			}
		} catch (error) {
			errorMsgSearch = error;
		}
	}

	let offset = 0; // Inicialmente establecido en 0
	let limit = 10; // Mostrar 10 resultados por página
	let currentPage = 1;

	function calculateCurrentPage() {
		currentPage = Math.floor(offset / limit) + 1;
	}

	function goToNextPage() {
		offset += limit;
		getVideos();
		checkNextPageAvailability();
	}

	function goToPreviousPage() {
		if (offset >= limit) {
			offset -= limit;
			getVideos();
			checkNextPageAvailability();
		}
	}

	function checkNextPageAvailability() {
		if (videos.length < limit) {
			document.querySelector('.next-page-btn').disabled = true;
		} else {
			document.querySelector('.next-page-btn').disabled = false;
		}
	}

	function navigateToVistas() {
        window.location.href = "/youtube-trends/vistas";
    }

</script>
<svelte:head>
    <title>YouTubeTrends</title>
</svelte:head>
<Container>
	<button on:click={loadInitialData} class="btn btn-primary">Cargar Datos Iniciales</button>
	<button on:click={navigateToVistas} class="btn btn-warning text-white">Vistas</button>

	{#if errorMsgSearch != ''}
		<div style="margin-top: 10px;" class="alert alert-danger" role="alert">
			{errorMsgSearch}
		</div>
	{/if}

	{#if successMsgSearch != ''}
		<div style="margin-top: 10px;" class="alert alert-success" role="alert">
			{successMsgSearch}
		</div>
	{/if}

	<div style="margin-top: 20px;">
		<h5><strong>Buscar Recursos</strong></h5>
		<table>
			<tr>
				{#each attributes as attribute}
					<td>
						<label for={attribute}>{attribute}</label>
						<input
							type="text"
							bind:value={searchInputs[attribute]}
							placeholder={'Introduce datos'}
							id={attribute}
						/>
					</td>
				{/each}
			</tr>
		</table>

		<!-- Botón para realizar la búsqueda -->
		<button on:click={search} class="btn btn-primary">Buscar</button>
	</div>

	<hr />
	<h1><strong>Lista de Vídeos</strong></h1>
	{#if videos.length === 0}
		<p>No hay datos que mostrar...</p>
	{:else}
		<ul>
			{#each videos as video}
				<li class="videoItem">
					<a href="/youtube-trends/{video.ranking}">{video.ranking}</a>,{video.country}, {video.title},
					{video.published_at}, {video.channel_title}, {video.category_id}, {video.trending_date}, {video.view_count},
					{video.comment_count}
				</li>
			{/each}
		</ul>
	{/if}

	<!-- Botones para la paginación -->
	<button on:click={goToPreviousPage} class="btn btn-secondary" disabled={offset === 0}
		>Página Anterior</button
	>
	<span> {currentPage}</span>
	<button on:click={goToNextPage} class="btn btn-secondary" disabled={videos.length < limit}>Página Siguiente</button>


	<hr />
	<h5><strong>Añadir Vídeos</strong></h5>
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
				<td><input type="number" bind:value={newVideo.ranking} /></td>
				<td><input bind:value={newVideo.country} /></td>
				<td><input bind:value={newVideo.title} /></td>
			</tr>
			<tr>
				<th>Published_at</th>
				<th>Channel_title</th>
				<th>Category_id</th>
			</tr>
			<tr>
				<td><input bind:value={newVideo.published_at} /></td>
				<td><input bind:value={newVideo.channel_title} /></td>
				<td><input type="number" bind:value={newVideo.category_id} /></td>
			</tr>
			<tr>
				<th>Trending_date</th>
				<th>View_count</th>
				<th>Comment_count</th>
			</tr>
			<tr>
				<td><input bind:value={newVideo.trending_date} /></td>
				<td><input type="number" bind:value={newVideo.view_count} /></td>
				<td><input type="number" bind:value={newVideo.comment_count} /></td>
			</tr>
		</tbody>
	</table>

	<div style="margin-top: 20px;">
		<button on:click={createVideo} class="btn btn-success">Añadir</button>
		<button on:click={deleteCollection} class="btn btn-danger">Borrar todo</button>
	</div>

	{#if errorMsg != ''}
		<div style="margin-top: 10px;" class="alert alert-danger" role="alert">
			{errorMsg}
		</div>
	{/if}

	{#if successMsg != ''}
		<div style="margin-top: 10px;" class="alert alert-success" role="alert">
			{successMsg}
		</div>
	{/if}
</Container>
