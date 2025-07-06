document.addEventListener('DOMContentLoaded', () => {
    const cards = ['🐶', '😺', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const movesElement = document.getElementById('moves');
    const resetButton = document.getElementById('reset-btn');

    let flippedCard = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval;

    //Duplicar y mezclar cartas
    const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);

    //Crear Tablero
    function createBoard() {
        gameBoard.innerHTML = '';
        gameCards.forEach((emoji, index) => {
            const cards = document.createElement('div');
            cards.classList.add('card');
            cards.dataset.index = index;
            cards.textContent = emoji;
            cards.addEventListener('click', flipCard);
            gameBoard.appendChild(cards);
        });
    }
    //Voltear carta
    function flipCard() {
        if (flippedCard.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            flippedCard.push(this);

            if (flippedCard.length === 2) {
                moves++;
                movesElement.textContent = `Movimientos ${moves}`;
                checkForMatch();
            }
        }
    }
    //Comprobar parejas
    function checkForMatch() {
        const [card1, card2] = flippedCard;
        if (card1.textContent === card2.textContent) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            if (matchedPairs === cards.length) {
                clearInterval(timerInterval);
                setTimeout(() => {
                    alert(`Ganaste en ${moves} movimientos y ${timer} segundos`);
                    resetGame();
                }, 500);
            }
        }else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        flippedCard = []; 
    }
    //Temporizador
    function startTimer() {
        timerElement.textContent = `Tiempo 00:00`;
        timer = 0;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
            const seconds = (timer % 60).toString().padStart(2, '0');
            timerElement.textContent = `Tiempo: ${minutes}: ${seconds}`;
        }, 1000);
    }
    //Reiniciar Juego
    function resetGame() {
        gameBoard.classList.add('reset-fade');
        setTimeout(() => {
            gameBoard.classList.remove('reset-fade');
        }, 500);
        flippedCard = [];
        matchedPairs = 0;
        moves = 0;
        movesElement.textContent = `Movimientos: 0`;
        clearInterval(setInterval);
        startTimer();
        
        //Mezclar las cartas nuevamente
        gameCards.sort(() => Math.random() - 0.5);
        createBoard();
    }
    resetButton.addEventListener('click', resetGame);

    //Iniciar Juego
    startTimer();
    createBoard();
})