const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

//Routing
app.get('/', function(req, res){
    res.sendFile('/index.html');
});

// Game Variables
var debugMode = true;
var canvasW = 500;
var canvasH = 500;
var playerW = 50;
var playerH = 50;
var players = {};

// Functions
function consoleDebug(message)
{
    if(debugMode)
        console.log(`DEBUG: ${message}`);
}

function handleDisconnect()
{
    // Se o cliente que desconectou está na lista de jogadores, desconectamos ele.
    if(players[this.id]) {
        console.log(`CONSOLE: Jogador ${players[this.id].name} desconectou do jogo.`);
        delete players[this.id];
    } else {
        // O cliete não está na lista de jogadores, logo, ele não foi autenticado.
        consoleDebug(`Cliente ${this.id} desconectou sem autenticar.`);
    }
}

/**
 * Jogador já tem um nick, agora vamos inserí-lo dentro do jogo propriamente ao jogo!
 * 
 * @param {string} nickname 
 */
function startGame(nickname)
{
    players[this.id] = {
        id: this.id,
        name: nickname, // NOTA: Deveríamos fazer um doublecheck pra tirar carácteres inválidos.
        posX: 250, // NOTA: Isso deve ser aleatório. Estático por enquanto.
        posY: 250, // NOTA: Isso deve ser aleatório. Estático por enquanto.
        score: 0,
    };

    console.log(`CONSOLE: Cliente ${this.id} autenticado, jogador ${players[this.id].name} está online!`);
    console.log(players);
}

// Networking
io.on('connection', function(socket){
    
    var data = {
        canvasW: canvasW,
        canvasH: canvasH,
        playerW: playerW,
        playerH: playerH,
        player: {
            id: socket.id,
            name: null,
            posX: 0,
            posY: 0,
            score: 0,
        },
    }

    // Envia informações iniciais pro clietne.
    socket.emit('init', data);
    consoleDebug(`Cliente: ${socket.id} entrou na página, aguardando autenticação...`);

    // Estamos esperando o cliente iniciar o jogo...
    socket.on('startGame', startGame);

    // Jogador desconectou
    socket.on('disconnect', handleDisconnect);
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});