<script>
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
</script>

<svelte:head>
    <title>APIs Grupo 14</title>
</svelte:head>

<Header/>
<hr>
<slot></slot>
<hr>

<Footer/>