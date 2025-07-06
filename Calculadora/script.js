const display = document.getElementById('display');
const history = document.getElementById('history');

let currentInput = '';
let lastOperation = '';

//Añadir valores al display

function appendToDisplay(value){
    if(value === '.' && currentInput.includes('.')) return;// evitar que se repitan los puntos
    currentInput += value;
    display.value = currentInput;
}
//Borrar el ultimo caracter
function backSpace() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

//Limpiar el display
function clearDisplay(){
    currentInput = '';
    display.value = '';
    history.textContent = '';
}

//Calcular el resultado
function calculate() {
    if (!currentInput) return;

    try {
        const result = safeEval(currentInput);
        history.textContent = `${currentInput} =`;
        display.value = result;
        currentInput = String(result);
    } catch (error) {
        display.value = 'Error';
    }
}
function safeEval(expr){
    const tokens = expr.match(/(\d+\.?\d*)|([\+\-\*\/])/g) || [];
    let result = parseFloat(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const num = parseFloat(tokens[i + 1]);
        
        switch (operator) {
            case '+': result += num; break;
            case '-': result -= num; break;
            case '*': result *= num; break;
            case '/': result /= num; break;
        }
    }
    return result;
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if(/[0-9\.\+\-\*\/])/.test(key)) {
        appendToDisplay(key);
    }else if (key === 'Enter'){
        calculate();
    }else if (key === 'Backspace'){
        backSpace();
    }else if (key === 'Escape'){
        clearDisplay();
    }
});