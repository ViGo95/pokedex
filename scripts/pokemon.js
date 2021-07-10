// DECLARACION DE ELEMENTOS
const mainContainer = document.getElementById('main_container')
const othersContainer = document.getElementById('others_container')

// DECLARACION DE VARIABLES
const HECTOGR_LB = 0.220462;
const FEETS_MTS = 3.28084
const url = new URL(window.location.href)
const pokemonID = url.searchParams.get('id')
const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;

// FUNCIONES DE MAQUETADO


const getPokemon = (async () => {
  let pokemon = ''

  try {
    const pokeObj = await axios.get(POKEMON_URL)

    pokemon = pokeObj.data

  } catch (error) {
    console.log(error)
  }

  createPokemons(pokemon)
})()

const createPokemons = (pokemon) => {
  const pokeSprites = JSON.stringify(pokemon.sprites)
  const lbs = Math.round(pokemon.weight * HECTOGR_LB)
  const kgs = pokemon.weight / 10
  const fts = Math.round(pokemon.height * FEETS_MTS)

  mainContainer.innerHTML = `
    <div class="identify_section">
      <h4 class="pokemon_id">No. ${pokemon.id}</h4>
      <h4 class="pokemon_name">${pokemon.name}</h4>
    </div>

    <div class="stats_section">
      <div class="normal_stats">
        <p class="stat">HP: ${pokemon.stats[0].base_stat}</p>
        <p class="stat">ATK: ${pokemon.stats[1].base_stat}</p>
        <p class="stat">DEF: ${pokemon.stats[2].base_stat}</p>
        <p class="stat">SPD: ${pokemon.stats[5].base_stat}</p>
      </div>

      <div class="special_stats">
        <p class="stat">S-AT: ${pokemon.stats[3].base_stat}</p>
        <p class="stat">S-DE: ${pokemon.stats[4].base_stat}</p>
      </div>
    </div>

    <div class="type_img">
      <div id="types_section" class="types_section">

      </div>

      <button class="img_container" onclick='changeSide(` + pokeSprites + `)'>
      <div class="photo_container">
        <img id="front_male" class="photo" src=${pokemon.sprites.front_default} alt="Pokemon">
      </div>
      </button>
    </div>

    <div id="physical_gender" class="physical_gender">
      <div class="physical_stats">
        <p class="physical_stat">Altura: ${pokemon.height}mts / ${fts}pies - aprox.</p>
        <p class="physical_stat">Peso: ${pokemon.weight}Hg / ${lbs}lbs / ${kgs}kg - aprox.</p>
      </div>
    </div>
  `

  const typeSection = document.getElementById('types_section')
  const pokemonType = pokemon.types
  const genderContainer = document.getElementById('physical_gender')
  
  pokemonType.map(types => {
    typeSection.innerHTML +=`
    <p class="type">${types.type.name}</p>`
  })

  if (pokemon.sprites.front_female) {
    genderContainer.innerHTML += "<div id='gender_container' class='gender_container'>" +
      "<p>Género</p>" +
      "<button id='gender_btn' onclick='changeGender(" + pokeSprites + ")'> M </button>" +
    "</div>"
  }

  othersContainer.innerHTML = `
    <div class="shiny_container">
      <div class="shiny_img">
        <div class="shiny_img_bg">
        </div>
        <img class="shiny_front" src="${pokemon.sprites.front_shiny}" alt="">
          <h4>Front</h4>
      </div>

      <div class="shiny_img">
        <div class="shiny_img_bg">
        </div>
        <img class="shiny_back" src=${pokemon.sprites.back_shiny} alt="">
        <h4>Back</h4>
      </div>
    </div>

    <div class="moves_container">
      <div class="gender_btn_container">
      </div>

      <ul class="moves">
        <li class="moves_tittle">
          <p>Movements</p>
        </li>
      </ul>
    </div>
  `

  const moves = document.getElementsByClassName('moves')[0]
  const pokemonMoves = pokemon.moves

  pokemonMoves.forEach(moveObj => {
    moves.innerHTML += `
      <li class="move">
        <p class="move_name">${moveObj.move.name}</p>
      </li>
    `
  });
}

const changeSide = (sprites) => {
  const photo = document.getElementsByClassName('photo')[0]

  if (photo.id === 'front_male') {
    photo.src = sprites.back_default
    photo.id = 'back_male'
  } else if (photo.id === 'back_male') {
    photo.src = sprites.front_default
    photo.id = 'front_male'
  } else if (photo.id === 'front_female') {
    photo.src = sprites.back_female
    photo.id = 'back_female'
  } else {
    photo.src = sprites.front_female
    photo.id = 'front_female'
  }
}

const changeGender = (sprites) => {
  const shinyFront = document.getElementsByClassName('shiny_front')[0]
  const shinyBack = document.getElementsByClassName('shiny_back')[0]
  const photo = document.getElementsByClassName('photo')[0]
  const genderBtn = document.getElementById('gender_btn')

  if (photo.id === 'front_male') {
    photo.src = sprites.front_female
    shinyFront.src = sprites.front_shiny_female
    shinyBack.src = sprites.back_shiny_female
    photo.id = 'front_female'
    genderBtn.innerHTML = 'F'
  } else if (photo.id === 'back_male') {
    photo.src = sprites.back_female
    shinyFront.src = sprites.front_shiny_female
    shinyBack.src = sprites.back_shiny_female
    photo.id = 'back_female'
    genderBtn.innerHTML = 'F'
  } else if (photo.id === 'front_female') {
    photo.src = sprites.front_default
    shinyFront.src = sprites.front_shiny
    shinyBack.src = sprites.back_shiny
    photo.id = 'front_male'
    genderBtn.innerHTML = 'M'
  } else {
    photo.src = sprites.back_default
    shinyFront.src = sprites.front_shiny
    shinyBack.src = sprites.back_shiny
    photo.id = 'back_male'
    genderBtn.innerHTML = 'M'
  }
}