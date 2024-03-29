<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import { Button, ListGroup, ListGroupItem, NavLink } from '@sveltestrap/sveltestrap';

    let API = "/api/v1/youtube-trends";

    if(dev)
        API = "http://localhost:10002"+ API;

    let videos = [];
    let newVideo = {"ranking": 12,
                    "country": "España", 
                    "title": "Prueba", 
                    "published_at": "2022-11-26T22:00:12Z",
                    "channel_title": "Canal de prueba", 
                    "category_id": 33,
                    "trending_date": '22.11.26', 
                    "view_count": 5130167, 
                    "comment_count": 3641}
    let errorMsg = ""

    onMount(()=>{
        getVideos();
    })

    //Cargar datos iniciales
    async function loadInitialData() {
        try {
            let response = await    fetch(API+"/loadInitialData", {
                                        method: "GET"
                                    });
            if (response.status == 201)
                getVideos();
            else
                errorMsg = "code: "+ response.status;
        } catch (error) {
            errorMsg = error;
        }
    }

    //GET básico
    async function getVideos(){
        try{
            let response = await fetch(API, {
                            method:"GET"
                        });
        let data = await response.json();
        videos = data;

        }catch(error){
            errorMsg = error;
        }
        
    }

    //POST básico
    async function createVideo() {
        try {
            let response = await    fetch(API, {
                                        method: "POST",
                                        headers:{
                                            "Content-Type":"application/json"
                                        },
                                        body: JSON.stringify(newVideo)
                                    });
            let status = await response.status;
    
            if (status == 201)
                getVideos();
            else
                errorMsg = "code: "+ status;
        } catch (error) {
            errorMsg = error;
        }
        
    }

    //DELETE por ranking
    async function deleteVideo(ranking) {
        try {

            let response = await    fetch(API+`/${ranking}`, {
                                        method: "DELETE"
                                    });
            if (response.status == 200)
                getVideos();
            else
                errorMsg = "code: "+ response.status;
        } catch (error) {
            errorMsg = error;
        }
        
    }

    //DELETE coleccion
    async function deleteColection() {
        try {
            
            let response = await    fetch(API, {
                method: "DELETE"
            });
            if (response.status == 200)
                getVideos();
            else
                errorMsg = "code: "+ response.status;

        } catch (error) {
            errorMsg = error;
        }
    }

</script>

<table>
    <thead>
        <tr>
            <th>
                Ranking
            </th>
            <th>
                Country    
            </th>
            <th>
                Title
            </th>
            <th>
                Published_at   
            </th>
            <th>
                Channel_title  
            </th>
            <th>
                Category_id
            </th>
            <th>
                Trending_date 
            </th>
            <th>
                View_count
            </th>
            <th>
                Comment_count
            </th>
            
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value = {newVideo.ranking}>
            </td>

            <td>
                <input bind:value = {newVideo.country}>
            </td>

            <td>
                <input bind:value = {newVideo.title}>
            </td>

            <td>
                <input bind:value = {newVideo.published_at}>
            </td>

            <td>
                <input bind:value = {newVideo.channel_title}>
            </td>

            <td>
                <input bind:value = {newVideo.category_id}>
            </td>

            <td>
                <input bind:value = {newVideo.trending_date}>
            </td>

            <td>
                <input bind:value = {newVideo.view_count}>
            </td>

            <td>
                <input bind:value = {newVideo.comment_count}>
            </td>
        </tr>
    </tbody>

</table>

<ul>
    {#each videos as video}
        <li><a href="/youtube-trends/{video.ranking}">{video.ranking}</a>,{video.country}, {video.title}, {video.published_at}, {video.channel_title}, {video.category_id}, {video.trending_date}, {video.view_count}, {video.comment_count} <button on:click="{deleteVideo(video.ranking)}">Delete</button></li>
    {/each}
</ul>

<button on:click="{createVideo}">Create</button>

<button on:click="{deleteColection}">Borrar todo</button>

{#if errorMsg != ""}
ERROR: {errorMsg}
{/if}