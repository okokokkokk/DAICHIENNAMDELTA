const bombImage = new Image();
bombImage.src = 'quabom.jpg';
const bombExplosionVideo = document.createElement('video');
bombExplosionVideo.src = 'bomno.gif';
bombExplosionVideo.style.display = 'none';
document.body.appendChild(bombExplosionVideo);
let bombThrown = false;
let bombX = 0;
let bombY = 0;
let bombDirection = '';
let bombSpeed = 5;
let bombExplosionPlaying = false;
let chiso = 0;

//map for ss
const mapImage = new Image()
mapImage.src = 'mapforss.jpg'
let mapThrown = false;
let mapX = 0;
let mapY = 0;
let mapDirection = '';
let mapSpeed = 5;

//loli
const loliImage = new Image()
loliImage.src = 'loli.jpg'
let loliThrown = false;
let loliX = 0;
let loliY = 0;
let loliDirection = '';
let loliSpeed = 5;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let PLAYER_SIZE = 64;
const ENEMY_SIZE = 64;
const HEALTH_BAR_HEIGHT = 10;
let PLAYER_SPEED = 200;
let PLAYER_DAMAGE = 30;
let MAX_HEALTH = 200;
let PLAYER_MAX_HEALTH = 200;

let score = 0;
let startTime = Date.now();
let gameOver = false;
let bestScore = localStorage.getItem('bestScore') || 0;

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
            PLAYER_SPEED = 380;
            PLAYER_DAMAGE = 200; 
        } else if (selectedPlayer.image === 'namdelta.jpg') {
            PLAYER_SPEED = 300; 
            PLAYER_DAMAGE = 300; 
            PLAYER_SIZE = 100;  
            chiso = 2;
        } else if (selectedPlayer.image === 'hanhbui.jpg') {
            PLAYER_SPEED = 500; 
            PLAYER_DAMAGE = 300; 
            PLAYER_SIZE = 100;  
            chiso = 1;
        } else if (selectedPlayer.image === 'duyba.jpg') {
            PLAYER_SPEED = 350; 
            PLAYER_DAMAGE = 200; 
            PLAYER_SIZE = 100;  
        } else if (selectedPlayer.image === 'dinhanh.jpg') {
            PLAYER_SPEED = 70; 
            PLAYER_DAMAGE = 50; 
            PLAYER_SIZE = 150;  
        } else if (selectedPlayer.image === 'giang.jpg') {
            PLAYER_SPEED = 400; 
            PLAYER_DAMAGE = 100; 
            PLAYER_SIZE = 64;  
        } else if (selectedPlayer.image === 'duydau.jpg') {
            PLAYER_SPEED = 350; 
            PLAYER_DAMAGE = 100; 
            PLAYER_SIZE = 80; 
        } else if (selectedPlayer.image === 'hoang.jpg') {
            PLAYER_SPEED = 300; 
            PLAYER_DAMAGE = 150; 
            PLAYER_SIZE = 70; 
        } else if (selectedPlayer.image === 'khai.jpg') {
            PLAYER_SPEED = 450;
            PLAYER_SIZE = 70; 
            PLAYER_DAMAGE = 100; 
        } else if (selectedPlayer.image === 'dong.jpg') {
            PLAYER_SPEED = 300; 
            PLAYER_DAMAGE = 100; 
            PLAYER_SIZE = 70;
        } else if (selectedPlayer.image === 'sonhanma.jpg') {
            PLAYER_SPEED = 100; 
            PLAYER_DAMAGE = 30; 
            PLAYER_SIZE = 100; 
        } else if (selectedPlayer.image === 'haico.jpg') {
            PLAYER_SPEED = 500; 
            PLAYER_DAMAGE = 60; 
        } else if (selectedPlayer.image === 'tung.jpg') {
            PLAYER_SPEED = 250; 
            PLAYER_DAMAGE = 80; 
            PLAYER_SIZE = 80;
        } else if (selectedPlayer.image === 'manh.jpg') {
            PLAYER_SPEED = 300; 
            PLAYER_DAMAGE = 60; 
            PLAYER_SIZE = 50;
        } else if (selectedPlayer.image === 'minhtrinh.jpg') {
            PLAYER_DAMAGE = 100; 
            PLAYER_SIZE = 80; 
            PLAYER_SPEED = 250;
        } else if (selectedPlayer.image === 'huyngoc.jpg') {
            PLAYER_DAMAGE = 50; 
            PLAYER_SIZE = 64; 
            PLAYER_SPEED = 230;
        } else if (selectedPlayer.image === 'vinh.jpg') {
            PLAYER_DAMAGE = 35; 
            PLAYER_SIZE = 100; 
            PLAYER_SPEED = 150;
        } else if (selectedPlayer.image === 'minhbui.jpg') {
            PLAYER_DAMAGE = 60; 
            PLAYER_SIZE = 70; 
            PLAYER_SPEED = 250;
        } else if (selectedPlayer.image === 'danghai.jpg') {
            PLAYER_DAMAGE = 60; 
            PLAYER_SIZE = 64; 
            PLAYER_SPEED = 300;
        } else if (selectedPlayer.image === 'phong.jpg') {
            PLAYER_DAMAGE = 50; 
            PLAYER_SIZE = 80; 
            PLAYER_SPEED = 300;
        } else if (selectedPlayer.image === 'dauhai.jpg') {
            PLAYER_DAMAGE = 80; 
            PLAYER_SIZE = 70; 
            PLAYER_SPEED = 250;
        } else if (selectedPlayer.image === 'cuong.jpg') {
            PLAYER_DAMAGE = 50; 
            PLAYER_SIZE = 100; 
            PLAYER_SPEED = 100;
        } else if (selectedPlayer.image === 'vanh.jpg') {
            PLAYER_DAMAGE = 50; 
            PLAYER_SIZE = 80; 
            PLAYER_SPEED = 200;
        } else if (selectedPlayer.image === 'hoan.jpg') {
            PLAYER_DAMAGE = 100; 
            chiso = 3;
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
        player.health = 300; 
        PLAYER_MAX_HEALTH = 300; 
    } else if (player.image.src.endsWith('khai.jpg')) {
        player.health = 250;
        PLAYER_MAX_HEALTH = 250; 
    }
    else if (player.image.src.endsWith('hanhbui.jpg')) {
        player.health = 500;
        PLAYER_MAX_HEALTH = 500; 
    }
    else if (player.image.src.endsWith('dinhanh.jpg')) {
        player.health = 609;
        PLAYER_MAX_HEALTH = 609; 
    }
    else if (player.image.src.endsWith('phong.jpg')) {
        player.health = 219;
        PLAYER_MAX_HEALTH = 219; 
    }
    else if (player.image.src.endsWith('hoang.jpg')) {
        player.health = 250;
        PLAYER_MAX_HEALTH = 250; 
    }
    else if (player.image.src.endsWith('duyba.jpg')) {
        player.health = 400;
        PLAYER_MAX_HEALTH = 400; 
    }
    else if (player.image.src.endsWith('haico.jpg')) {
        player.health = 300;
        PLAYER_MAX_HEALTH = 300; 
    } 
    else if (player.image.src.endsWith('hieu3lit.jpg')) {
        player.health = 380;
        PLAYER_MAX_HEALTH = 380; 
    } 
    else if (player.image.src.endsWith('namdelta.jpg')) {
        player.health = 300;
        PLAYER_MAX_HEALTH = 300; 
    }
    else if (player.image.src.endsWith('giang.jpg')) {
        player.health = 220;
        PLAYER_MAX_HEALTH = 220; 
    }  
    else if (player.image.src.endsWith('dong.jpg')) {
        player.health = 300;
        PLAYER_MAX_HEALTH = 300; 
    }
    else if (player.image.src.endsWith('minhbui.jpg')) {
        player.health = 300;
        PLAYER_MAX_HEALTH = 300; 
    } 
    else if (player.image.src.endsWith('sonhanma.jpg')) {
        player.health = 500;
        PLAYER_MAX_HEALTH = 500; 
    } 
    else if (player.image.src.endsWith('cuong.jpg')) {
        player.health = 450;
        PLAYER_MAX_HEALTH = 450; 
    } 
    else if (player.image.src.endsWith('vinh.jpg')) {
        player.health = 400;
        PLAYER_MAX_HEALTH = 400; 
    } 
    else if (player.image.src.endsWith('minhtrinh.jpg')) {
        player.health = 350;
        PLAYER_MAX_HEALTH = 350; 
    }
    else if (player.image.src.endsWith('huyngoc.jpg')) {
        player.health = 350;
        PLAYER_MAX_HEALTH = 350; 
    } 
    else if (player.image.src.endsWith('vanh.jpg')) {
        player.health = 300;
        PLAYER_MAX_HEALTH = 300; 
    } 
    else if (player.image.src.endsWith('dauhai.jpg')) {
        player.health = 250;
        PLAYER_MAX_HEALTH = 250; 
    } 
    else {
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


document.getElementById('attackButton').addEventListener('click', attack);

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
        right: document.querySelector('.control-button.right'),
        attack: document.querySelector('.control-button.attack')
    };

    Object.keys(controlButtons).forEach(direction => {
        controlButtons[direction].addEventListener('touchstart', () => {
            event.preventDefault(); // Prevent zoom
            touchControls[direction] = true;
        });
        controlButtons[direction].addEventListener('touchend', () => {
            event.preventDefault(); // Prevent zoom
            touchControls[direction] = false;
        });
    });

    controlButtons.attack.addEventListener('touchstart', () => {
        event.preventDefault(); // Prevent zoom
        attack();
    });
}

let touchControls = {
    up: false,
    down: false,
    left: false,
    right: false,
};

let keyPressed = ''; // Khai báo biến keyPressed ở cấp toàn cục

// Hàm tấn công
function attack() {
    if (gameOver) return;

    // Kiểm tra nếu phím 'j' được nhấn hoặc nút tấn công được nhấn
    if (keyPressed === 'j') {
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
                    score += Math.round(Math.max(1, 200 / ((Date.now() - startTime) / 1000)));
                }
            }
        });
    }
}

document.getElementById('attackButton').addEventListener('click', () => {
    keyPressed = 'j'; // Cập nhật keyPressed khi nút tấn công được nhấn
    attack(); // Gọi hàm attack khi nút tấn công được nhấn
    keyPressed = ''; // Đặt lại keyPressed sau khi tấn công
});

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
        case 'u':
            throwBomb()
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

document.getElementById('SkillButton').addEventListener('click', throwBomb);


//hồi máu
// Biến để lưu trữ thời gian hồi chiêu
let healCooldown = 0;

// Add event listener to the button with id "HealthButton"
document.getElementById('HealthButton').addEventListener('click', healPlayer);

// Add event listener to the "o" key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'o') {
    healPlayer();
  }
});

document.getElementById('HealthButton').addEventListener('touchstart', (event) => {
    event.preventDefault();
    event.stopPropagation();
    healPlayer();
  });
  
  document.getElementById('SkillButton').addEventListener('touchstart', (event) => {
    event.preventDefault();
    event.stopPropagation();
    throwBomb();
  });

// Function to heal the player
function healPlayer() {
  // Kiểm tra thời gian hồi chiêu
  if (healCooldown <= 0) {
    if (player.health < PLAYER_MAX_HEALTH) {
      player.health = Math.min(PLAYER_MAX_HEALTH, player.health + 100);
      updateHealthBars(); // Update the health bars
    }
    // Thiết lập thời gian hồi chiêu
    healCooldown = 3000; // 3 giây
    setTimeout(() => {
      healCooldown = 0;
    }, healCooldown);
  } else {
    console.log("Đang hồi chiêu...");
  }
}
// hàm ném bom
function throwBomb() {
    if (chiso === 2 && !bombThrown) {
      bombThrown = true;
      bombX = player.x;
      bombY = player.y;
      bombDirection = touchControls['left'] ? 'left' : 'right';
    } else if (chiso === 1 && !mapThrown) {
      mapThrown = true;
      mapX = player.x;
      mapY = player.y;
      mapDirection = touchControls['left'] ? 'left' : 'right';
    } else if (chiso === 3 && !loliThrown) {
      loliThrown = true;
      loliX = player.x;
      loliY = player.y;
      loliDirection = touchControls['left'] ? 'left' : 'right';
    }
}
// Update game state
function updateHealthBars() {
    const playerHealthPercent = player.health / PLAYER_MAX_HEALTH * 100;
    const enemyHealthPercent = enemies.length > 0 ? enemies[0].health / MAX_HEALTH * 100 : 0;

    document.getElementById('playerHealth').style.width = playerHealthPercent + '%';
    document.getElementById('enemyHealth').style.width = enemyHealthPercent + '%';
}

function update() {
    if (gameOver) return;

    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('scoreboard').innerText = `Score: ${Math.round(score)} | Best Score: ${bestScore} | Time: ${currentTime}s`;
    
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

    // Cập nhật vị trí của quả bom
    if (bombThrown) {
        if (bombDirection === 'left') {
            bombX -= bombSpeed;
        } else {
            bombX += bombSpeed;
        }

        // Kiểm tra va chạm giữa quả bom và kẻ địch
        enemies.forEach((enemy, index) => {
            if (Math.abs(bombX - enemy.x) < ENEMY_SIZE && Math.abs(bombY - enemy.y) < ENEMY_SIZE) {
                bombThrown = false;
                enemies.splice(index, 2);
                score += 1000;
    
                // Tạo một phần tử img mới cho hiệu ứng nổ
                const explosionImg = document.createElement('img');
                explosionImg.src = 'bomno.gif';
                explosionImg.style.position = 'absolute';
                explosionImg.style.left = (bombX - PLAYER_SIZE) + 'px';
                explosionImg.style.top = (bombY - PLAYER_SIZE) + 'px';
                explosionImg.style.width = (PLAYER_SIZE * 3) + 'px';
                explosionImg.style.height = (PLAYER_SIZE * 3) + 'px';
                document.body.appendChild(explosionImg);
    
                // Xóa hình ảnh hiệu ứng nổ sau một khoảng thời gian nhất định
                setTimeout(function() {
                    document.body.removeChild(explosionImg);
                }, 800); // Thời gian hiển thị hiệu ứng nổ (ms)
            }
        });
    

        // Kiểm tra nếu quả bom đã đi quá 200px
        if (Math.abs(bombX - player.x) > 500) {
            bombThrown = false;
        }
    }
    // Cập nhật vị trí của "mapforss.jpg"
    if (mapThrown) {
        if (mapDirection === 'left') {
            mapX -= mapSpeed;
        } else {
            mapX += mapSpeed;
        }

        // Kiểm tra va chạm giữa "mapforss.jpg" và kẻ địch
        enemies.forEach((enemy, index) => {
            if (Math.abs(mapX - enemy.x) < ENEMY_SIZE && Math.abs(mapY - enemy.y) < ENEMY_SIZE) {
                mapThrown = false;
                enemies.splice(index, 2);
                score += 1000;

                // Tạo một phần tử img mới cho hiệu ứng nổ
                const explosionImg = document.createElement('img');
                explosionImg.src = 'bomno.gif';
                explosionImg.style.position = 'absolute';
                explosionImg.style.left = (mapX - PLAYER_SIZE) + 'px';
                explosionImg.style.top = (mapY - PLAYER_SIZE) + 'px';
                explosionImg.style.width = (PLAYER_SIZE * 3) + 'px';
                explosionImg.style.height = (PLAYER_SIZE * 3) + 'px';
                document.body.appendChild(explosionImg);

                // Xóa hình ảnh hiệu ứng nổ sau một khoảng thời gian nhất định
                setTimeout(function() {
                    document.body.removeChild(explosionImg);
                }, 800); // Thời gian hiển thị hiệu ứng nổ (ms)
            }
        });

        // Kiểm tra nếu "mapforss.jpg" đã đi quá 200px
        if (Math.abs(mapX - player.x) > 500) {
            mapThrown = false;
        }
    }

    // Cập nhật vị trí của "loli.jpg"
    if (loliThrown) {
        if (loliDirection === 'left') {
            loliX -= loliSpeed;
        } else {
            loliX += loliSpeed;
        }

        enemies.forEach((enemy, index) => {
            if (Math.abs(loliX - enemy.x) < ENEMY_SIZE && Math.abs(loliY - enemy.y) < ENEMY_SIZE) {
                loliThrown = false;
                enemies.splice(index, 1);
                score += 500;

                // Tạo một phần tử img mới cho hiệu ứng nổ
                const explosionImg = document.createElement('img');
                explosionImg.src = 'bomno.gif';
                explosionImg.style.position = 'absolute';
                explosionImg.style.left = (loliX - PLAYER_SIZE) + 'px';
                explosionImg.style.top = (loliY - PLAYER_SIZE) + 'px';
                explosionImg.style.width = (PLAYER_SIZE * 3) + 'px';
                explosionImg.style.height = (PLAYER_SIZE * 3) + 'px';
                document.body.appendChild(explosionImg);

                // Xóa hình ảnh hiệu ứng nổ sau một khoảng thời gian nhất định
                setTimeout(function() {
                    document.body.removeChild(explosionImg);
                }, 800); // Thời gian hiển thị hiệu ứng nổ (ms)
            }
        });

        if (Math.abs(loliX - player.x) > 500) {
            loliThrown = false;
        }
    }
    enemies.forEach((enemy) => {
        if (enemy.direction === 'left') enemy.x -= enemy.speed;
        if (enemy.direction === 'right') enemy.x += enemy.speed;
        if (enemy.direction === 'up') enemy.y -= enemy.speed;
        if (enemy.direction === 'down') enemy.y += enemy.speed;

        if (enemy.x < 0 || enemy.x > width - ENEMY_SIZE) enemy.direction = enemy.direction === 'left' ? 'right' : 'left';
        if (enemy.y < 0 || enemy.y > height - ENEMY_SIZE) enemy.direction = enemy.direction === 'up' ? 'down' : 'up';

        if (Math.abs(player.x - enemy.x) < PLAYER_SIZE && Math.abs(player.y - enemy.y) < PLAYER_SIZE) {
            if (now - enemy.lastDamageTime > 1000) {
                player.health -= 15;
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

// Cập nhật điểm số và best score khi kết thúc trò chơi
function endGame(isWin) {
    gameOver = true;
    const currentTime = Math.floor((Date.now() - startTime) / 1000);

    // Nếu người chơi thắng
    if (isWin) {
        document.getElementById('winScreen').style.display = 'block';
    } else {
        document.getElementById('gameOverScreen').style.display = 'block';
    }

    // Cập nhật best score nếu điểm số hiện tại cao hơn best score
    if (score > bestScore) {
        bestScore = score; // Cập nhật best score
        localStorage.setItem('bestScore', bestScore); // Lưu vào localStorage
    }

    document.getElementById('scoreboard').innerText = `Score: ${Math.round(score)} | Best Score: ${bestScore} | Time: ${currentTime}s`;
}


// Gọi hàm endGame khi thắng hoặc thua:
function checkGameOver() {
    if (player.health <= 0) {
        endGame(false); // Game over
    }
    if (enemies.length === 0) {
        endGame(true); // Player wins
    }
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
    
    // Vẽ quả bom
    if (bombThrown) {
        ctx.drawImage(bombImage, bombX, bombY, PLAYER_SIZE, PLAYER_SIZE);
    }
    // Vẽ "mapforss.jpg"
    if (mapThrown) {
        ctx.drawImage(mapImage, mapX, mapY, PLAYER_SIZE, PLAYER_SIZE);
    }
    //vẽ loli
    if (loliThrown) {
        ctx.drawImage(loliImage, loliX, loliY, PLAYER_SIZE, PLAYER_SIZE);
    }

    // Hiển thị hiệu ứng nổ
    if (bombExplosionPlaying) {
        ctx.drawImage(bombExplosionVideo, bombExplosionX, bombExplosionY, PLAYER_SIZE, PLAYER_SIZE);
        if (bombExplosionVideo.ended) {
            bombExplosionPlaying = false;
        }
    }
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
    checkGameOver(); // Kiểm tra kết thúc trò chơi sau mỗi lần cập nhật
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

document.getElementById('playAgainWin').addEventListener('click', resetGame);
document.getElementById('playAgainLose').addEventListener('click', resetGame);
document.getElementById('goBackWin').addEventListener('click', () => window.location.href = 'choose.html');
document.getElementById('goBackLose').addEventListener('click', () => window.location.href = 'choose.html');


function resetGame() {
    score = 0;
    startTime = Date.now();
    gameOver = false;
    lastAttackTime = Date.now();

    // Gọi hàm để cập nhật các thuộc tính của player từ localStorage
    loadCharacterImages();
    updateCharacterHealth(); // Cập nhật sức khỏe của nhân vật
    
    bombThrown = false;
    bombX = 0;
    bombY = 0;
    bombDirection = '';

    // Đặt lại trạng thái của "mapforss.jpg"
    mapThrown = false;
    mapX = 0;
    mapY = 0;
    mapDirection = '';

    loliThrown = false;
    loliX = 0;
    loliY = 0;
    loliDirection = '';
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
    for (let i = 0; i < 20; i++) {
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