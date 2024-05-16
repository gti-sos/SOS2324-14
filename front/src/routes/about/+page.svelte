<script>
    import { dev } from "$app/environment";
    import { Container } from '@sveltestrap/sveltestrap';

    let mode = "production"

    if(dev)
        mode = "development"
</script>

<Container>
    Estas en modo {mode}
	<h1>Vídeos</h1>
	<ul>
		<li><a href="https://www.youtube.com/embed/vJf16rV6YBI?si=1q9xEKCPqKYE8j90">Video Víctor Escalera García</a></li>
	</ul>
</Container>
