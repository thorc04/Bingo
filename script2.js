const previousNumbersDisplay = document.getElementById('previousNumbers'); 
const currentNumberDisplay = document.getElementById('currentNumber');
const callButton = document.getElementById('callNumber');
const resetButton = document.getElementById('resetGame');
const bingoBoard = document.getElementById('bingoBoard');

let calledNumbers = []; 
let boardNumbers = [];

function generateBoardNumbers() {
  boardNumbers = [];
  for (let i = 1; i <= 90; i++) { 
    boardNumbers.push(i);
  }
  boardNumbers.sort((a, b) => a - b);
}

function renderBoard() {
  bingoBoard.innerHTML = ''; 
  for (let num of boardNumbers) {
    let cell = document.createElement('div');
    cell.textContent = num;
    cell.classList.add('border', 'border-gray-300', 'text-center', 'p-2', 'hover:bg-indigo-100', 'cursor-pointer');
    cell.addEventListener('click', () => markNumber(cell, num));
    bingoBoard.appendChild(cell);
  }
}

function callNumber() {
    if (calledNumbers.length >= 90) {
      currentNumberDisplay.textContent = 'Game Over! ';
      return;
    }

  let newNumber;
  do {
    newNumber = Math.floor(Math.random() * 90) + 1;
  } while (calledNumbers.includes(newNumber))

  calledNumbers.push(newNumber);
  currentNumberDisplay.textContent = newNumber;

  let cells = bingoBoard.querySelectorAll('div');
  cells.forEach(cell => {
    if (cell.textContent == newNumber) {
      cell.classList.add('bg-indigo-600', 'text-white'); 
    }
  });

  currentNumberDisplay.style.textAlign = 'center'; 
  saveGameState(); 
}

function markNumber(cell, num) {
  if (calledNumbers.includes(num)) {
    cell.classList.add('bg-indigo-600', 'text-white'); 
    checkWin(); 
  }
}

function checkWin() {
    for (let i = 0; i < 25; i += 5) {
        let rowWin = true;
        for (let j = 0; j < 5; j++) {
            if (!bingoBoard.children[i + j].classList.contains('bg-indigo-600')) {
                rowWin = false;
                break;
            }
        }
        if (rowWin) {
            currentNumberDisplay.textContent = 'You Win!';
            return;
        }
    }
}
function resetGame() {
  saveGameState();
  calledNumbers = [];
  currentNumberDisplay.textContent = '';
  generateBoardNumbers();
  renderBoard();
}

function saveGameState() {
  localStorage.setItem('calledNumbers', JSON.stringify(calledNumbers));
  localStorage.setItem('boardNumbers', JSON.stringify(boardNumbers));
}

function loadGameState() {
  let savedCalledNumbers = localStorage.getItem('calledNumbers');
  let savedBoardNumbers = localStorage.getItem('boardNumbers');

  if (savedCalledNumbers) {
    calledNumbers = JSON.parse(savedCalledNumbers);
    updateMarkedNumbers(); 
  }

  if (savedBoardNumbers) {
    boardNumbers = JSON.parse(savedBoardNumbers);
  }
}

function updateMarkedNumbers() {
  let cells = bingoBoard.querySelectorAll('div');
  cells.forEach(cell => {
    if (calledNumbers.includes(parseInt(cell.textContent))) {
      cell.classList.add('bg-indigo-600', 'text-white'); 
    }
  });
}

loadGameState(); 
generateBoardNumbers();
renderBoard(); 

callButton.addEventListener('click', callNumber);
resetButton.addEventListener('click', resetGame);
