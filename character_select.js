const playerCharacters = [
    { id: 'player1', name: 'Khổn Lài', image: 'khai.jpg', },
    { id: 'player2', name: 'Duy Đậu', image: 'duydau.jpg' },
    { id: 'player3', name: 'Mạnh Strong', image: 'manh.jpg' },
    { id: 'player4', name: 'Sơn Hà Mã', image: 'sonhanma.jpg' },
    { id: 'player5', name: 'Vinh Surprise', image: 'vinh.jpg' },
    { id: 'player6', name: 'Hoan Gay', image: 'hoan.jpg' },
    { id: 'player7', name: 'Hiếu Dubai', image: 'hieu3lit.jpg' },
    { id: 'player8', name: 'Thầy Cường', image: 'cuong.jpg' },
    { id: 'player9', name: 'Đẳng Hai', image: 'danghai.jpg' },
    { id: 'player10', name: 'Dương Đăng', image: 'dang.jpg' },
    { id: 'player11', name: 'Xôn Luần', image: 'xuan.jpg' },
    { id: 'player12', name: 'Nho Đại', image: 'nhodai.jpg' },
    { id: 'player13', name: 'Đông Đông', image: 'dong.jpg' },
    { id: 'player14', name: 'Đầu Hải', image: 'dauhai.jpg' },
    { id: 'player15', name: 'Giang Gay', image: 'giang.jpg' },
    { id: 'player16', name: 'Tùng Điếc', image: 'tung.jpg' },
    { id: 'player17', name: 'Việt Anh', image: 'vanh.jpg' },
    { id: 'player18', name: 'Nam Nổ', image: 'namdelta.jpg' },
    { id: 'player19', name: 'Cọn Thiên', image: 'namdao.jpg' },
    { id: 'player20', name: 'Hải Cọ', image: 'haico.jpg' },
    // Thêm các nhân vật chính khác ở đây
];

const enemyCharacters = [
    { id: 'enemy1', name: 'Nam Delta', image: 'namdelta.jpg' },
    { id: 'enemy2', name: 'Nam Đao', image: 'namdao.jpg' },
    { id: 'enemy3', name: 'Vinh Bất Ngờ', image: 'vinh.jpg' },
    { id: 'enemy4', name: 'Hoàn Seg', image: 'hoan.jpg' },
    { id: 'enemy5', name: 'Khải Lol', image: 'khai.jpg' },
    { id: 'enemy6', name: 'Mạnh Weak', image: 'manh.jpg' },
    { id: 'enemy7', name: 'Hiếu 3 lít', image: 'hieu3lit.jpg' },
    { id: 'enemy8', name: 'Thầy Cường', image: 'cuong.jpg' },
    { id: 'enemy9', name: 'Đăng Vâu', image: 'danghai.jpg' },
    { id: 'enemy10', name: 'Mồm Lông', image: 'dang.jpg' },
    { id: 'enemy11', name: 'Spring', image: 'xuan.jpg' },
    { id: 'enemy12', name: 'Đại Nho', image: 'nhodai.jpg' },
    { id: 'enemy13', name: 'Đôn Chề', image: 'dong.jpg' },
    { id: 'enemy14', name: 'Đầu To Hải', image: 'dauhai.jpg' },
    { id: 'enemy15', name: 'Giang XD', image: 'giang.jpg' },
    { id: 'enemy16', name: 'Tùng Dick', image: 'tung.jpg' },
    { id: 'enemy17', name: 'Vanh', image: 'vanh.jpg' },
    { id: 'enemy18', name: 'Duy Dâu', image: 'duydau.jpg' },
    { id: 'enemy19', name: 'Sơn Hanma', image: 'sonhanma.jpg' },
    { id: 'enemy20', name: 'Hải Sắp Cọ', image: 'haico.jpg' },
    // Thêm các đối thủ khác ở đây
];

let selectedPlayer = null;
let selectedEnemy = null;

function createCharacterElements(characters, containerId, characterType) {
    const container = document.getElementById(containerId);
    characters.forEach(character => {
        const characterElement = document.createElement('div');
        characterElement.classList.add('character');
        characterElement.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <div class="character-name">${character.name}</div>
        `;
        characterElement.addEventListener('click', () => selectCharacter(character, characterType));
        container.appendChild(characterElement);
    });
}

function selectCharacter(character, characterType) {
    const containers = {
        player: document.getElementById('playerCharacters'),
        enemy: document.getElementById('enemyCharacters')
    };

    containers[characterType].querySelectorAll('.character').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    if (characterType === 'player') {
        selectedPlayer = character;
    } else {
        selectedEnemy = character;
    }
}

function startGame() {
    if (selectedPlayer && selectedEnemy) {
        localStorage.setItem('selectedPlayer', JSON.stringify(selectedPlayer));
        localStorage.setItem('selectedEnemy', JSON.stringify(selectedEnemy));
        window.location.href = 'game.html'; // Chuyển đến trang trò chơi chính
    } else {
        alert('Vui lòng chọn cả nhân vật chính và đối thủ trước khi bắt đầu.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createCharacterElements(playerCharacters, 'playerCharacters', 'player');
    createCharacterElements(enemyCharacters, 'enemyCharacters', 'enemy');

    document.getElementById('startGame').addEventListener('click', startGame);

    document.getElementById('Quaylai').addEventListener('click', () => {
        window.location.href = 'index.html'; // Chuyển hướng về trang index.html
    });
});