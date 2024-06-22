const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

const boardSize = 10;
const gameSpeed = 195;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, '0');
    const [row, column] = newSquare.split('');

    if (newSquare < 0 ||
        newSquare >= boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction !== 'ArrowDown' && setDirection(key.code);
            break;
        case 'ArrowDown':
            direction !== 'ArrowUp' && setDirection(key.code);
            break;
        case 'ArrowLeft':
            direction !== 'ArrowRight' && setDirection(key.code);
            break;
        case 'ArrowRight':
            direction !== 'ArrowLeft' && setDirection(key.code);
            break;
    }
}

const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;
}

const handleTouchMove = (e) => {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touch = e.touches[0];
    const x = touch.pageX;
    const y = touch.pageY;

    const deltaX = x - touchStartX;
    const deltaY = y - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            setDirection('ArrowRight');
        } else {
            setDirection('ArrowLeft');
        }
    } else {
        if (deltaY > 0) {
            setDirection('ArrowDown');
        } else {
            setDirection('ArrowUp');
        }
    }

    // Reset touch start coordinates
    touchStartX = null;
    touchStartY = null;
}

const handleTouchEnd = () => {
    // Clean up touch tracking if needed
    touchStartX = null;
    touchStartY = null;
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const createBoard = () => {
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const squareValue = `${row}${col}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        }
    }
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = 0;
    direction = 'ArrowRight';
    boardSquares = [];
    emptySquares = [];
    board.innerHTML = '';
    createBoard();
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        startGame();
    }
});

startButton.addEventListener('click', startGame);

// Iniciar juego al cargar la página (opcional)
startGame();