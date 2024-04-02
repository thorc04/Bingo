const previousNumbersDisplay = document.getElementById('previousNumbers');
const currentNumberDisplay = document.getElementById('currentNumber');
const callButton = document.getElementById('callNumber');

let previousNumbers = JSON.parse(localStorage.getItem('previousNumbers')) || [];
let numbers = JSON.parse(localStorage.getItem('numbers')) || [];

if (numbers.length === 0) {
    for (let i = 1; i <= 90; i++) {
        if (!previousNumbers.includes(i)) {
            numbers.push(i);
        }
    }
    shuffle(numbers);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

callButton.addEventListener('click', function() {
    if (numbers.length > 0) {
        const nextNumber = numbers.pop();
        currentNumberDisplay.textContent = nextNumber;

        previousNumbers.push(nextNumber);
        previousNumbers.sort((a, b) => a - b); 

        previousNumbersDisplay.textContent = ''; 
        previousNumbers.forEach(number => { 
            const numberSpan = document.createElement('span');
            numberSpan.textContent = number;
            numberSpan.classList.add('previous-number');
            previousNumbersDisplay.appendChild(numberSpan);
        });
    } else {
        currentNumberDisplay.textContent = "Game Over!";
        callButton.disabled = true;
    }

    localStorage.setItem('numbers', JSON.stringify(numbers));
    localStorage.setItem('previousNumbers', JSON.stringify(previousNumbers));
});

const resetButton = document.getElementById('resetGame');

resetButton.addEventListener('click', function() {
    localStorage.clear();
    numbers = [];
    previousNumbers = [];
    for (let i = 1; i <= 90; i++) {
        numbers.push(i);
    }
    shuffle(numbers);
    currentNumberDisplay.textContent = "";
    previousNumbersDisplay.textContent = "";
    callButton.disabled = false;
});

// Load previous numbers on page load
window.onload = function() {
    previousNumbers.forEach(number => {
        const numberSpan = document.createElement('span');
        numberSpan.textContent = number;
        numberSpan.classList.add('previous-number');
        previousNumbersDisplay.appendChild(numberSpan);
    });
};

