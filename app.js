// IDEA: Create a pokemon team. This way we store each pokemon in a mongo db. 

const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

const pokeAPI = "https://pokeapi.co/api/v2/"

app.use(express.urlencoded({ extended: false }));

async function getPokemon(pokemonName) {
    const response = await fetch(pokeAPI + `pokemon/${pokemonName}`);
    if (!response.ok) {
      console.log(`Error: Pokémon ${pokemonName} not found`);
      return null;
    }
    const result = await response.json(); 
    console.log(result);
    return result;
}

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/displayPokemon', async (req, res) => {

    const { pokemon } = req.body;
    console.log(pokemon);
    let data = await getPokemon(pokemon); 
    console.log(data);
    let imgSrc = `https://img.pokemondb.net/artwork/large/${pokemon}.jpg`;



    const pokemonTypesArr = [];
    let pokemonTypes = ""; 
    for (let i = 0; i < data.types.length; i++) {
      pokemonTypesArr.push(data.types[i].type.name);
    }
    pokemonTypesArr.forEach(e => {
      pokemonTypes += e + " "; 
    });



    console.log('Pokemon Types:', pokemonTypes);

    const pokemonStats = [];
    let statsTable = "<table><tr><th>Name</th><th>Base stat</th></tr>"
    for (let i = 0; i < data.stats.length; i++) {
      const stat = data.stats[i];
      pokemonStats.push({
        name: stat.stat.name,
        base_stat: stat.base_stat
      });
    }

    pokemonStats.forEach(e => {

      statsTable += `<tr><td>${e.name}</td><td>${e.base_stat}</td></tr>`;

    });

    statsTable += "</table>";
    console.log('Pokemon Stats:', pokemonStats);
    
    res.render('displayPokemon', {pokemon: pokemon, imageSrc: imgSrc, type: pokemonTypes, stats: statsTable});
  });


  app.post('/pokemonAction', async (req, res) => {

    const action = req.body.action;
    console.log(action);

    if (action === 'catch') {
      console.log('Catch Pokémon!');
    } else if (action === 'dontCatch') {
      console.log("Don't Catch Pokémon!");
    } 

    res.render('index');
  });

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});


