//Obtener el elemento donde mostraremos el resultado
const resultado = document.getElementById('result');

//Este es el contador de intentos 
let intentos = 0;

function numero () {
}

//La funcion principal
function adivinar() {
    //Obtener el valor ingresado por el usuario
    const suposicion = parseInt(document.getElementById('guessInput').value);
    intentos++ //incremento el numero de intentos cada vez el usuario pone un input
    
    const suposicionText = document.getElementById('suposicion');

    suposicionText.textContent = `este es el numero: ${numeroSecreto}`
    
    //Creo una constante que usa la funcion math.floor la cual redondea el valor que da math random la cual da un valor de 0 a 1
    const numeroSecreto = Math.floor(Math.random() * 100) + 1;

    if (isNaN(suposicion)) {
        resultado.textContent = "Por ingresa un numero valido";
        return;
    }

    //Comparar el numero correcto
    if (suposicion === numeroSecreto) {
        resultado.textContent = `Felicidades haz ganado en ${intentos} intentos`;
    }
    else if (suposicion < numeroSecreto) {
        resultado.textContent = `El numero es menor intenta de nuevo con uno mayor`;
    }
    else {
        resultado.textContent = "El numero es mayor intenta de nuevo con uno menor";
    }
}

function restart() {
    const suposicion = parseInt(document.getElementById('guessInput'));
    resultado.textContent = "";
    intentos = 0;
    suposicion = "";

    adivinar();
    numero();
}

//Obtengo el boton de adivinar para usarlo en la funcion
const boton = document.getElementById('guessButton');
//Cada vez que clickeo el boton de adivinar pongo a correr la funcion adivinar
boton.addEventListener('click', adivinar);
//Obtener el elemento donde reiniciaremos el juego
const reset = document.getElementById('resetButton');
//Cada vez que cliqueo el boton de resetear se corrrre la funcion restart
reset.addEventListener('click', restart);

const input = document.getElementById('guessInput');
input.addEventListener('keydown', function() {
    if (event.key === "Enter") {
        adivinar();
    }
})
