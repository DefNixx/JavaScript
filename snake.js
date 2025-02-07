window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }
});

// Variáveis para o nome do jogador e pontuação
var playerName = "";
var playerScore = 0;
var computerScore = 0;
var gameMode = "single"; // Padrão: jogar sozinho

// Board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

// Cabeça da cobra do jogador
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];

// Cabeça da cobra do computador
var computerSnakeX = blockSize * 10;
var computerSnakeY = blockSize * 10;
var computerVelocityX = 0;
var computerVelocityY = 0;
var computerSnakeBody = [];

// Comida
var foodX;
var foodY;

// Game over
var gameOver = false;

function startGame() {
    playerName = document.getElementById("playerName").value;
    if (!playerName) {
        alert("Por favor, insira seu nome!");
        return;
    }

    // Captura o modo de jogo escolhido
    gameMode = document.getElementById("gameMode").value;

    restartGame();
}

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // Usado para desenhar na board

    placeFood();
    document.addEventListener("keyup", changeDirection);

    setInterval(update, 1000 / 10); // A cada 100 ms a função de update vai ser executada
};

// Função update definindo os parâmetros/índices da comida e da cobra
function update() {
    if (gameOver) {
        return;
    }

    // Limpa o canvas
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // Desenha a comida
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Lógica da cobra do jogador
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        playerScore++;
        updateScoreboard();
    }

    // Atualiza o corpo da cobra do jogador
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Desenha a cobra do jogador
    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Lógica da cobra do computador (apenas no modo "vsComputer")
    if (gameMode === "vsComputer") {
        if (computerSnakeX == foodX && computerSnakeY == foodY) {
            computerSnakeBody.push([foodX, foodY]);
            placeFood();
            computerScore++;
            updateScoreboard();
        }

        moveComputerSnake();

        // Atualiza o corpo da cobra do computador
        for (let i = computerSnakeBody.length - 1; i > 0; i--) {
            computerSnakeBody[i] = computerSnakeBody[i - 1];
        }
        if (computerSnakeBody.length) {
            computerSnakeBody[0] = [computerSnakeX, computerSnakeY];
        }

        // Desenha a cobra do computador
        context.fillStyle = "blue";
        computerSnakeX += computerVelocityX * blockSize;
        computerSnakeY += computerVelocityY * blockSize;
        context.fillRect(computerSnakeX, computerSnakeY, blockSize, blockSize);
        for (let i = 0; i < computerSnakeBody.length; i++) {
            context.fillRect(computerSnakeBody[i][0], computerSnakeBody[i][1], blockSize, blockSize);
        }
    }

    // Verifica colisões
    checkCollisions();
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
}

function checkCollisions() {
    // Colisões da cobra do jogador
    if (snakeX < 0 || snakeX > cols * blockSize - 1 || snakeY < 0 || snakeY > rows * blockSize - 1) {
        endGame("Você perdeu!");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            endGame("Você perdeu!");
        }
    }

    // Colisões da cobra do computador (apenas no modo "vsComputer")
    if (gameMode === "vsComputer") {
        if (computerSnakeX < 0 || computerSnakeX > cols * blockSize - 1 || computerSnakeY < 0 || computerSnakeY > rows * blockSize - 1) {
            endGame("O computador perdeu!");
        }

        for (let i = 0; i < computerSnakeBody.length; i++) {
            if (computerSnakeX == computerSnakeBody[i][0] && computerSnakeY == computerSnakeBody[i][1]) {
                endGame("O computador perdeu!");
            }
        }

        // Colisão entre as cobras
        for (let i = 0; i < snakeBody.length; i++) {
            if (computerSnakeX == snakeBody[i][0] && computerSnakeY == snakeBody[i][1]) {
                endGame("O computador colidiu com você!");
            }
        }

        for (let i = 0; i < computerSnakeBody.length; i++) {
            if (snakeX == computerSnakeBody[i][0] && snakeY == computerSnakeBody[i][1]) {
                endGame("Você colidiu com o computador!");
            }
        }

        if (snakeX == computerSnakeX && snakeY == computerSnakeY) {
            endGame("Colisão direta entre as cobras!");
        }
    }
}

function updateScoreboard() {
    document.getElementById("playerScoreDisplay").textContent = playerScore;

    // Mostra ou oculta a pontuação do computador com base no modo de jogo
    if (gameMode === "vsComputer") {
        document.getElementById("computerScoreDisplay").textContent = computerScore;
        document.getElementById("computerScoreDisplay").style.display = "inline";
    } else {
        document.getElementById("computerScoreDisplay").style.display = "none";
    }
}

function endGame(message) {
    gameOver = true;
    let resultMessage = `Fim de Jogo!\n${message}\n\n`;
    resultMessage += `Jogador: ${playerName}\n`;
    resultMessage += `Pontuação do Jogador: ${playerScore}\n`;
    if (gameMode === "vsComputer") {
        resultMessage += `Pontuação do Computador: ${computerScore}\n\n`;
    }
    resultMessage += `Deseja jogar novamente?`;

    if (confirm(resultMessage)) {
        restartGame();
    }
}

function moveComputerSnake() {
    // Movimentação simples da cobra do computador em direção à comida
    if (computerSnakeX < foodX) {
        computerVelocityX = 1;
        computerVelocityY = 0;
    } else if (computerSnakeX > foodX) {
        computerVelocityX = -1;
        computerVelocityY = 0;
    } else if (computerSnakeY < foodY) {
        computerVelocityX = 0;
        computerVelocityY = 1;
    } else if (computerSnakeY > foodY) {
        computerVelocityX = 0;
        computerVelocityY = -1;
    }
}

// Função que utiliza Math.floor para posicionar a comida em um lugar aleatório a cada update
function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function restartGame() {
    // Reinicia as variáveis do jogo
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];

    computerSnakeX = blockSize * 10;
    computerSnakeY = blockSize * 10;
    computerVelocityX = 0;
    computerVelocityY = 0;
    computerSnakeBody = [];

    playerScore = 0;
    computerScore = 0;

    gameOver = false;
    placeFood();
    updateScoreboard();
}