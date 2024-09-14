let word = words[Math.floor(Math.random() * (words.length - 1))];
let opportunities = 6;

const keys = 'QWERTYUIOPASDFGHJKLÑZXCVBNM';
const gameBoard = [];
let wordToArray = word.split('');
const keysToArray = keys.split(''); 
const $cells = document.querySelector('.celdas');
const $keyboard = document.querySelector('.teclado');
const $seconds = document.querySelector('.segundos');
let timer;
const $time = document.querySelector('.tiempo');
const $bestTime = document.querySelector('.mejor-tiempo');
const $streak = document.querySelector('.racha');

for(let i = 0; i < opportunities; i++) {
    gameBoard[i] = [opportunities];
    for (let j = 0; j < wordToArray.length; j++) {
        gameBoard[i][j] = '';
    }
}

keysToArray.forEach(key => {
    let pElement = `
    <p class="letra">${key}</p>
    `;
    $keyboard.insertAdjacentHTML('beforeend', pElement);
});


gameBoard.forEach(rowDiv => {
    let row = document.createElement('div');
    row.classList.add('row');
    rowDiv.forEach(letter => {
        let span = document.createElement('span');
        span.classList.add('celda');
        span.textContent = letter;
        row.appendChild(span);
    });
    $cells.appendChild(row);
});

const $input = document.querySelector('.input');
const $rows = document.querySelectorAll('.row');
const $row = Array.from($rows).map(row => Array.from(row.querySelectorAll('.celda')));
const $btnWin = document.querySelector('.resultados-btn');
const $btnLose = document.querySelector('.perdiste-btn');
const $contenedorResultados = document.querySelector('.contenedor-resultados');
const $modalResultados = document.querySelector('.resultados');
const $contenedorPerdiste = document.querySelector('.contenedor-perdiste');
const $modalPerdiste = document.querySelector('.perdiste');
const $palabraAdivinada = document.querySelector('.palabra-secreta')
const $keycaps = document.querySelectorAll('.letra');

let cellNumber = 0;
let rowNumber = 0;
let win = false;
let sec = 0;
let controlTime = false;
let time = 0;
let streak = 0;
let bestTime = 0;


$keycaps.forEach(keycap => {
    keycap.addEventListener('click', () => {

        if(controlTime === false) {
            countTime();
            controlTime = true;
        }

        let currentLetter = $input.value.toLowerCase();
        currentLetter = keycap.textContent.toLowerCase();
        gameBoard[rowNumber][cellNumber] = currentLetter; 
        $row[rowNumber][cellNumber].textContent = currentLetter; 
        $input.value = '';

        cellNumber++;
    
        
        if (cellNumber == wordToArray.length) {
            cellNumber = 0;
            let counterLetter = {};
    
            wordToArray.forEach(letter => {
                counterLetter[letter] = (counterLetter[letter] || 0) + 1;
            });
    
            for(let i = 0; i < wordToArray.length; i++) {
                if(gameBoard[rowNumber][i] === wordToArray[i]) {
                    $row[rowNumber][i].style.backgroundColor = 'var(--palabra-verde)';
                    $row[rowNumber][i].style.color = 'var(--texto-blanco)';
                    counterLetter[gameBoard[rowNumber][i]]--;
                }
            }
            
            for(let i = 0; i < wordToArray.length; i++) {
                if($row[rowNumber][i].style.backgroundColor != 'var(--palabra-verde)') {
                    if(counterLetter[gameBoard[rowNumber][i]] > 0) {
                        $row[rowNumber][i].style.backgroundColor = 'var(--palabra-amarilla)';
                        $row[rowNumber][i].style.color = 'var(--texto-blanco)';
                    } else {
                        $row[rowNumber][i].style.backgroundColor = 'var(--palabra-erronea)';
                        $row[rowNumber][i].style.color = 'var(--texto-blanco)';
                    }
                }
            }
    
            if(JSON.stringify(gameBoard[rowNumber]) == JSON.stringify(wordToArray)) {
                win = true;
                time = sec;
                streak++;
                
                //$bestTime.textContent = bestTime + ' seg';
                $time.textContent = time + ' seg';
                $streak.textContent = streak;
                $palabraAdivinada.textContent = word;
                $contenedorResultados.classList.add('opacity-active');
                $modalResultados.classList.add('transform-active');
                clearInterval(timer);
            }

            rowNumber++;
            
            if (win == false) {
                if(rowNumber === opportunities) {
                    streak = 0;
                    $contenedorPerdiste.classList.add('opacity-active');
                    $modalPerdiste.classList.add('transform-active');
                    clearInterval(timer);
                }
            }

            //console.log(counterLetter);
        }
    });
})


$btnWin.addEventListener('click', reloadGame);
$btnLose.addEventListener('click', reloadGame);

function reloadGame() {
    for(let i = 0; i < opportunities; i++) {
        for(let j = 0; j < wordToArray.length; j++) {
            gameBoard[i][j] = '';
            gameBoard[i][j].textContent = '';
            $row[i][j].textContent = '';
            $row[i][j].style.backgroundColor = 'var(--texto-blanco)';
            $row[i][j].style.color = '#000';
        }
    }
    cellNumber = 0;
    rowNumber = 0;
    win = false;

    $contenedorResultados.classList.remove('opacity-active');
    $modalResultados.classList.remove('transform-active');
    $contenedorPerdiste.classList.remove('opacity-active');
    $modalPerdiste.classList.remove('transform-active');
    sec = 0;
    $seconds.textContent = '00';
    
    controlTime = false;
    word = words[Math.floor(Math.random() * (words.length - 1))];
    wordToArray = word.split('');
    counterLetter = {};

    //console.log(word);
}

function countTime() {
    timer = setInterval(() => {
        sec += 1;
        $seconds.textContent = sec + ' seg';
    }, 1000);
}