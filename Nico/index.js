let express = require('express');
let cool = require('cool-ascii-faces');

let app = express();

const PORT = 10000;

// Para que esto funcione debemos ejecutar el comando export PORT2=11111 en WSL
// Seguido de set | grep PORT2

const PORT2 = process.env.PORT2;

app.get('/', (req, res)=>{
    res.send("<html><body><h1>Hola Mundo!</h1></body></html");
})

app.get('/cool', (req, res) => {
    res.send(`<html><body><h1>${cool()}</h1></body></html`)
})

app.listen(PORT2, ()=>{
    console.log(`Server listening on port ${PORT2}.`);
});
console.log('Server initializing... ')
