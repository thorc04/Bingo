const previousNumbersDisplay = document.getElementById('previousNumbers');
const autoPlayButton = document.getElementById('autoPlay');
const currentNumberDisplay = document.getElementById('currentNumber');
const callButton = document.getElementById('callNumber');
const numbersCalled = document.getElementById('numbersCalled');
const settingsIcon = document.getElementById('settingsIcon');
const settingsModal = document.getElementById('settingsModal');
const closeBtn = document.querySelector('.close');
const saveSettingsBtn = document.getElementById('saveSettings');
const resetSettingsBtn = document.getElementById('resetSettings');
let lastdrawnNumber = undefined;

const TEMPLATES = {
    default: {
        headerColor: '#000000',
        headerTitle: 'BINGO',
        logoUrl: 'Bingo.png',
        autoDrawTime: 3,
        totalNumbers: 75
    },
    duborg: {
        headerColor: '#ff4b4b',
        headerTitle: 'Duborg Bingo Aften',
        logoUrl: 'logo1.png',
        autoDrawTime: 3,
        totalNumbers: 90
    }
};

const DEFAULT_SETTINGS = TEMPLATES.default;
let settings = JSON.parse(localStorage.getItem('bingoSettings')) || DEFAULT_SETTINGS;
let previousNumbers = JSON.parse(localStorage.getItem('previousNumbers')) || [];
let numbers = JSON.parse(localStorage.getItem('numbers')) || [];
let autoPlayInterval = null;

if (numbers.length === 0) {
    initializeNumbers();
}

function initializeNumbers() {
    numbers = Array.from({length: settings.totalNumbers}, (_, i) => i + 1);
    shuffle(numbers);
    previousNumbers = [];
    updateUI();
    saveState();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function drawNumber() {
    if (numbers.length > 0) {
        playDrawSound();
        const nextNumber = numbers.pop();
        lastdrawnNumber = nextNumber;
        previousNumbers.push(nextNumber);
        previousNumbers.sort((a, b) => a - b);
        updateUI();
        saveState();
        
        if (numbers.length === 0) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            autoPlayButton.innerHTML = '<i class="fas fa-play"></i> Auto Play';
        }
    }
}

function updateUI() {
    currentNumberDisplay.textContent = lastdrawnNumber || 'Press Draw';
    if (numbers.length === 0) {
        currentNumberDisplay.textContent = 'Game Over!';
    }
    
    numbersCalled.textContent = previousNumbers.length;
    document.getElementById('totalNumbersDisplay').textContent = settings.totalNumbers;
    
    previousNumbersDisplay.innerHTML = '';
    previousNumbers.forEach(number => {
        const numberSpan = document.createElement('span');
        numberSpan.textContent = number;
        numberSpan.classList.add('previous-number');
        previousNumbersDisplay.appendChild(numberSpan);
    });
}

function toggleAutoPlay() {
    if (numbers.length === 0) {
        alert('No more numbers to draw!');
        return;
    }

    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        autoPlayButton.innerHTML = '<i class="fas fa-play"></i> Auto Play';
    } else {
        drawNumber();
        autoPlayInterval = setInterval(drawNumber, settings.autoDrawTime * 1000);
        autoPlayButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
}

function resetGame() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    autoPlayButton.innerHTML = '<i class="fas fa-play"></i> Auto Play';
    initializeNumbers();
}

function saveState() {
    localStorage.setItem('numbers', JSON.stringify(numbers));
    localStorage.setItem('previousNumbers', JSON.stringify(previousNumbers));
}

function playDrawSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
    audio.play();
}

function loadSettings() {
    const currentTemplate = settings.headerTitle === TEMPLATES.duborg.headerTitle ? 'duborg' : 'default';
    document.getElementById('templateSelect').value = currentTemplate;
    document.getElementById('headerColor').value = settings.headerColor;
    document.getElementById('headerTitle').value = settings.headerTitle;
    document.getElementById('autoDrawTime').value = settings.autoDrawTime;
    document.getElementById('totalNumbers').value = settings.totalNumbers;
    document.getElementById('logoUpload').value = '';
    document.getElementById('logoUrl').value = '';
    document.getElementById('currentLogoPath').textContent = settings.logoUrl;
    applySettings();
}

function saveSettings() {
    settings.headerColor = document.getElementById('headerColor').value;
    settings.headerTitle = document.getElementById('headerTitle').value;
    settings.autoDrawTime = parseInt(document.getElementById('autoDrawTime').value);
    settings.totalNumbers = parseInt(document.getElementById('totalNumbers').value);
    
    const logoUrlInput = document.getElementById('logoUrl').value;
    const logoUpload = document.getElementById('logoUpload').files[0];
    
    if (logoUpload) {
        const reader = new FileReader();
        reader.onload = function(e) {
            settings.logoUrl = e.target.result;
            saveSettingsToStorage();
        };
        reader.readAsDataURL(logoUpload);
    } else if (logoUrlInput) {
        settings.logoUrl = logoUrlInput;
        saveSettingsToStorage();
    } else {
        saveSettingsToStorage();
    }
}

function saveSettingsToStorage() {
    localStorage.setItem('bingoSettings', JSON.stringify(settings));
    applySettings();
    settingsModal.style.display = "none";
    initializeNumbers();
}

function resetSettings() {
    settings = {...DEFAULT_SETTINGS};
    localStorage.setItem('bingoSettings', JSON.stringify(settings));
    loadSettings();
    initializeNumbers();
}

function applySettings() {
    document.querySelector('.header').style.background = 
        `linear-gradient(to right, ${settings.headerColor}, ${adjustColor(settings.headerColor, -30)})`;
    document.querySelector('#headerTitleDisplay').textContent = settings.headerTitle;
    document.getElementById('logo').src = settings.logoUrl;
    document.getElementById('totalNumbersDisplay').textContent = settings.totalNumbers;
}

function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2));
}

document.getElementById('templateSelect').addEventListener('change', function(e) {
    settings = {...TEMPLATES[e.target.value]};
    loadSettings();
});

settingsIcon.addEventListener('click', () => {
    settingsModal.style.display = "block";
    loadSettings();
});

closeBtn.addEventListener('click', () => {
    settingsModal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target == settingsModal) {
        settingsModal.style.display = "none";
    }
});

document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
        e.preventDefault();
    }
    if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
        e.preventDefault();
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
});

let devToolsTimer;
const devToolsCheck = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
        document.body.innerHTML = 'DevTools detected!';
        clearInterval(devToolsTimer);
    }
};

devToolsTimer = setInterval(devToolsCheck, 1000);

saveSettingsBtn.addEventListener('click', saveSettings);
resetSettingsBtn.addEventListener('click', resetSettings);
callButton.addEventListener('click', drawNumber);
autoPlayButton.addEventListener('click', toggleAutoPlay);
document.getElementById('resetGame').addEventListener('click', resetGame);

applySettings();
updateUI();