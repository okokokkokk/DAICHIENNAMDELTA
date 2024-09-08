const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PLAYER_SIZE = 64;
const ENEMY_SIZE = 64;
const HEALTH_BAR_HEIGHT = 10;
const PLAYER_SPEED = 200;
const MAX_HEALTH = 200;

let player1 = {
    x: 50,
    y: canvas.height / 2 - PLAYER_SIZE / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    health: MAX_HEALTH,
    maxHealth : MAX_HEALTH,
    damage: 0,
    size: PLAYER_SIZE,
    speed: PLAYER_SPEED,
    color: 'green',
    move: { up: false, down: false, left: false, right: false },
    attack: false,
    image: new Image()
};

let player2 = {
    x: canvas.width - 50 - PLAYER_SIZE,
    y: canvas.height / 2 - PLAYER_SIZE / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    health: MAX_HEALTH,
    maxHealth : MAX_HEALTH,
    damage: 0,
    size: PLAYER_SIZE,
    speed: PLAYER_SPEED,
    color: 'blue',
    move: { up: false, down: false, left: false, right: false },
    attack: false,
    image: new Image()
};

function loadCharacterImages() {
    const selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer'));
    const selectedEnemy = JSON.parse(localStorage.getItem('selectedEnemy'));

    if (selectedPlayer && selectedEnemy) {
        player1.image.src = selectedPlayer.image;
        player2.image.src = selectedEnemy.image;

        // Cập nhật chỉ số cho player1
        if (selectedPlayer.image === 'hieu3lit.jpg') {
            player1.damage = 200;
            player1.defense = 50;
            player1.health = 380;
            player1.maxHealth = 380;
            player1.speed = 380;
        }
        else if (selectedPlayer.image === 'namdelta.jpg') {
            player1.damage = 300;
            player1.defense = 30;
            player1.health = 300;
            player1.maxHealth = 300;
            player1.speed = 300;
        }
        else {
            player1.damage = 30;
            player1.defense = 10;
            player1.health = 200;
            player1.maxHealth = 200;
            player1.size = 64;
            player1.speed = 200;
        }

        // Cập nhật chỉ số cho player2
        if (selectedEnemy.image === 'hieu3lit.jpg') {
            player2.damage = 200;
            player2.defense = 50;
            player2.health = 380;
            player2.maxHealth = 380;
            player2.speed = 380;
        } else {
            player2.damage = 30;
            player2.defense = 10;
            player2.health = 200;
            player2.maxHealth = 200;
            player2.size = 64;
            player2.speed = 200;
        }
    }
}

let enemies = [];
let gameOver = false;

function setupGame() {
    enemies = [];
    gameOver = false;

    // Reset các thuộc tính khác nếu cần
    player1.x = 50;
    player1.y = canvas.height / 2 - PLAYER_SIZE / 2;
    player1.move = { up: false, down: false, left: false, right: false }; // Reset move

    player2.x = canvas.width - 50 - PLAYER_SIZE;
    player2.y = canvas.height / 2 - PLAYER_SIZE / 2;
    player2.move = { up: false, down: false, left: false, right: false }; // Reset move

    sword1Image = document.getElementById('sword1Image');
    sword2Image = document.getElementById('sword2Image');

    // Hiển thị lại canvas và ẩn các màn hình kết thúc trò chơi
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';
    loadCharacterImages();
}

function drawHealthBar(x, y, health, maxHealth, size) {
    const healthBarHeight = 10;
    const healthBarWidth = size;

    // Vẽ nền thanh máu
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y - healthBarHeight, healthBarWidth, healthBarHeight);

    // Tính toán chiều dài thanh máu dựa trên tỷ lệ health/maxHealth
    const fillWidth = (health / maxHealth) * healthBarWidth;

    // Vẽ thanh máu
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y - healthBarHeight, fillWidth, healthBarHeight);
}

function drawPlayer(player, swordImageLeft, swordImageRight, isLeft) {
    // Vẽ nhân vật
    ctx.drawImage(player.image, player.x, player.y, player.size, player.size);

    // Vẽ thanh máu của nhân vật
    drawHealthBar(player.x, player.y, player.health, player.maxHealth, player.size);

    // Xác định kiếm dựa trên hướng di chuyển
    let swordImage;
    let swordX, swordY;

    if (player === player2) {
        // Nhân vật 2: kiếm bên trái khi di chuyển trái, kiếm bên phải khi di chuyển phải
        swordImage = player.move.right ? swordImageRight : swordImageLeft;
    } else {
        swordImage = player.move.left ? swordImageLeft : swordImageRight;
        // Nhân vật 1: kiếm bên phải khi di chuyển phải, kiếm bên trái khi di chuyển trái
    }

    // Xác định vị trí của thanh kiếm
    if (player === player2) {
        swordX = player.x + (player.move.right ? player.width - 20 : -30);
        // Nhân vật 2 cầm kiếm bên trái khi di chuyển trái và bên phải khi di chuyển phải
    } else {
        swordX = player.x + (player.move.left ? -30 : player.width - 20);
        // Nhân vật 1 cầm kiếm bên phải khi di chuyển phải và bên trái khi di chuyển trái
    }

    swordY = player.y + (player.height / 2 - 15); // Vị trí tay cầm kiếm (có thể điều chỉnh theo hình ảnh nhân vật)

    ctx.drawImage(swordImage, swordX, swordY, 50, 50); // Điều chỉnh kích thước kiếm theo nhu cầu

}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Vẽ kẻ thù
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.size, enemy.size);

        // Vẽ thanh máu của kẻ thù
        drawHealthBar(enemy.x, enemy.y, enemy.health, enemy.maxHealth, enemy.size);
    });
}

function movePlayer(player) {
    const deltaX = player.speed * (1 / 60);
    const deltaY = player.speed * (1 / 60);

    if (player.move.up) player.y -= deltaY;
    if (player.move.down) player.y += deltaY;
    if (player.move.left) player.x -= deltaX;
    if (player.move.right) player.x += deltaX;

    // Giới hạn di chuyển của người chơi
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
}

// Hàm kiểm tra va chạm
function isColliding(p1, p2) {
    return !(p1.x + p1.width < p2.x || 
            p1.x > p2.x + p2.width || 
            p1.y + p1.height < p2.y || 
            p1.y > p2.y + p2.height);
}

function movePlayerWithCollisionCheck(player) {
    const deltaX = player.speed * (1 / 60);
    const deltaY = player.speed * (1 / 60);

    let moveX = 0;
    let moveY = 0;

    if (player.move.up) moveY -= deltaY;
    if (player.move.down) moveY += deltaY;
    if (player.move.left) moveX -= deltaX;
    if (player.move.right) moveX += deltaX;

    console.log(`Player ${player === player1 ? '1' : '2'} - moveX: ${moveX}, moveY: ${moveY}`);
    
    // Kiểm tra va chạm trước khi cập nhật vị trí
    const canMoveX = canMove(player, moveX, 0);
    const canMoveY = canMove(player, 0, moveY);

    if (canMoveX && canMoveY) {
        player.x += moveX;
        player.y += moveY;
    } else if (canMoveX) {
        player.x += moveX;
    } else if (canMoveY) {
        player.y += moveY;
    }
}


function canMove(player, deltaX, deltaY) {
    const newX = player.x + deltaX;
    const newY = player.y + deltaY;

    // Tạo một đối tượng tạm thời để kiểm tra va chạm
    const tempPlayer = {
        ...player,
        x: newX,
        y: newY
    };

    // Kiểm tra va chạm với người chơi còn lại
    const otherPlayer = (player === player1) ? player2 : player1;
    if (isColliding(tempPlayer, otherPlayer)) {
        return false; // Không thể di chuyển vì có va chạm
    }

    // Kiểm tra giới hạn di chuyển của người chơi
    if (newX < 0 || newX > canvas.width - player.width || newY < 0 || newY > canvas.height - player.height) {
        return false; // Không thể di chuyển ra ngoài canvas
    }

    // Kiểm tra xem player có thể di chuyển lên phía trên hay không
    if (deltaY < 0 && newY < 0) {
        return false; // Không thể di chuyển lên phía trên nếu vị trí mới là âm
    }

    return true; // Có thể di chuyển
}

function attackPlayer(attacker, defender) {
    const attackRange = 70; // Giảm phạm vi tấn công xuống 1px
    const knockbackDistance = 10; // Khoảng cách lùi lại khi bị tấn công

    if (attacker.attack) {
        const inRange = (Math.abs(attacker.x - defender.x) <= attackRange && Math.abs(attacker.y - defender.y) <= attackRange);
        
        if (inRange) {
            // Tính toán đẩy lùi dựa trên hướng tấn công
            const dx = defender.x - attacker.x;
            const dy = defender.y - attacker.y;
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            
            // Tính toán sát thương dựa trên phòng thủ của defender
            const absorbedDamage = (defender.defense / 100) * attacker.damage;
            const actualDamage = attacker.damage - absorbedDamage;
            defender.health -= actualDamage;
            
            if (magnitude > 0) {
                // Tính toán hướng đẩy lùi
                const knockbackX = (dx / magnitude) * knockbackDistance;
                const knockbackY = (dy / magnitude) * knockbackDistance;

                // Đẩy lùi defender
                defender.x += knockbackX;
                defender.y += knockbackY;

                // Đảm bảo defender không ra ngoài khung màn hình
                defender.x = Math.max(0, Math.min(canvas.width - defender.width, defender.x));
                defender.y = Math.max(0, Math.min(canvas.height - defender.height, defender.y));

                // Đẩy lùi attacker (nếu muốn, có thể thêm điều kiện hoặc loại bỏ)
                attacker.x -= knockbackX;
                attacker.y -= knockbackY;

                // Đảm bảo attacker không ra ngoài khung màn hình
                attacker.x = Math.max(0, Math.min(canvas.width - attacker.width, attacker.x));
                attacker.y = Math.max(0, Math.min(canvas.height - attacker.height, attacker.y));
            }

            // Kiểm tra nếu defender bị tiêu diệt
            if (defender.health <= 0) {
                defender.health = 0;
                if (attacker === player1) {
                    enemies = enemies.filter(enemy => enemy !== defender);
                    if (enemies.length === 0) {
                        showWinScreen('player1');
                    }
                } else {
                    player1.health = 0;
                    showGameOverScreen('player2');
                }
            }
        }
    }
}


function handleKeydown(event) {
    switch (event.key) {
        case 'w': player1.move.up = true; break;
        case 's': player1.move.down = true; break;
        case 'a': player1.move.left = true; break;
        case 'd': player1.move.right = true; break;
        case ' ': player1.attack = true; break;
        case 'ArrowUp': player2.move.up = true; break;
        case 'ArrowDown': player2.move.down = true; break;
        case 'ArrowLeft': player2.move.left = true; break;
        case 'ArrowRight': player2.move.right = true; break;
        case 'Enter': player2.attack = true; break;
    }
}

function handleKeyup(event) {
    switch (event.key) {
        case 'w': player1.move.up = false; break;
        case 's': player1.move.down = false; break;
        case 'a': player1.move.left = false; break;
        case 'd': player1.move.right = false; break;
        case ' ': player1.attack = false; break;
        case 'ArrowUp': player2.move.up = false; break;
        case 'ArrowDown': player2.move.down = false; break;
        case 'ArrowLeft': player2.move.left = false; break;
        case 'ArrowRight': player2.move.right = false; break;
        case 'Enter': player2.attack = false; break;
    }
}

function showGameOverScreen(winner) {
    gameOver = true;
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'block';
    // In ra tên nhân vật chiến thắng ở trên cùng
    document.querySelector('.win-screen .message-container').innerText = `Người chơi thứ hai (player 2) đã dành chiến thắng!`;
}

function showWinScreen(winner) {
    gameOver = true;
    document.getElementById('winScreen').style.display = 'block';
    document.getElementById('gameOverScreen').style.display = 'none';
    // In ra tên nhân vật chiến thắng ở trên cùng
    document.querySelector('.win-screen .message-container').innerText = `Người chơi thứ nhất (player 1) đã dành chiến thắng!`;
}

function update() {
    if (gameOver) return;

    movePlayerWithCollisionCheck(player1);
    movePlayerWithCollisionCheck(player2);

    attackPlayer(player1, player2);
    attackPlayer(player2, player1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(player1, sword1Image, sword2Image, true);
    drawPlayer(player2, sword1Image, sword2Image, false);

    drawEnemies();
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

document.getElementById('playAgainWin').addEventListener('click', () => {
    setupGame();
});

document.getElementById('goBackWin').addEventListener('click', () => {
    window.location.href = 'doikhang.html';
});

document.getElementById('playAgainLose').addEventListener('click', () => {
    setupGame();
});

document.getElementById('goBackLose').addEventListener('click', () => {
    window.location.href = 'doikhang.html';
});

// Khởi động trò chơi
loadCharacterImages();
setupGame();
gameLoop();