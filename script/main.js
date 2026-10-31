const displayText = document.querySelector('#result');
displayText.textContent = "0";
const buttons = document.querySelectorAll('button');
let currentText = '0';

// Funcții matematice corectate
function add(a, b) { return Number(a) + Number(b); }
function minus(a, b) { return Number(a) - Number(b); }
function multiply(a, b) { return Number(a) * Number(b); }
function division(a, b) { 
    if (Number(b) === 0) return "Error";
    return Number(a) / Number(b); 
}
function percentage(a) { return Number(a) / 100; }

function clearDisplay() {
    displayText.textContent = '0';
    currentText = '0';
}

// Funcție de evaluare mai sigură care respectă ordinea de la stânga la dreapta
function operate(expression) {
    // Tratare procentaj primară
    if (expression.includes('%')) {
        let i = expression.indexOf('%');
        let num = expression.slice(0, i);
        let rest = expression.slice(i + 1);
        return operate(percentage(operate(num)) + rest);
    }

    // Căutăm operatorii în ordine inversă a priorității (Adunare/Scădere mai întâi)
    // Folosim lastIndexOf pentru a asigura evaluarea corectă de la stânga la dreapta
    let i = expression.lastIndexOf('+');
    if (i >= 0) return add(operate(expression.slice(0, i)), operate(expression.slice(i + 1)));

    i = expression.lastIndexOf('-');
    if (i >= 0) return minus(operate(expression.slice(0, i)), operate(expression.slice(i + 1)));

    i = expression.lastIndexOf('x');
    if (i >= 0) return multiply(operate(expression.slice(0, i)), operate(expression.slice(i + 1)));

    i = expression.lastIndexOf('÷');
    if (i >= 0) return division(operate(expression.slice(0, i)), operate(expression.slice(i + 1)));

    return expression.trim();
}

function addText(a) {
    if (displayText.textContent.length > 18) {
        alert("I'm not that smart!");
        clearDisplay();
        return;
    }

    if (a === 'C') {
        clearDisplay();
        return;
    }

    if (displayText.textContent === "Error" || displayText.textContent === "Infinity") {
        clearDisplay();
    }

    if (a === '=') {
        let result = operate(currentText);
        
        if (result === "Error" || isNaN(result)) {
            displayText.textContent = "Error";
            currentText = '0';
            return;
        }

        // Rotunjire inteligentă la maximum 5 zecimale pentru a nu depăși ecranul
        let numDecimal = Math.round(Number(result) * 1e5) / 1e5;
        displayText.textContent = numDecimal.toString();
        currentText = numDecimal.toString();
        return;
    } 
    
    if (a === '⬅') {
        if (displayText.textContent.length <= 1) {
            clearDisplay();
            return;
        }
        
        // Șterge spațiile adăugate pe lângă operatori
        if (displayText.textContent.endsWith(' ')) {
            displayText.textContent = displayText.textContent.slice(0, -3);
        } else {
            displayText.textContent = displayText.textContent.slice(0, -1);
        }
        currentText = currentText.slice(0, -1);
        return;
    }

    // Gestionare afișaj operatori și numere
    if (['x', '÷', '+', '-'].includes(a)) {
        displayText.textContent += ' ' + a + ' ';
        currentText += a;
    } else {
        if (displayText.textContent === '0') {
            displayText.textContent = a;
            currentText = a;
        } else {
            displayText.textContent += a;
            currentText += a;
        }
    }
}

function entry(t) {
    let checkIndex = currentText.length - 1;
    
    // Previne introducerea a doi operatori consecutivi
    if (['x', '÷', '+', '-'].includes(t) && ['x', '÷', '+', '-'].includes(currentText[checkIndex])) {
        return;
    }
    
    // Previne punctele zecimale multiple în același număr
    if (t === '.') {
        let lastOperator = Math.max(
            currentText.lastIndexOf('+'),
            currentText.lastIndexOf('-'),
            currentText.lastIndexOf('x'),
            currentText.lastIndexOf('÷')
        );
        let currentNumberSegment = currentText.slice(lastOperator + 1);
        if (currentNumberSegment.includes('.')) return;
    }

    addText(t);
}

// Evenimente Mouse
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        entry(e.target.textContent);
    });
});

// Evenimente Tastatură
window.addEventListener('keydown', (e) => {
    if (['+', '-', '=', '%', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'].includes(e.key)) {
        entry(e.key);
    }
    switch (e.key) {
        case '*': entry('x'); break;
        case '/': entry('÷'); break;
        case 'Enter': entry('='); break;
        case 'Escape': clearDisplay(); break;
        case 'Backspace': entry('⬅'); break; // Mapat corect la funcția de ștergere (Backspase = ⬅)
    }
});
