<script>
    import { dev } from "$app/environment";

    let mode = "production"

    if(dev)
        mode = "development"
</script>

Estas en modo {mode}