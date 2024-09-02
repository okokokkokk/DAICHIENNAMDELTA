const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const PLAYER_SIZE = 64;
const ENEMY_SIZE = 64;
const HEALTH_BAR_HEIGHT = 10;
const PLAYER_SPEED = 200;
const MAX_HEALTH = 100;

let score = 0;
let startTime = Date.now();
let gameOver = false;
let lastAttackTime = Date.now();

const backgroundImage = document.getElementById('backgroundImage');
const playerImage = document.getElementById('playerImage');
const enemyImage = document.getElementById('enemyImage');
const swordImage1 = new Image();
swordImage1.src = 'kiem2.png'; // Đường dẫn tới hình ảnh kiếm 1
const swordImage2 = new Image();
swordImage2.src = 'kiem1.png'; // Đường dẫn tới hình ảnh kiếm 2


function loadCharacterImages() {
    const selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer'));
    const selectedEnemy = JSON.parse(localStorage.getItem('selectedEnemy'));

    if (selectedPlayer && selectedEnemy) {
        playerImage.src = selectedPlayer.image;
        enemyImage.src = selectedEnemy.image;
    }
}

let player = {
    x: width / 2,
    y: height / 2,
    size: PLAYER_SIZE,
    health: MAX_HEALTH,
    image: playerImage,
    dx: 0,
    dy: 0
};

let enemies = [];
let touchControls = {};

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            touchControls['up'] = true;
            break;
        case 's':
            touchControls['down'] = true;
            break;
        case 'a':
            touchControls['left'] = true;
            break;
        case 'd':
            touchControls['right'] = true;
            break;
        case ' ':
            attack();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            touchControls['up'] = false;
            break;
        case 's':
            touchControls['down'] = false;
            break;
        case 'a':
            touchControls['left'] = false;
            break;
        case 'd':
            touchControls['right'] = false;
            break;
    }
});


document.getElementById('attackButton').addEventListener('click', attack);

function attack() {
    if (gameOver) return;

    enemies.forEach((enemy, index) => {
        if (Math.abs(player.x - enemy.x) < PLAYER_SIZE && Math.abs(player.y - enemy.y) < PLAYER_SIZE) {
            enemy.attackCount += 1;
            enemy.health -= 0.6 * enemy.health;
            if (enemy.attackCount >= 3) {
                enemies.splice(index, 1);
            }
            score += Math.max(1, 200 / ((Date.now() - startTime) / 1000));
        }
    });

    lastAttackTime = Date.now();
}

function update() {
    if (gameOver) return;

    const now = Date.now();
    const deltaTime = (now - (player.lastUpdate || now)) / 1000;
    player.lastUpdate = now;

    // Reset tốc độ di chuyển
    player.dx = 0;
    player.dy = 0;

    // Điều chỉnh vận tốc dựa trên các phím điều khiển đang nhấn
    if (touchControls['up']) player.dy = -PLAYER_SPEED;
    if (touchControls['down']) player.dy = PLAYER_SPEED;
    if (touchControls['left']) player.dx = -PLAYER_SPEED;
    if (touchControls['right']) player.dx = PLAYER_SPEED;

    // Di chuyển nhân vật
    player.x += player.dx * deltaTime;
    player.y += player.dy * deltaTime;

    // Đảm bảo nhân vật không ra ngoài khung hình
    player.x = Math.max(0, Math.min(width - PLAYER_SIZE, player.x));
    player.y = Math.max(0, Math.min(height - PLAYER_SIZE, player.y));

    enemies.forEach((enemy) => {
        if (enemy.direction === 'left') enemy.x -= enemy.speed;
        if (enemy.direction === 'right') enemy.x += enemy.speed;
        if (enemy.direction === 'up') enemy.y -= enemy.speed;
        if (enemy.direction === 'down') enemy.y += enemy.speed;

        if (enemy.x < 0 || enemy.x > width - ENEMY_SIZE) enemy.direction = enemy.direction === 'left' ? 'right' : 'left';
        if (enemy.y < 0 || enemy.y > height - ENEMY_SIZE) enemy.direction = enemy.direction === 'up' ? 'down' : 'up';

        if (Math.abs(player.x - enemy.x) < PLAYER_SIZE && Math.abs(player.y - enemy.y) < PLAYER_SIZE) {
            if (now - enemy.lastDamageTime > 1000) {
                player.health -= 0.19 * MAX_HEALTH;
                enemy.lastDamageTime = now;
            }
        }
    });

    if (player.health <= 0) {
        player.health = 0;
        gameOver = true;
        document.getElementById('gameOverScreen').style.display = 'block';
    }

    if (enemies.length === 0 && !gameOver) {
        gameOver = true;
        document.getElementById('winScreen').style.display = 'block';
    }

    if (now - lastAttackTime > 1500) {
        const lostHealth = MAX_HEALTH - player.health;
        const healAmount = 0.3 * lostHealth;
        player.health = Math.min(MAX_HEALTH, player.health + healAmount);
        lastAttackTime = now;
    }

    enemies.forEach((enemy) => {
        if (enemy.health <= 0) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}

function resetGame() {
    score = 0;
    startTime = Date.now();
    gameOver = false;
    lastAttackTime = Date.now();

    loadCharacterImages();

    player = {
        x: width / 2,
        y: height / 2,
        size: PLAYER_SIZE,
        health: MAX_HEALTH,
        image: playerImage,
        dx: 0,
        dy: 0
    };

    enemies = [];
    for (let i = 0; i < 10; i++) {
        enemies.push({
            x: Math.random() * (width - ENEMY_SIZE),
            y: Math.random() * (height - ENEMY_SIZE),
            size: ENEMY_SIZE,
            speed: 2,
            health: MAX_HEALTH,
            image: enemyImage,
            direction: ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)],
            lastDamageTime: Date.now(),
            attackCount: 0
        });
    }

    document.getElementById('winScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';

    gameLoop();
}

function setupTouchControls() {
    const controlButtons = {
        up: document.querySelector('.control-button.up'),
        down: document.querySelector('.control-button.down'),
        left: document.querySelector('.control-button.left'),
        right: document.querySelector('.control-button.right')
    };

    Object.keys(controlButtons).forEach(direction => {
        controlButtons[direction].addEventListener('mousedown', () => {
            touchControls[direction] = true;
        });
        controlButtons[direction].addEventListener('mouseup', () => {
            touchControls[direction] = false;
        });
    });

    // Đảm bảo các sự kiện touch cũng được xử lý
    Object.keys(controlButtons).forEach(direction => {
        controlButtons[direction].addEventListener('touchstart', () => {
            touchControls[direction] = true;
        });
        controlButtons[direction].addEventListener('touchend', () => {
            touchControls[direction] = false;
        });
    });
}

document.getElementById('playAgainWin').addEventListener('click', resetGame);
document.getElementById('playAgainLose').addEventListener('click', resetGame);

document.getElementById('goBackWin').addEventListener('click', () => {
    window.location.href = 'choose.html';
});
document.getElementById('goBackLose').addEventListener('click', () => {
    window.location.href = 'choose.html';
});

window.onload = function() {
    resetGame();
    setupTouchControls();
};

// Add event listeners for touch controls
function setupTouchControls() {
    const controlButtons = {
        up: document.querySelector('.control-button.up'),
        down: document.querySelector('.control-button.down'),
        left: document.querySelector('.control-button.left'),
        right: document.querySelector('.control-button.right')
    };

    Object.keys(controlButtons).forEach(direction => {
        controlButtons[direction].addEventListener('touchstart', () => {
            event.preventDefault(); // Ngăn chặn zoom
            touchControls[direction] = true;
        });
        controlButtons[direction].addEventListener('touchend', () => {
            event.preventDefault(); // Ngăn chặn zoom
            touchControls[direction] = false;
        });
    });
}

// Define functions to handle game logic
function attack() {
    if (gameOver) return;

    enemies.forEach((enemy, index) => {
        if (Math.abs(player.x - enemy.x) < PLAYER_SIZE && Math.abs(player.y - enemy.y) < PLAYER_SIZE) {
            enemy.attackCount += 1;
            enemy.health -= 0.6 * enemy.health;
            if (enemy.attackCount >= 3) {
                enemies.splice(index, 1);
            }
            score += Math.max(1, 200 / ((Date.now() - startTime) / 1000));
        }
    });

    lastAttackTime = Date.now();
}

// Update game state
function update() {
    if (gameOver) return;

    const now = Date.now();
    const deltaTime = (now - (player.lastUpdate || now)) / 1000;
    player.lastUpdate = now;

    player.dx = 0;
    player.dy = 0;

    // Điều chỉnh vận tốc dựa trên các phím điều khiển đang nhấn
    if (touchControls['up']) player.dy = -PLAYER_SPEED * deltaTime;
    if (touchControls['down']) player.dy = PLAYER_SPEED * deltaTime;
    if (touchControls['left']) player.dx = -PLAYER_SPEED * deltaTime;
    if (touchControls['right']) player.dx = PLAYER_SPEED * deltaTime;

    // Di chuyển nhân vật
    player.x += player.dx;
    player.y += player.dy;

    // Đảm bảo nhân vật không ra ngoài khung hình
    player.x = Math.max(0, Math.min(width - PLAYER_SIZE, player.x));
    player.y = Math.max(0, Math.min(height - PLAYER_SIZE, player.y));

    // Cập nhật vị trí và trạng thái của kẻ thù
    enemies.forEach((enemy) => {
        if (enemy.direction === 'left') enemy.x -= enemy.speed;
        if (enemy.direction === 'right') enemy.x += enemy.speed;
        if (enemy.direction === 'up') enemy.y -= enemy.speed;
        if (enemy.direction === 'down') enemy.y += enemy.speed;

        if (enemy.x < 0 || enemy.x > width - ENEMY_SIZE) enemy.direction = enemy.direction === 'left' ? 'right' : 'left';
        if (enemy.y < 0 || enemy.y > height - ENEMY_SIZE) enemy.direction = enemy.direction === 'up' ? 'down' : 'up';

        if (Math.abs(player.x - enemy.x) < PLAYER_SIZE && Math.abs(player.y - enemy.y) < PLAYER_SIZE) {
            if (now - enemy.lastDamageTime > 1000) {
                player.health -= 0.19 * MAX_HEALTH;
                enemy.lastDamageTime = now;
            }
        }
    });

    // Kiểm tra điều kiện kết thúc trò chơi
    if (player.health <= 0) {
        player.health = 0;
        gameOver = true;
        document.getElementById('gameOverScreen').style.display = 'block';
    }

    if (enemies.length === 0 && !gameOver) {
        gameOver = true;
        document.getElementById('winScreen').style.display = 'block';
    }

    // Hồi phục máu của người chơi
    if (now - lastAttackTime > 1500) {
        const lostHealth = MAX_HEALTH - player.health;
        const healAmount = 0.3 * lostHealth;
        player.health = Math.min(MAX_HEALTH, player.health + healAmount);
        lastAttackTime = now;
    }

    // Loại bỏ các kẻ thù đã bị tiêu diệt
    enemies.forEach((enemy) => {
        if (enemy.health <= 0) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}


// Draw game elements
function draw() {
    ctx.clearRect(0, 0, width, height);

    if (gameOver) {
        return;
    }

    ctx.drawImage(backgroundImage, 0, 0, width, height);

    // Vẽ nhân vật
    ctx.drawImage(player.image, player.x, player.y, player.size, player.size);

    // Vẽ thanh kiếm
    drawSwords();

    // Vẽ kẻ thù
    enemies.forEach((enemy) => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.size, enemy.size);
    });

    // Vẽ thanh máu của nhân vật
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y - HEALTH_BAR_HEIGHT, player.size, HEALTH_BAR_HEIGHT);
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y - HEALTH_BAR_HEIGHT, player.size * (player.health / MAX_HEALTH), HEALTH_BAR_HEIGHT);

    // Vẽ thanh máu của kẻ thù
    enemies.forEach((enemy) => {
        ctx.fillStyle = 'white';
        ctx.fillRect(enemy.x, enemy.y - HEALTH_BAR_HEIGHT, enemy.size, HEALTH_BAR_HEIGHT);
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y - HEALTH_BAR_HEIGHT, enemy.size * (enemy.health / MAX_HEALTH), HEALTH_BAR_HEIGHT);
    });

    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('scoreboard').textContent = `Score: ${Math.floor(score)} | Time: ${timeElapsed}s`;
}

function drawSwords() {
    let swordOffsetX = 1; // Độ dịch chuyển kiếm theo trục X
    let swordOffsetY = 1; // Độ dịch chuyển kiếm theo trục Y

    // Tỉ lệ của thanh kiếm so với nhân vật
    let swordScale = 0.25; // Điều chỉnh tỷ lệ này theo ý muốn

    // Tính toán kích thước thanh kiếm dựa trên kích thước nhân vật và tỷ lệ
    let swordWidth1 = swordImage1.width * swordScale;
    let swordHeight1 = swordImage1.height * swordScale;
    let swordWidth2 = swordImage2.width * swordScale;
    let swordHeight2 = swordImage2.height * swordScale;

    if (touchControls['left']) {
        ctx.drawImage(swordImage1, player.x - swordOffsetX - swordWidth1, player.y + player.size / 4, swordWidth1, swordHeight1);
        ctx.drawImage(swordImage2, player.x - swordOffsetX - swordWidth2, player.y + player.size / 4, swordWidth2, swordHeight2);
    } else if (touchControls['right']) {
        ctx.drawImage(swordImage1, player.x + player.size + swordOffsetX, player.y + player.size / 4, swordWidth1, swordHeight1);
        ctx.drawImage(swordImage2, player.x + player.size + swordOffsetX, player.y + player.size / 4, swordWidth2, swordHeight2);
    } else {
        ctx.drawImage(swordImage1, player.x + player.size, player.y, swordWidth1, swordHeight1);
        ctx.drawImage(swordImage2, player.x - swordWidth2, player.y, swordWidth2, swordHeight2);
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Initialize the game
function resetGame() {
    score = 0;
    startTime = Date.now();
    gameOver = false;
    lastAttackTime = Date.now();

    loadCharacterImages();

    player = {
        x: width / 2,
        y: height / 2,
        size: PLAYER_SIZE,
        health: MAX_HEALTH,
        image: playerImage,
        dx: 0,
        dy: 0
    };

    enemies = [];
    for (let i = 0; i < 15; i++) {
        enemies.push({
            x: Math.random() * (width - ENEMY_SIZE),
            y: Math.random() * (height - ENEMY_SIZE),
            size: ENEMY_SIZE,
            speed: 2,
            health: MAX_HEALTH,
            image: enemyImage,
            direction: ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)],
            lastDamageTime: Date.now(),
            attackCount: 0
        });
    }

    document.getElementById('winScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';

    gameLoop();
}
