const startBtn = document.getElementById('start-btn');
const display = document.getElementById('game-state');
const board = document.querySelectorAll('.cell');
const playerX = 'X';
const playerO = 'O';
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let currentMoves = new Array(9);
let currentPlayer = playerX;

function startGame() {
  // Inicializa o array de jogadas realizadas
  currentMoves = new Array(9);

  // Inicializa o jogador atual
  currentPlayer = playerX;

  // Inicializa o display 
  display.textContent = currentPlayer;

  // Altera o conteúdo textual do botão
  startBtn.textContent = 'Restart Game';

  board.forEach(cell => {
    // Para cada célula do tabuleiro remove-se o conteúdo textual
    cell.textContent = ''; 
    // Para cada célula do tabuleiro altera-se o cursor para o padrão
    cell.style.cursor = 'inherit';
    // Remove o eventListener 'click' que dispara a função cellClickHandler de cada célula do tabuleiro
    cell.removeEventListener('click', cellClickHandler); 
  });
  
  board.forEach((cell, index) => {
    cell.style.cursor = 'pointer';
    cell.setAttribute('data-id', index);
    cell.addEventListener('click', cellClickHandler)
  });
}


function cellClickHandler(e) {
  const cell = e.target;

  // Salva a última jogada deferida
  saveLastMove(cell);

  // Verifica se o jogo terminou
  if (checkGameOver()) {
    return
  }

  // Altera o jogador atual para X ou O
  currentPlayer === playerX ? currentPlayer = playerO : currentPlayer = playerX;

  // Atualiza o display
  display.textContent = currentPlayer;
}


function checkGameOver() {
  const hasWinner = checkWin();

  // Se houver um vencedor
  if (hasWinner) {
    blockBoardCells();
    display.textContent = `Player ${currentPlayer} won!`;
    return true
  } 
  
  // Se houver um empate
  if (!hasWinner && !currentMoves.includes(undefined)) {
    blockBoardCells();
    display.textContent = `Tied!`;
    return true
  }

  return false;
}


function saveLastMove(cell) {
  const cellId = cell.getAttribute('data-id');
  currentMoves[cellId] = currentPlayer;
  cell.removeEventListener('click', cellClickHandler);
  cell.style.cursor = 'inherit';
  cell.textContent = currentPlayer;
}


function checkWin() {
  let hasWinner = false;

  for (combination of winCombinations) {
    hasWinner = (
      combination.every(el => currentMoves[el] === playerX) ||
      combination.every(el => currentMoves[el] === playerO)
    );

    if (hasWinner) {
      break; 
    }
  }

  return hasWinner;
}


// Impede novos cliques sobre todas as células do tabuleiro
function blockBoardCells() {
  board.forEach(cell => {
    cell.style.cursor = 'inherit';
    cell.removeEventListener('click', cellClickHandler);
  });
}


window.onload = () => {
  startBtn.addEventListener('click', startGame);
}