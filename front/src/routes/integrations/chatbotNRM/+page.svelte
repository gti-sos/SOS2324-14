<script>
    import { Container, Button, Row, ListGroup, ListGroupItem, Col} from '@sveltestrap/sveltestrap';
	
  

    let question;
    // export let chatResponse = [];
    let chatResponse ;

    async function getResponse() {
        
        const encodedParams = new URLSearchParams();
        encodedParams.set('in', `${question}`);
        encodedParams.set('op', 'in');
        encodedParams.set('cbot', '1');
        encodedParams.set('SessionID', 'RapidAPI1');
        encodedParams.set('cbid', '1');
        encodedParams.set('key', 'RHMN5hnQ4wTYZBGCF3dfxzypt68rVP');
        encodedParams.set('ChatSource', 'RapidAPI');
        encodedParams.set('duration', '1');

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '88a523cd96msh3544e0ee37800ebp1845b1jsnf31a7971dadb',
                'X-RapidAPI-Host': 'robomatic-ai.p.rapidapi.com'
            },
            body: encodedParams
        };

        try {
            
            const response = await fetch('https://robomatic-ai.p.rapidapi.com/api', options);
            const data = await response.json();
            chatResponse = data.out;
            // chatResponse.push(chatResponse,`User: ${question}`);
            // chatResponse.push(response.data.out); 
            console.log (chatResponse);
            // console.log(chatResponse.length);

        } catch (error) {
            console.error(error);
        }
    }

    // onMount(() => {
    //     getResponse();
    // })
   async function addString() {
        try {
            chatResponse.push('Hopaaaaa')
            console.log(chatResponse);
            console.log(chatResponse.length);
        } catch (error) {
            
        }
    } 
    


</script>

<style>
    .chat-container {
        margin-top: 20px;
        border-radius: 20px;
        width: 80%;
        height: 80%;
        margin: auto;
        border: solid 3px;
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
        background-image: url('/home/nico/SOS2324-14/front/static/ia.jpeg');
        background-position: center;
        padding: 30px;
        overflow-y: auto;
        display:  grid;
        align-items: baseline
    }
     

    .response {
        font-size: 18px; /* Ajusta el tamaño de la letra */
        text-align: center;
        border-radius: 6px;
        background-color: aliceblue;
        width: 50%;
        margin: auto;
        opacity: 1;
        transition: opacity 1s ease-in-out; /* Center text */
        padding: 10px; /* Añade espacio interno */
        margin-bottom: 10px; /* Añade espacio en la parte inferior */
        border: solid 3px rgba(0, 0, 0, 0.5);
    }
    
</style>
  
<Container>
    <!-- <Button class="btn btn-primary" type="button" on:click={addString}>Enviar</Button> -->
    <div class="container chat-container">
        <!-- {#if chatResponse.length > 0}
            <ListGroup>
                {#each chatResponse as response}
                <ListGroupItem class="gameItem">
                    <Row >
                        <span class="response" style="border: solid 1px; justify-content: center; border-radius: 10px; background-color: aliceblue;">{response}</span>
                    </Row>
                </ListGroupItem>
                {/each}
            </ListGroup>
        {:else}
            <p>Hello! Tell me something</p>
        {/if} -->

        {#if chatResponse != undefined}
            <span class="response" >{chatResponse}</span>    
        {/if}
        
    <div class="input-group mb-3" style="align-self: last baseline;">
        <input type="text" class="form-control" placeholder="Escribe tu mensaje..." bind:value={question}>
        <div class="input-group-append">
          <Button class="btn btn-primary" type="button" on:click={getResponse}>Enviar</Button>
        </div>
      </div>
    </div>
  </Container>

  