document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid-div');
  const scoreDisplay = document.getElementById('score');
  const startBtn = document.getElementById('start-btn');

  const width = 10;
  let currentIndex = 0; // O primeiro tile do grid
  let appleIndex = 0; // O primeiro tile do grid
  let currentSnake = [2, 1, 0] // O tile 2 do grid representa a posição inicial da cabeça e o tile 0 a calda.

  let direction = 1;
  let score = 0;
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;

  function startGame() {
    currentSnake.forEach(index => squares[index].classList.remove('snake'));

    squares[appleIndex].classList.remove('apple');
    clearInterval(interval);
    score = 0; // Zerando o score
    randomApple();
    direction = 1; // Reiniciando a direção da cobrinha
    scoreDisplay.innerText = `Score: ${score}`; // Reiniciando o display da cobrinha
    intervalTime = 1000; // 
    currentSnake = [2,1,0]; // Reiniciando a posição inicial da cobrinha
    currentIndex = 0; //
    currentSnake.forEach(index => squares[index].classList.add('snake')); // Exibindo a cobrinha na posição inicial
    interval = setInterval(moveOutcomes, intervalTime)
  }

  // Função que lida com TODOS os reflexos de um movimento da cobrinha
  function moveOutcomes() {
    // Lida com a colisão da cobrinha contra uma das paredes ou contra si mesma
    if (
      (currentSnake[0] + width >= (width * width) && direction === width) || // Se a cobrinha colidir contra a parede de baixo
      (currentSnake[0] % width === width -1 && direction === 1) || // Se a cobrinha colidir contra a parede da direita
      (currentSnake[0] % width === 0 && direction === -1) || // Se a cobrinha colidir contra a parede da esquerda
      (currentSnake[0] - width < 0 && direction === -width) || // Se a cobrinha colidir contra a parede de cima
      (squares[currentSnake[0] + direction].classList.contains('.snake')) // Se a cobrinha colidir contra si mesma
    ) {
      return clearInterval(interval);
    }

    const tail = currentSnake.pop(); // Remove o último índice do array que representa a cobrinha
    squares[tail].classList.remove('snake'); // Remove o a classe snake do tile que representa a calda da cobrinha
    currentSnake.unshift(currentSnake[0] + direction) // Move a cabeça da cobrinha para direção respectiva

    if (squares[currentSnake[0]].classList.contains('apple')) {
      squares[currentSnake[0]].classList.remove('apple');
      squares[tail].classList.add('snake');
      currentSnake.push(tail)
      randomApple();
      score++;
      scoreDisplay.innerText = `Score: ${score}`; 
      clearInterval(interval);
      intervalTime *= speed;
      interval = setInterval(moveOutcomes, intervalTime);
    }

    squares[currentSnake[0]].classList.add('snake');
  }

  // Controle da cobrinha
  function control(e) {
    squares[currentIndex].classList.remove('snake');

    if(e.key === 'ArrowRight' || e.keyCode === 39) {
      direction = 1; // Se pressionar o direcional da direta ou a letra D, a cobra andará para direita
    } else if (e.key === 'ArrowTop' || e.keyCode === 38) {
      direction = -width; // Se pressionar o direcional de cima ou a letra W, a cobra andará para cima
    } else if (e.key === 'ArrowLeft' || e.keyCode === 37) {
      direction = -1; // Se pressionar o direcional da esquerda ou a letra A, a cobra andará para esquerda
    } else if (e.key === 'ArrowDown' || e.keyCode === 40) {
      direction = +width; // Se pressionar o direcional de baixo ou a letra S, a cobra andará para baixo
    }
  }

  function randomApple() {
    do {
      appleIndex = Math.floor(Math.random() * 100);
    } while (squares[appleIndex].classList.contains('snake')); // Garante que a maçã não aparecerá em um tile em que a cobrinha já esteja.

    squares[appleIndex].classList.add('apple');
  }

  document.addEventListener('keyup', control);
  startBtn.addEventListener('click', startGame);
})