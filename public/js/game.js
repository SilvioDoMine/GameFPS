// ****************
// Declarações
// ****************
var socket = io();
var nickname = document.getElementById('nickname');
var nicknameButton = document.getElementById('send');

var canvas;
var context;
var myClientId;
var canvasWidth;
var canvasHight;
var playerWidth;
var playerHight;
var gameStarted = false;
var players = {};


// ****************
// Funções
// ****************
function gameLoop()
{
    if(gameStarted)
    {
        console.log('Iniciou!');
    }

    requestAnimationFrame(gameLoop);
}

function startGame()
{
    nickname.value = nickname.value.replace(/\s/g, '');

    if(nickname.value.length == 0) {
        alert('Você precisa digitar um nick para entrar!');
        return;
    }

    if(nickname.value.length < 4) {
        alert('Você precisa digitar um nick maior que três caracteres.');
        return;
    }

    if(nickname.value.length > 15) {
        alert('Você precisa digitar um nick menor que 16 dígitos.');
    }

    // Armazena o nick numa variável
    var nick = nickname.value;

    // Remove seleção de nick
    nickname.parentNode.removeChild(nickname);
    nicknameButton.parentNode.removeChild(nicknameButton);

    socket.emit('startGame', nick);

    // Se já existe um canvas, vamos deletá-lo. => If tenario
    if(canvas != null)
    canvas.parentNode.removeChild(canvas);

    createGameCanvas();

    // Inicia o jogo.
    gameStarted = true;
}

/**
 * Função que recebe todas as variáveis que vem do servidor para renderizar a tela,
 * sincroniza com o cliente, e então convoca a função de criar a tela.
 * 
 * @param {Object} data Variáveis que vem do servidor para renderizar a tela
 */
function initiateGame(data)
{
    canvasWidth     = data.canvasW;
    canvasHeight    = data.canvasH;
    playerWidth     = data.playerW;
    playerHeight    = data.playerH;
    myClientId      = data.player.id;
}

/**
 * Função que cria o Canvas no qual o jogo se passará
 */
function createGameCanvas()
{
    var node = document.createElement("canvas");
        node.width = canvasWidth;
        node.height = canvasHeight;
        node.setAttribute("id", "gameCanvas");
        document.body.appendChild(node);

        canvas = document.getElementById("gameCanvas");
        context = canvas.getContext("2d");
}

// ****************
// Networking
// ****************
socket.on('init', initiateGame);

// ****************
// Listeners
// ****************
nicknameButton.addEventListener('click', startGame);


// Começa a renderizar a tela do jogo
animation = requestAnimationFrame(gameLoop);