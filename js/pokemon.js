// Fetch
//// La API Fetch proporciona una interfaz JavaScript para acceder y manipular 
// partes del canal HTTP, tales como peticiones y respuestas. También provee un 
// método global fetch() (en-US) que proporciona una forma fácil y lógica de obtener 
// recursos de forma asíncrona por la red.
// Post

const BASE_URL = 'https://pokeapi.co/api/v2/';

// fetch no async
// fetch(BASE_URL + 'pokemon/ditto')
// .then(res => res.json()) //res = response -- //si le quitamos el res.json no será legible.
// .then(data => console.log(data));
// */

// fetch async 
// Función dinamica de FETCH

const fetchPokemon = async (pokemon) => { //trata y si no atrapa el error
    try {
        // const response = await fetch(BASE_URL + 'pokemon/ditto'); ejemplo de 1 pokemon
        const response = await fetch(`${BASE_URL}pokemon/${pokemon}`) // ejemplo dinámico
        const parsedResponse = await response.json();
        return parsedResponse;

    } catch (err){
        console.error(err); 
    }
}

// Obtener Pokemon
document.getElementById('get-btn')
.addEventListener('click', async () =>{
    const text = document.getElementById('poke-name').value.toLowerCase();
    const pokemon =await fetchPokemon(text);
    localStorage.setItem('currentPokeId',pokemon.id);
    console.log(pokemon.name);
})

document.addEventListener('DOMContentLoaded', async () =>{
    const storedId = localStorage.getItem('currentPokeId');
    const initialId = storedId ? parseInt(storedId) : 1;
    const pokemon = await fetchPokemon(initialId);
    console.log(pokemon.name)
})

// Obetner el anterior
//
//
// Obtener el siguiente

document.getElementById('previous-btn')
    .addEventListener('click', async () =>{
        let currentPokeId = parseInt(localStorage.getItem('currentPokeId'))
        const newId = Math.max(1, currentPokeId -1);
        const pokemon = await fetchPokemon(newId);
        console.log (pokemon.name);
        if (currentPokeId !== newId) {
            currentPokeId = newId;
            localStorage.setItem('currentPokeId', currentPokeId);
        }           
        })
        

document.getElementById('next-btn')
    .addEventListener('click', async () =>{
        let currentPokeId = parseInt(localStorage.getItem('currentPokeId'))
        const newId = currentPokeId + 1;
        const pokemon = await fetchPokemon(newId);
        console.log(pokemon.name);
        if (currentPokeId !== newId) {
            currentPokeId = newId;
            localStorage.setItem('currentPokeId', currentPokeId);
        }
    })


////////////////// POST
//

fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
        title: 'title1',
        body: 'Lorem ipsum dolor sit amet',
        userId: 1,
    }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    }
}).then(res => res.json())
    .then(json => console.log(json))

//////////// Ejercicios
// Arreglar el pokemon en localStorage
// -Msnipular el dom y agregar una tarjeta del pokemon que venga del local storage.
// -El tamaño e info de la tarjeta es a consideracion personal
// -La tarjeta debe mantenerse en la pantalla.
// -La info -> LocalStorage -> Fetch

// const createPokemon = (pokemon)=> {
//     document.getElementById('name').textContent = pokemon.name;
//     document.getElementById('base_experience').textContent = pokemon.base_experience; 
//     document.getElementById('identifier').textContent = pokemon.identifier;

// }
//     createPokemon(pokemon);

// const namePoke = document.getElementById('pokemonName')

//     btn.addEventListener('click', () =>{
//         const newPoke = {
//          name : namePoke.value,
//          base_experience : 
        
//     }
// })

const CARD_SECTION = document.getElementById('poke');
const pokemonInput = document.getElementById('pokemon-input');

const createCard = () => {
    const card = document.createElement('div');
    card.classList.add('card', 'container');
    return card;
}

const createDescription = () => {
    const userElements = {
        name: document.createElement('h2'),
        dimensions: document.createElement('p'),
        id: document.createElement('p')
    }
    return userElements;
}

const populateElements = (user, userElements) => {
    userElements.name.textContent = user.name;
    userElements.dimensions.textContent = `Altura: ${user.height} | Peso: ${user.weight}`;
    userElements.id.textContent =`ID: ${user.id}`;
    return userElements;
}

const renderElements = (card, elements) => {
    card.append(elements.name, elements.dimensions, elements.id);
}

async function fetchPokemonData(pokemon) {
    try {
        const response = await fetch(`${BASE_URL}pokemon/${pokemon}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Función para mostrar datos en la tarjeta
async function displayPokemonData() {
    const pokemonName = pokemonInput.value.trim().toLowerCase();
    if (!pokemonName) {
        alert('Por favor, ingresa un nombre o número de Pokémon válido.');
        return;
    }
    const pokemonData = await fetchPokemonData(pokemonName);
    const card = createCard();
    const info = createDescription();

    const elementsData = populateElements(pokemonData, info);
    renderElements(card, elementsData);

    CARD_SECTION.innerHTML = ''; // Limpia el contenido anterior
    CARD_SECTION.appendChild(card);

    const cardData = {
        name: pokemonData.name,
        dimensions: `Altura: ${pokemonData.height} | Peso: ${pokemonData.weight}`,
        id: `ID: ${pokemonData.id} `
    };
    
    
    localStorage.setItem('pokemonCard', JSON.stringify(cardData)); // Almacenar la tarjeta en el localStorage como cadena JSON
    
}

const button = document.getElementById('btn');
button.addEventListener('click', displayPokemonData);

window.addEventListener('load', () => {
    const storedCardData = localStorage.getItem('pokemonCard');
    if (storedCardData) {
        // Si hay una tarjeta almacenada, muestra los datos en la página
        const cardData = JSON.parse(storedCardData);
        const card = createCard();
        const info = createDescription();
        info.name.textContent = cardData.name; // Nombre mostrado en card cargada al refrescar la pagina
        info.dimensions.textContent = cardData.dimensions; // Dimensiones
        info.id.textContent = cardData.id; // ID 
        renderElements(card, info);
        CARD_SECTION.appendChild(card);
    }
});