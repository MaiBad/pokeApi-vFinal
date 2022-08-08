const btnAnt = document.querySelector('.btn-ant')
const btnSig = document.querySelector('.btn-sig')
const select = document.getElementById('select')
const container = document.getElementById('container')
const limite = 9
let longitud, inicio = 0, final = limite

async function obtenerPokemons() {
    try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0')
        const objeto = await respuesta.json()
        let resultado = objeto.results
        longitud = resultado.length
        for (inicio; inicio < final; inicio++) {
            if (inicio == longitud) {
                break
            } else {
                obtenerInfoPokemon(resultado[inicio].url)
            }
        }
    } catch (error) {
        console.error(error)
        console.error('Error al cargar Pokemons')
    }
}

async function obtenerPokemonsPorTipo() {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${select.value}`)
        const objeto = await respuesta.json()
        let resultado = objeto.pokemon
        longitud = resultado.length
        for (inicio; inicio < final; inicio++) {
            if (inicio == longitud) {
                break
            } else {
                obtenerInfoPokemon(resultado[inicio].pokemon.url)
            }
        }
    } catch (error) {
        console.error(error)
        console.error('Error al cargar Pokemons por tipo')
    }
}

async function obtenerInfoPokemon(url) {
    container.innerHTML = ''
    try {
        const respuesta = await fetch(url)
        const objeto = await respuesta.json()
        crearCard(objeto)
    } catch (error) {
        console.error(error)
        console.error('Error al obtener información del Pokemon')
    }
}

const colorPorTipo = {
    normal: '#e4e4e4',
    fire: '#f78c44',
    grass: '#38c25b',
    electric: '#fffb00',
    water: '#2956eb',
    rock: '#885c38',
    ground: '#cc864c',
    steel: '#4c6277',
    ice: '#8ed0f7',
    psychic: '#cc20e2',
    bug: '#93e412',
    dragon: '#41a9e6',
    fairy: '#f77676',
    ghost: '#3e154b',
    poison: '#8400ac',
    fighting: '#e41212',
    flying: '#b1ddf7',
    dark: '#202224'
}

function crearCard(objeto) {
    let type = ''
    objeto.types.forEach(e => {
        type += `<span class="type type-${e.type.name}">${e.type.name}</span>`
    })

    let stat = ''
    for (let i = 0; i < objeto.stats.length; i++) {
        stat += `
            <span class="stat">
                ${objeto.stats[i].stat.name[0].toUpperCase()
            + objeto.stats[i].stat.name.substring(1)}
                : ${objeto.stats[i].base_stat}
            </span>
        `
    }

    let img = objeto.sprites.other.home.front_default
    if (img == null) {
        img = 'https://cdn-icons-png.flaticon.com/512/42/42901.png'
    }

    let card = `
        <div class="card">
            <div class="card-header" 
            style="background-color:${colorPorTipo[objeto.types[0].type.name]}">
                <span class="header-title">
                    ${objeto.name[0].toUpperCase() + objeto.name.substring(1)}
                </span>
                <div class="header-img">
                    <img class="img" 
                    src=${img} />
                </div>
            </div>
            <div class="card-info">
                <div class="info-types">
                    ${type}
                </div>
                <div class="info-stats">
                    ${stat}
                </div>
            </div>
        </div>
    `
    container.innerHTML += card
}

async function cargarCombo() {
    try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/type')
        const objeto = await respuesta.json()
        const resultado = objeto.results
        let options = ''
        for (let i = 0; i < resultado.length - 2; i++) {
            options += `
                <option value=${i + 1}>${resultado[i].name}</option>
            `
        }
        select.innerHTML += options
    } catch (error) {
        console.error(error)
        console.error('Error al cargar datos en el Combo')
    }
}

select.addEventListener('change', () => {
    final = limite
    inicio = 0
    obtenerPokemonsPorTipo()
    scroll(0, 0)
})

btnSig.addEventListener('click', () => {
    if (select.value != '') {
        if (inicio != longitud) {
            final += limite
            obtenerPokemonsPorTipo()
        }
    } else {
        if (inicio != longitud) {
            final += limite
            obtenerPokemons()
        }
    }
    scroll(0, 0)
})

btnAnt.addEventListener('click', () => {
    let totalCards = document.querySelectorAll('.card').length
    if (select.value != '') {
        if (inicio > limite) {
            final -= limite
            inicio -= (totalCards + limite)
            obtenerPokemonsPorTipo()
        }
    } else {
        if (inicio > limite) {
            final -= limite
            inicio -= (totalCards + limite)
            obtenerPokemons()
        }
    }
    scroll(0, 0)
})

container.addEventListener('mousemove', (event) => {
    if (event.target.nodeName = 'DIV') {
        VanillaTilt.init(document.querySelectorAll('.card'), {
            max: 15,
            speed: 400,
            scale: 1.05,
        })
    }
})

cargarCombo()
obtenerPokemons()

