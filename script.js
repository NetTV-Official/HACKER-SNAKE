// Game initialization
document.addEventListener('DOMContentLoaded', () => {
    // Show VHS intro first
    setTimeout(() => {
        document.getElementById('vhsIntro').style.display = 'none';
        document.getElementById('bootScreen').style.display = 'block';
    }, 5000); // 5 second VHS intro

    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectDifficulty(btn.dataset.difficulty);
        });
    });

    // Keyboard selection
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('bootScreen').style.display !== 'none') {
            if (e.key === '1') selectDifficulty('easy');
            if (e.key === '2') selectDifficulty('normal');
            if (e.key === '3') selectDifficulty('hard');
            if (e.key === '4') selectDifficulty('extreme');
        }
    });
});
// Game variables
let difficulty = "normal";
let gameSpeed = 150;
let gameRunning = false;
let score = 0;
let gameInterval;

// Initialize boot screen
document.addEventListener('DOMContentLoaded', () => {
    // Mouse selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectDifficulty(btn.dataset.difficulty);
        });
    });

    // Keyboard selection
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('bootScreen').style.display !== 'none') {
            if (e.key === '1') selectDifficulty('easy');
            if (e.key === '2') selectDifficulty('normal');
            if (e.key === '3') selectDifficulty('hard');
            if (e.key === '4') selectDifficulty('extreme');
        }
    });
});

function selectDifficulty(level) {
    difficulty = level;
    switch(level) {
        case 'easy': gameSpeed = 200; break;
        case 'normal': gameSpeed = 150; break;
        case 'hard': gameSpeed = 100; break;
        case 'extreme': gameSpeed = 70; break;
    }

    document.getElementById('bootScreen').style.display = 'none';
    document.getElementById('cutscene').style.display = 'flex';
    document.getElementById('difficultyDisplay').textContent = level.toUpperCase();
    
    setTimeout(() => {
        document.getElementById('cutscene').style.display = 'none';
        document.getElementById('gameWindow').style.display = 'block';
        startGame();
    }, 2000);
}

function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    let snake = [{x: 200, y: 200}];
    let dx = gridSize;
    let dy = 0;
    let food = generateFood();
    let errors = [];
    score = 0;
    gameRunning = true;

    document.getElementById('scoreDisplay').textContent = score;

    function generateFood() {
        return {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    }

    function generateRandomHex(length) {
        return Array.from({length}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    }

    function showBlueScreen() {
        document.getElementById('errorCode').textContent = generateRandomHex(6);
        document.getElementById('errorAddress').textContent = '0x' + generateRandomHex(8);
        document.getElementById('finalScore').textContent = score;
        
        // Hide all other screens
        document.getElementById('gameWindow').style.display = 'none';
        document.getElementById('bootScreen').style.display = 'none';
        document.getElementById('cutscene').style.display = 'none';
        
        // Show blue screen
        document.getElementById('blueScreen').style.display = 'flex';

        // Add event listener for returning to menu
        document.addEventListener('keydown', function bsodKeyHandler(e) {
            document.getElementById('blueScreen').style.display = 'none';
            document.getElementById('bootScreen').style.display = 'block';
            document.removeEventListener('keydown', bsodKeyHandler);
        }, { once: true });
    }

    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -gridSize; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = gridSize; }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -gridSize; dy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = gridSize; dy = 0; }
    });

    function gameLoop() {
        if (!gameRunning) return;
        
        let head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Check for collisions
        if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || 
            snake.some(seg => seg.x === head.x && seg.y === head.y) ||
            errors.some(err => err.x === head.x && err.y === head.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById('scoreDisplay').textContent = score;
            food = generateFood();
            
            if (score % 5 === 0) {
                errors.push(generateFood());
            }
        } else {
            snake.pop();
        }
        
        drawGame();
    }

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
        
        // Draw snake
        ctx.fillStyle = "lime";
        snake.forEach(seg => ctx.fillRect(seg.x, seg.y, gridSize, gridSize));
        
        // Draw errors
        ctx.fillStyle = "yellow";
        errors.forEach(err => ctx.fillRect(err.x, err.y, gridSize, gridSize));
    }

    function gameOver() {
        gameRunning = false;
        clearInterval(gameInterval);
        setTimeout(() => {
            showBlueScreen();
        }, 100);
    }

    // Clear any existing interval
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}