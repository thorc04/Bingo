const numbers = [];
const previousNumbersDisplay = document.getElementById('previousNumbers');
const currentNumberDisplay = document.getElementById('currentNumber');
const callButton = document.getElementById('callNumber');

for (let i = 1; i <= 75; i++) {
    numbers.push(i);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(numbers);

callButton.addEventListener('click', function() {
    if (numbers.length > 0) {
        const nextNumber = numbers.pop();
        currentNumberDisplay.textContent = nextNumber;

        const numberSpan = document.createElement('span');
        numberSpan.textContent = nextNumber;
        numberSpan.classList.add('previous-number');
        previousNumbersDisplay.appendChild(numberSpan);
    } else {
        currentNumberDisplay.textContent = "Game Over!";
        callButton.disabled = true;
    }
});
