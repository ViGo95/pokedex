// DECLARACION DE ELEMENTOS
// const typeList = document.getElementById('type_list');
const pokemonContainer = document.getElementById('pokemons_container');
let pokemonListBtn = ''
let pokemonBtn = 0

// DECLARACION DE VARIABLES
const TYPES_URL = 'https://pokeapi.co/api/v2/type';
const POKEMONS_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEMON_LIMIT = 350;
const POKEMONS_LIST_NO = 12
const pokemonOnList = []

// FUNCIONES DE MAQUETADO

// Obteniendo tipos

const types = (getTypes = () => {
  const types = []

  axios.get(TYPES_URL)
    .then(response => {
      // let typeID = 0
      const results = response.data.results 

      results.forEach(result => {
        types.push(result.url)

        // typeList.innerHTML += "<div class='type_item'>" +
        //    "<button onclick='getPokemons(" + typeID + ")'>" + result.name + "</button>" +
        //  "</div>"

        //  typeID ++
      });

    })
    .catch(error => {
      console.log(error)
    })

    return types
})();

// Obteniendo primera lista de pokemons
const getPokemons = async (typeID) => {
  const pokemons = [];

  if (typeID === undefined) {
    try {
      for (let i = 1; i <= POKEMONS_LIST_NO; i++) {
        const pokemon = await axios.get(POKEMONS_URL+i)
  
        pokemons.push(pokemon.data)
        pokemonsOnList = pokemons
      }
  
      createPokemons(pokemons)
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const typeURL = types[typeID]
      
      const typePromise = await axios.get(typeURL)
      const type = typePromise.data
      pokemons.push(type.pokemon)
      
      createPokemonsByType(pokemons)

    } catch (error) {
      console.log(error)
    }
  }
};

// Creando lista de pokemons en HTML
const createPokemons = pokemons => {

  pokemons.forEach(pokemon => {
    pokemonContainer.innerHTML += `
      <div class="pokemon">
        <div class="pokemon_img">
          <p class="pokemon_id">${pokemon.id}</p>
          <img class="pokemon_photo" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
  
        <div class="pokemon_info">
          <div class="pokemon_name_container">
            <h4 id="pokemon_name" class="pokemon_name">${pokemon.name}</h4>
          </div>
  
          <div id="pokemon_types_container${pokemon.id}" class="pokemon_types_container">
            
          </div>
  
          <div class="extra_info_container">
            <a href="./pokemon.html?id=${pokemon.id}" target="_blank" id="pokemon_extraInfo" class="pokemon_extraInfo">Ver más</a>
          </div>
        </div>
      </div>`
  
    const pokemonTypeContainer = document.getElementById('pokemon_types_container' + pokemon.id)
    const pokemonType = pokemon.types

    pokemonType.map(types => {
      pokemonTypeContainer.innerHTML +=`
      <p class="pokemon_type">${types.type.name}</p>`
    })
  });

  pokemonContainer.innerHTML += `
  <button class="pokemon_list_btn" onclick="getMorePokemons()">¿Quieres ver más?</button>`

  pokemonListBtn = document.getElementsByClassName('pokemon_list_btn')
}

// FUNCIONALIDAD
// Obteniendo siguientes 12 pokemons y creandolos en HTML
const getMorePokemons = async () => {
  const morePokemons = []

  try {
    for (let i = pokemonsOnList.length+1; i <= (pokemonsOnList.length + POKEMONS_LIST_NO); i++) { 
      
      const pokemon = await axios.get(POKEMONS_URL+i)
  
      morePokemons.push(pokemon.data)
    }
    
    pokemonsOnList = pokemonsOnList.concat(morePokemons)

    pokemonListBtn[pokemonBtn].style.display = 'none'

    createPokemons(morePokemons)
    pokemonBtn += 1

  } catch (error) {
    console.log(error)
  }
}

const searchPokemon = async () => {
  const pokemonValue = document.getElementById('search_input').value
  const pokemonPromise = await axios.get(POKEMONS_URL + pokemonValue)
  const pokemon = pokemonPromise.data

  pokemonContainer.innerHTML = `
    <div class="pokemon">
      <div class="pokemon_img">
        <p class="pokemon_id">${pokemon.id}</p>
        <img class="pokemon_photo" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      </div>

      <div class="pokemon_info">
        <div class="pokemon_name_container">
          <h4 id="pokemon_name" class="pokemon_name">${pokemon.name}</h4>
        </div>

        <div id="pokemon_types_container${pokemon.id}" class="pokemon_types_container">
          
        </div>

        <div class="extra_info_container">
          <a href="./pokemon.html?id=${pokemon.id}" target="_blank" id="pokemon_extraInfo" class="pokemon_extraInfo">Ver más</a>
        </div>
      </div>
    </div>
  `

  const pokemonTypeContainer = document.getElementById('pokemon_types_container' + pokemon.id)
  const pokemonType = pokemon.types

  pokemonType.map(types => {
    pokemonTypeContainer.innerHTML +=`
    <p class="pokemon_type">${types.type.name}</p>`
  })
}

const cleanPokemon = () => {
  const pokemonCard = pokemonContainer.children[0]

  pokemonContainer.removeChild(pokemonCard)

  getPokemons()
}

// const createPokemonsByType = pokemons => {
//   pokemons.forEach(pokemon => {
//     console.log(pokemon)
//     pokemonContainer.innerHTML += `
//       <div class="pokemon">
//         <div class="pokemon_img">
//           <p class="pokemon_id">${pokemon.id}</p>
//           <img class="pokemon_photo" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
//         </div>
  
//         <div class="pokemon_info">
//           <div class="pokemon_name_container">
//             <h4 id="pokemon_name" class="pokemon_name">${pokemon.name}</h4>
//           </div>
  
//           <div id="pokemon_types_container${pokemon.id}" class="pokemon_types_container">
            
//           </div>
  
//           <div class="extra_info_container">
//             <a href="./pokemon.html?id=${pokemon.id}" target="_blank" id="pokemon_extraInfo" class="pokemon_extraInfo">Ver más</a>
//           </div>
//         </div>
//       </div>`
  
//     const pokemonTypeContainer = document.getElementById('pokemon_types_container' + pokemon.id)
//     const pokemonType = pokemon.types

//     pokemonType.map(types => {
//       pokemonTypeContainer.innerHTML +=`
//       <p class="pokemon_type">${types.type.name}</p>`
//     })
//   });
// }