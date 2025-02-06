//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//cabeça da cobra player
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//cabeça da cobra computador
var computerSnakeX = blockSize * 10;
var computerSnakeY = blockSize * 10;

var computerVelocityX = 0;
var computerVelocityY = 0;

var computerSnakeBody = [];

//comida
var foodX;
var foodY;

//game over
var gameOver = false; 

window.onload = function()
{
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;  
    context = board.getContext("2d"); //usado pra desenhar na board


    placeFood();
    document.addEventListener("keyup", changeDirection);

    setInterval(update, 1000/10); //a cada 100 ms a função de update vai ser executada
    
}

//função update definindo os parâmetros/índices da comida e da cobra
function update() {
    if (gameOver) 
    {
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Movimentação da cobra do jogador
    if (snakeX == foodX && snakeY == foodY) 
    {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) 
    {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) 
    {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) 
    {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Movimentação da cobra do computador
    moveComputerSnake();

    if (computerSnakeX == foodX && computerSnakeY == foodY) 
    {
        computerSnakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let i = computerSnakeBody.length - 1; i > 0; i--) 
    {
        computerSnakeBody[i] = computerSnakeBody[i - 1];
    }

    if (computerSnakeBody.length) 
    {
        computerSnakeBody[0] = [computerSnakeX, computerSnakeY];
    }

    context.fillStyle = "blue";
    computerSnakeX += computerVelocityX * blockSize;
    computerSnakeY += computerVelocityY * blockSize;
    context.fillRect(computerSnakeX, computerSnakeY, blockSize, blockSize);
    for (let i = 0; i < computerSnakeBody.length; i++) 
    {
        context.fillRect(computerSnakeBody[i][0], computerSnakeBody[i][1], blockSize, blockSize);
    }

    // Verificar colisões
    checkCollisions();
}

function changeDirection(e)
{
    if (e.code == "ArrowUp" && velocityY != 1)
        {
            velocityX = 0;
            velocityY = -1;
        }
    else if (e.code == "ArrowDown" && velocityY != -1)
        {
            velocityX = 0;
            velocityY = 1;
        }
    else if (e.code == "ArrowRight" && velocityX != -1)
        {
            velocityX = 1;
            velocityY = 0;
        }
    else if (e.code == "ArrowLeft" && velocityX != 1)
        {
            velocityX = -1;
            velocityY = 0;
        }

       
}

function checkCollisions() {
    // Colisões da cobra do jogador
    if (snakeX < 0 || snakeX > cols * blockSize - 1 || snakeY < 0 || snakeY > rows * blockSize - 1) 
    {
        gameOver = true;
        alert("Fim de Jogo! Você perdeu.");
    }

    for (let i = 0; i < snakeBody.length; i++) 
    {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Fim de Jogo! Você perdeu.");
        }
    }

    // Colisões da cobra do computador
    if (computerSnakeX < 0 || computerSnakeX > cols * blockSize - 1 || computerSnakeY < 0 || computerSnakeY > rows * blockSize - 1) 
    {
        gameOver = true;
        alert("Fim de Jogo! O computador perdeu.");
    }

    for (let i = 0; i < computerSnakeBody.length; i++) 
    {
        if (computerSnakeX == computerSnakeBody[i][0] && computerSnakeY == computerSnakeBody[i][1]) {
            gameOver = true;
            alert("Fim de Jogo! O computador perdeu.");
        }
    }

    // Colisão entre as cobras
    for (let i = 0; i < snakeBody.length; i++) 
    {
        if (computerSnakeX == snakeBody[i][0] && computerSnakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Fim de Jogo! O computador colidiu com você.");
        }
    }

    for (let i = 0; i < computerSnakeBody.length; i++) 
    {
        if (snakeX == computerSnakeBody[i][0] && snakeY == computerSnakeBody[i][1]) {
            gameOver = true;
            alert("Fim de Jogo! Você colidiu com o computador.");
        }
    }

    if (snakeX == computerSnakeX && snakeY == computerSnakeY) 
    {
        gameOver = true;
        alert("Fim de Jogo! Colisão direta entre as cobras.");
    }
}

function moveComputerSnake() 
{
    if (computerSnakeX < foodX) 
    {
        computerVelocityX = 1;
        computerVelocityY = 0;
    } else if (computerSnakeX > foodX) 
    {
        computerVelocityX = -1;
        computerVelocityY = 0;
    } else if (computerSnakeY < foodY) 
    {
        computerVelocityX = 0;
        computerVelocityY = 1;
    } else if (computerSnakeY > foodY) 
    {
        computerVelocityX = 0;
        computerVelocityY = -1;
    }
}
//função que utiliza math.floor pra posicionar a comida em um lugar aleatório a cada update
function placeFood()
{
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function restartGame() 
{
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

    gameOver = false;
    placeFood();
}
