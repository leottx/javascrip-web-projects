const board = document.querySelectorAll('.card');
const btn = document.getElementById('start');
const backCard = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
let cardsName = [];
let cardsIndex = [];
let score = 0;

//Obtem os 151 Pokémons
async function fetchAllPokemons() {
  const pokemonLimit = 151; // Limite de requisições
  const URL = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonLimit}`
  const response = await fetch(URL);
  const data = await response.json();

  const {results} = data;

  return results
}

// Obtem a lista de 12 pokemons para o tabuleiro do jogo
async function getPokemonList() {
  const results = await fetchAllPokemons();
  const copies = 2; // Quantidade de cópias de cada carta
  let pokeIndexList = [];
  let pokeCurrentIndex = 0;

  let count = 0; // Contador de cópias
  let pokePrimaryList = new Array(board.length); // Array de pokemons do tabuleiro

  // Cria a lista inicial com todos os 12 pokemons em posições aleatórias
  for (i = 0; i < (board.length/2); i++) {
    count = 0;
    do {
      pokeCurrentIndex = Math.floor(Math.random() * results.length);
      pokeIndexList.push(pokeCurrentIndex);
    } while (pokeIndexList.every(index => index === pokeCurrentIndex));
    do {
      const boardIndex = Math.floor(Math.random() * board.length);
      if (pokePrimaryList[boardIndex] === undefined) {
        pokePrimaryList[boardIndex] = results[pokeCurrentIndex];
        count++;
      }
    } while(count < copies) 
  }

  // Cria a lista FINAL com todos os pokemons processados para o formato {name, imgUrl}
  const pokePromises = pokePrimaryList.map(async poke => {
    let {name, url} = poke;
    url = await fetchPokeImg(url);
    return (
      {
        name,
        url
      }
    )
  })
  
  return Promise.all(pokePromises).then(pokemon => pokemon);
}

// Obtem a sprite do respectivo pokemon
async function fetchPokeImg(url) {
  const response = await fetch(url);
  const data = await response.json();
  const {sprites:{front_default}} = data;
  
  return front_default;
}

async function startGame() {
  const pokemonList = await getPokemonList();
  buildBoard(pokemonList)
}

function buildBoard(pokemonList) {
  pokemonList.forEach((pokemon, index) => {
    const {name, url: pokeUrl} = pokemon;
    const $img = document.createElement('img');
    $img.setAttribute('data-name', name);
    $img.setAttribute('src', backCard);
    board[index].cardIndex = index;
    board[index].pokeUrl = pokeUrl;

    board[index].addEventListener('click', handleClick);

    board[index].appendChild($img);
  })
}

function handleClick(e) {
  const card = e.currentTarget;
  const {cardIndex, pokeUrl} = card;
  const $img = card.getElementsByTagName('img')[0];

  if (cardsName.length < 2 && cardIndex !== cardsIndex[0]) {
    flipCard(card, pokeUrl);
    const name = $img.getAttribute('data-name');
  
    cardsIndex.push(cardIndex);
    cardsName.push(name);

    if(cardsName.length === 2) {
      setTimeout(checkMatch, 1000)
    }
  }
}

function flipCard(card, url) {
  const $img = card.getElementsByTagName('img')[0];
  $img.setAttribute('src', url);

  if (!card.classList.contains('flipped')) {
    card.classList.add('flipped');
  } else {
    card.classList.remove('flipped');
  }
}

function checkMatch() {
  const optionOne = cardsName[0];
  const optionTwo = cardsName[1];

  if (optionOne === optionTwo) {
    cardsIndex.forEach(index => {
      board[index].classList.add('hidden');
      board[index].removeEventListener('click', handleClick);
    })
  } else {
    cardsIndex.forEach(index => {
      flipCard(board[index], backCard)
    })
  }

  cardsName = []; 
  cardsIndex = [];
}

startGame();