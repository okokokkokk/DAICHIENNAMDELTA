const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let PLAYER_SIZE = 64;
const ENEMY_SIZE = 64;
const HEALTH_BAR_HEIGHT = 10;
let PLAYER_SPEED = 200;
let PLAYER_DAMAGE = 30;
let MAX_HEALTH = 100;
let PLAYER_MAX_HEALTH = 100;

let score = 0;
let startTime = Date.now();
let gameOver = false;

const backgroundImage = document.getElementById('backgroundImage');
const playerImage = new Image();
const enemyImage = new Image();
const swordImage1 = new Image();
swordImage1.src = 'kiem2.png';
const swordImage2 = new Image();
swordImage2.src = 'kiem1.png';

function loadCharacterImages() {
    const selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer'));
    const selectedEnemy = JSON.parse(localStorage.getItem('selectedEnemy'));

    if (selectedPlayer && selectedEnemy) {
        playerImage.src = selectedPlayer.image;
        enemyImage.src = selectedEnemy.image;
        player.id = selectedPlayer.id;

        if (selectedPlayer.image === 'hieu3lit.jpg') {
            PLAYER_SIZE = 100; 
            PLAYER_SPEED = 400;
            PLAYER_DAMAGE = 80; 
        } else if (selectedPlayer.image === 'duydau.jpg') {
            PLAYER_SPEED = 300; 
            PLAYER_DAMAGE = 50; 
        } else if (selectedPlayer.image === 'khai.jpg') {
            PLAYER_SPEED = 500;
            PLAYER_SIZE = 70; 
            PLAYER_DAMAGE = 60; 
        } else {
            PLAYER_SIZE = 64; 
            PLAYER_SPEED = 200;
            PLAYER_DAMAGE = 30; 
        }

        player.size = PLAYER_SIZE;
        player.speed = PLAYER_SPEED;
        player.damage = PLAYER_DAMAGE; // Cập nhật lại sát thương nếu cần
    }
}

// Cập nhật giá trị MAX_HEALTH cho các nhân vật
function updateCharacterHealth() {
    if (player.image.src.endsWith('duydau.jpg')) {
        player.health = 250; 
        PLAYER_MAX_HEALTH = 250; // Cập nhật MAX_HEALTH cho nhân vật chính
    } else if (player.image.src.endsWith('khai.jpg')) {
        player.health = 200;
        PLAYER_MAX_HEALTH = 200; // Cập nhật MAX_HEALTH cho nhân vật chính
    } else {
        player.health = PLAYER_MAX_HEALTH;
    }
}


let player = {
    x: width / 2,
    y: height / 2,
    size: PLAYER_SIZE,
    health: PLAYER_MAX_HEALTH,
    image: playerImage,
};


let enemies = [];
let touchControls = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.getElementById('attackButton').addEventListener('click', attack);

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
function attack() {
    if (gameOver) return;

    if (keyPressed === 'j') { // Kiểm tra nếu phím 'j' được nhấn
        enemies.forEach((enemy, index) => {
            // Kiểm tra va chạm với kẻ địch
            if (Math.abs(player.x - enemy.x) < PLAYER_SIZE && Math.abs(player.y - enemy.y) < PLAYER_SIZE) {
                
                // Sử dụng giá trị sát thương từ đối tượng player
                const playerDamage = player.damage || PLAYER_DAMAGE;

                // Trừ máu của kẻ địch theo sát thương
                enemy.health -= playerDamage;

                // Nếu máu của kẻ địch <= 0, xóa khỏi danh sách kẻ địch
                if (enemy.health <= 0) {
                    enemies.splice(index, 1);

                    // Cập nhật điểm số
                    score += Math.max(1, 200 / ((Date.now() - startTime) / 1000));
                }
            }
        });
    }
}

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
        case 'j':
            keyPressed = 'j'; // Cập nhật keyPressed khi phím 'j' được nhấn
            attack(); // Gọi hàm attack khi phím 'j' được nhấn
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
        case 'j':
            keyPressed = ''; // Cập nhật keyPressed khi phím 'j' được nhả
            break;
    }
});


// Update game state
function updateHealthBars() {
    const playerHealthPercent = player.health / PLAYER_MAX_HEALTH * 100;
    const enemyHealthPercent = enemies.length > 0 ? enemies[0].health / MAX_HEALTH * 100 : 0;

    document.getElementById('playerHealth').style.width = playerHealthPercent + '%';
    document.getElementById('enemyHealth').style.width = enemyHealthPercent + '%';
}

function update() {
    if (gameOver) return;

    const now = Date.now();
    const deltaTime = (now - (player.lastUpdate || now)) / 1000;
    player.lastUpdate = now;

    // Đặt lại vận tốc theo trục x và y về 0
    player.dx = 0;
    player.dy = 0;

    // Cập nhật vận tốc dựa trên trạng thái điều khiển
    if (touchControls['up']) player.dy = -PLAYER_SPEED;
    if (touchControls['down']) player.dy = PLAYER_SPEED;
    if (touchControls['left']) player.dx = -PLAYER_SPEED;
    if (touchControls['right']) player.dx = PLAYER_SPEED;

    // Cập nhật vị trí của nhân vật dựa trên vận tốc và thời gian trôi qua
    player.x += player.dx * deltaTime;
    player.y += player.dy * deltaTime;

    // Giới hạn vị trí của nhân vật trong canvas
    player.x = Math.max(0, Math.min(width - player.size, player.x));
    player.y = Math.max(0, Math.min(height - player.size, player.y));

    enemies.forEach((enemy) => {
        if (enemy.direction === 'left') enemy.x -= enemy.speed;
        if (enemy.direction === 'right') enemy.x += enemy.speed;
        if (enemy.direction === 'up') enemy.y -= enemy.speed;
        if (enemy.direction === 'down') enemy.y += enemy.speed;

        if (enemy.x < 0 || enemy.x > width - ENEMY_SIZE) enemy.direction = enemy.direction === 'left' ? 'right' : 'left';
        if (enemy.y < 0 || enemy.y > height - ENEMY_SIZE) enemy.direction = enemy.direction === 'up' ? 'down' : 'up';

        if (Math.abs(player.x - enemy.x) < PLAYER_SIZE && Math.abs(player.y - enemy.y) < PLAYER_SIZE) {
            if (now - enemy.lastDamageTime > 1000) {
                player.health -= 10;
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
        const lostHealth = PLAYER_MAX_HEALTH - player.health;
        const healAmount = 0.3 * lostHealth;
        player.health = Math.min(PLAYER_MAX_HEALTH, player.health + healAmount);
        lastAttackTime = now;
    }

    enemies.forEach((enemy) => {
        if (enemy.health <= 0) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });

    updateHealthBars(); // Cập nhật thanh máu sau mỗi lần cập nhật
}

// Vẽ thanh máu nhân vật
function drawHealthBars() {
    // Vẽ thanh máu của nhân vật chính
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y - HEALTH_BAR_HEIGHT, player.size, HEALTH_BAR_HEIGHT);

    ctx.fillStyle = 'green';
    const healthBarWidth = player.size * (player.health / PLAYER_MAX_HEALTH); // Chiều dài thanh máu
    ctx.fillRect(player.x, player.y - HEALTH_BAR_HEIGHT, healthBarWidth, HEALTH_BAR_HEIGHT);
    
    // Vẽ thanh máu của kẻ địch
    enemies.forEach((enemy) => {
        ctx.fillStyle = 'white';
        ctx.fillRect(enemy.x, enemy.y - HEALTH_BAR_HEIGHT, enemy.size, HEALTH_BAR_HEIGHT);
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y - HEALTH_BAR_HEIGHT, enemy.size * (enemy.health / MAX_HEALTH), HEALTH_BAR_HEIGHT);
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

    // Vẽ thanh máu
    drawHealthBars();

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

function resetGame() {
    score = 0;
    startTime = Date.now();
    gameOver = false;
    lastAttackTime = Date.now();

    // Gọi hàm để cập nhật các thuộc tính của player từ localStorage
    loadCharacterImages();
    updateCharacterHealth(); // Cập nhật sức khỏe của nhân vật

    // Khởi tạo lại player sau khi loadCharacterImages đã cập nhật các thuộc tính
    player = {
        x: width / 2,
        y: height / 2,
        size: PLAYER_SIZE,
        health: PLAYER_MAX_HEALTH, // Sử dụng PLAYER_MAX_HEALTH
        damage: PLAYER_DAMAGE,
        image: playerImage,
        dx: 0,
        dy: 0,
    };

    // Khởi tạo danh sách kẻ địch
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



document.getElementById('playAgainWin').addEventListener('click', function() {
    setupGame();
    document.getElementById('winScreen').style.display = 'none';
});

document.getElementById('goBackWin').addEventListener('click', function() {
    window.location.href = 'choose.html';
});

document.getElementById('playAgainLose').addEventListener('click', function() {
    setupGame();
    document.getElementById('WinScreen').style.display = 'none';
});

document.getElementById('goBackLose').addEventListener('click', function() {
    window.location.href = 'choose.html';
});
document.getElementById('playAgainWin').addEventListener('click', function() {
    location.reload(); // Làm mới trang
});

document.getElementById('playAgainLose').addEventListener('click', function() {
    location.reload(); // Làm mới trang
});