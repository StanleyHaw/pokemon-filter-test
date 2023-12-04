import './style.css';

const URL = 'https://play.pokemonshowdown.com/data/pokedex.json';
const searchButton = document.querySelector('.search-button');
let userInput = '';

function searchPokemon() {
  const inputElement = document.querySelector('.input-ability');
  userInput = inputElement.value.toLowerCase(); // 轉換為小寫
  getPokemonData();
}

// 定義禁止條件
const banList = {
  negativeNum: (pokemon) => pokemon.num >= 0,
  noGmax: (pokemon) => !pokemon.name.includes('-Gmax'),
  noMega: (pokemon) => !pokemon.name.includes('-Mega'),
  noTotem: (pokemon) => !pokemon.name.includes('-Totem'),
  noSpecialPichu: (pokemon) => !pokemon.name.includes('Pichu-Spiky-eared'),
  noSpecialFloette: (pokemon) => !pokemon.name.includes('Floette-Eternal'),
};

function isPokemonAllowed(pokemon) {
  // 檢查是否符合所有禁止條件
  return Object.values(banList).every((condition) => condition(pokemon));
}

function getPokemonData() {
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      const pokemonData = Object.keys(data).map((key) => data[key]);

      // 新增篩選條件，使用 isPokemonAllowed 函數
      const filteredPokemonData = pokemonData.filter((pokemon) => isPokemonAllowed(pokemon));

      const enterAbilities = filteredPokemonData.filter((pokemon) => {
        const abilitiesData = Object.keys(pokemon.abilities).map((key) => pokemon.abilities[key].toLowerCase());
        return abilitiesData.some((ability) => ability === userInput);
      });

      displayResults(enterAbilities);
    });
}

function displayResults(results) {
  const resultContainer = document.querySelector('.pokemon-result');
  resultContainer.innerHTML = '';

  if (results.length === 0) {
    displayNoResult(resultContainer);
  } else {
    results.forEach((pokemon) => {
      displayPokemonResult(pokemon, resultContainer);
    });
  }
}

function displayNoResult(container) {
  const noResultElement = document.createElement('p');
  noResultElement.textContent = 'nothing at all';
  container.appendChild(noResultElement);
}

function displayPokemonResult(pokemon, container) {
  const wrapperElement = document.createElement('div');
  wrapperElement.classList.add('wrapper');
  // 新增左側的 .box 元素顯示 # 與格式化後的 pokemon.num
  const numElement = document.createElement('p');
  numElement.textContent = `#${pokemon.num.toString().padStart(4, '0')}`;
  numElement.classList.add('box', 'number');
  wrapperElement.appendChild(numElement);

  // 右側的 .box 元素顯示 pokemon.name
  const resultElement = document.createElement('p');
  resultElement.textContent = pokemon.name;
  resultElement.classList.add('box', 'name');
  wrapperElement.appendChild(resultElement);

  container.appendChild(wrapperElement);
}

searchButton.addEventListener('click', searchPokemon);
