const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
import {
	 birdList,
	
     pokemonList, 
     SHINY_RATE,
	
	 SUPERMAN_RATE,
	 SUPERMAN_QUOTES,
	 SUPERMAN_IMAGE
   } from '../data/animals';

// add ifaces
interface WikiSearchResult {
  query?: {
    search?: Array<{ pageid: number }>;
  };
}

interface WikiPageResult {
  query: {
    pages: {
      [key: string]: {
        original?: {
          source: string;
        };
        thumbnail?: {
          source: string;
        };
      };
    };
  };
}

interface PokeAPIResponse {
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
		front_shiny: string | null;
      };
    };
  };
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birdwatch')
		.setDescription('me olmec, you birdwatch'),
  
	async execute(interaction: any) {
	await interaction.deferReply();
	
	try {
		const isSuperman = Math.random() < SUPERMAN_RATE;
		if (isSuperman) {
			const randomQuote = SUPERMAN_QUOTES[Math.floor(Math.random() * SUPERMAN_QUOTES.length)];
			
			return interaction.editReply({
				content: `${randomQuote}`,
				files: [SUPERMAN_IMAGE]
			});
		}
	
		const isPokemon = Math.random() < SHINY_RATE;
		
		if (isPokemon) {
			const pokemonId = pokemonList[Math.floor(Math.random() * pokemonList.length)];
			const randomWeight = Math.floor(Math.random() * 1000) + 1;
			
			const pokeData = await fetchPokeAPI(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`) as PokeAPIResponse;
			const imageUrl = pokeData.sprites.other['official-artwork'].front_shiny;
			const pokemonName = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);
	        // Save to database
	        try {
	          await savePokemonCatch(interaction.user.id, {
	            pokemonId,
	            pokemonName,
	            weight: randomWeight,
	            imageUrl,
	            caughtAt: new Date()
	          });
	        } catch (dbError) {
	          console.error('Failed to save Pokémon to database:', dbError);
	          // Continue anyway - user still gets the Pokémon in chat
	        }
			if (!imageUrl) {
				return interaction.editReply(`Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg <:pog:1416513137536008272>`);
			}
			
			return interaction.editReply({
				content: `Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg <:pog:1416513137536008272>`,
				files: [imageUrl]
			});
		
		} else {
			const bird = birdList[Math.floor(Math.random() * birdList.length)];
			
			const searchData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(bird)}&format=json`
			) as WikiSearchResult;
			
			if (!searchData.query?.search?.[0]) {
				return interaction.editReply(`You caught a ${bird}, but it got away!`);
			}
			
			const pageId = searchData.query.search[0].pageid;
			const pageData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&format=json`
			) as WikiPageResult;
			
			const weightRange = getWeightRange(bird);
			const randomWeight = weightRange.max < 1 
			  ? (Math.random() * (weightRange.max - weightRange.min) + weightRange.min).toFixed(1) // small case
			  : Math.floor(Math.random() * (weightRange.max - weightRange.min + 1)) + weightRange.min;
			
			const page = pageData.query.pages[pageId];
			const imageUrl = page.thumbnail?.source || page.original?.source;
			
			if (!imageUrl) {
				return interaction.editReply(`You went birdwatching and saw a ${bird}, it weighs ${randomWeight}g`);
			}

			const fileSize = await getFileSize(imageUrl);
			const MAX_SIZE = 25 * 1024 * 1024; //25mb
			
			if (fileSize > MAX_SIZE) {
				console.log(`img error`);
				return interaction.editReply({
				content: `You went birdwatching and saw a ${bird}, it weighs ${randomWeight}g`,
				});
			}
			
			return interaction.editReply({
				content: `You went birdwatching and saw a ${bird}, it weighs ${randomWeight}g`,
				files: [imageUrl]
			});
		}
		
	} catch (err) {
		console.error(err);
		return interaction.editReply("error bird img fetch");
	}
	}
};

function getFileSize(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    https.get(url, { method: 'HEAD' }, (res) => {
      const size = parseInt(res.headers['content-length'] || '0', 10);
      resolve(size);
    }).on('error', reject);
  });
}

function fetchWikipedia(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'discord bot - animal command'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fetchPokeAPI(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'discord bot - animal command'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getWeightRange(animalName: string): { min: number; max: number } {
  const name = animalName.toLowerCase();

  if (name.includes('eagle') || 
      name.includes('hawk') || 
      name.includes('vulture') || 
      name.includes('condor') || 
      name.includes('osprey')) {
    return { min: 500, max: 10000 };
  }

  if (name.includes('albatross') || 
      name.includes('pelican') || 
      name.includes('swan') || 
      name.includes('goose') || 
      name.includes('crane') || 
      name.includes('stork')) {
    return { min: 2000, max: 15000 };
  }

  if (name.includes('duck') || 
      name.includes('teal') || 
      name.includes('merganser') || 
      name.includes('scoter') || 
      name.includes('eider')) {
    return { min: 300, max: 3000 };
  }

  if (name.includes('hummingbird') || 
      name.includes('kinglet') || 
      name.includes('warbler') || 
      name.includes('chickadee') || 
      name.includes('wren') || 
      name.includes('gnatcatcher')) {
    return { min: 10, max: 50 };
  }

  if (name.includes('owl') || 
      name.includes('nightjar') || 
      name.includes('potoo') || 
      name.includes('frogmouth')) {
    return { min: 100, max: 4000 };
  }

  if (name.includes('parrot') || 
      name.includes('macaw') || 
      name.includes('cockatoo') || 
      name.includes('parakeet') || 
      name.includes('lovebird')) {
    return { min: 30, max: 1500 };
  }

  if (name.includes('woodpecker') || 
      name.includes('flicker') || 
      name.includes('sapsucker')) {
    return { min: 30, max: 300 };
  }

  if (name.includes('heron') || 
      name.includes('egret') || 
      name.includes('bittern') || 
      name.includes('ibis') || 
      name.includes('spoonbill')) {
    return { min: 100, max: 4000 };
  }

  if (name.includes('gull') || 
      name.includes('tern') || 
      name.includes('skimmer') || 
      name.includes('jaeger') || 
      name.includes('skua')) {
    return { min: 100, max: 2000 };
  }

  if (name.includes('penguin')) {
    return { min: 1000, max: 50000 };
  }

  if (name.includes('grouse') || 
      name.includes('ptarmigan') || 
      name.includes('pheasant') || 
      name.includes('partridge') || 
      name.includes('quail') || 
      name.includes('turkey')) {
    return { min: 100, max: 10000 };
  }

  if (name.includes('dove') || 
      name.includes('pigeon')) {
    return { min: 100, max: 500 };
  }

  if (name.includes('swift') || 
      name.includes('swallow') || 
      name.includes('martin')) {
    return { min: 10, max: 60 };
  }

  if (name.includes('sandpiper') || 
      name.includes('plover') || 
      name.includes('snipe') || 
      name.includes('godwit') || 
      name.includes('curlew') || 
      name.includes('turnstone')) {
    return { min: 100, max: 1000 };
  }

  if (name.includes('flycatcher') || 
      name.includes('kingbird') || 
      name.includes('phoebe') || 
      name.includes('pewee')) {
    return { min: 10, max: 50 };
  }

  if (name.includes('thrush') || 
      name.includes('robin') || 
      name.includes('bluebird') || 
      name.includes('solitaire')) {
    return { min: 100, max: 150 };
  }

  if (name.includes('sparrow') || 
      name.includes('bunting') || 
      name.includes('towhee') || 
      name.includes('junco')) {
    return { min: 10, max: 50 };
  }

  if (name.includes('finch') || 
      name.includes('siskin') || 
      name.includes('goldfinch') || 
      name.includes('rosefinch') || 
      name.includes('grosbeak')) {
    return { min: 100, max: 80 };
  }

  if (name.includes('tanager') || 
      name.includes('cardinal') || 
      name.includes('bunting')) {
    return { min: 15, max: 60 };
  }

  if (name.includes('jay') || 
      name.includes('crow') || 
      name.includes('raven') || 
      name.includes('magpie')) {
    return { min: 50, max: 1500 };
  }

  if (name.includes('starling') || 
      name.includes('myna')) {
    return { min: 60, max: 150 };
  }

  if (name.includes('vireo') || 
      name.includes('greenlet')) {
    return { min: 100, max: 30 };
  }

  if (name.includes('kingfisher')) {
    return { min: 100, max: 300 };
  }

  if (name.includes('trogon') || 
      name.includes('quetzal')) {
    return { min: 40, max: 200 };
  }

  if (name.includes('booby') || 
      name.includes('gannet')) {
    return { min: 700, max: 3500 };
  }

  if (name.includes('cormorant') || 
      name.includes('shag')) {
    return { min: 300, max: 5000 };
  }

  if (name.includes('rail') || 
      name.includes('crake') || 
      name.includes('gallinule') || 
      name.includes('coot') || 
      name.includes('moorhen')) {
    return { min: 20, max: 2000 };
  }

  if (name.includes('tinamou')) {
    return { min: 40, max: 2000 };
  }

  if (name.includes('flamingo')) {
    return { min: 2000, max: 4000 };
  }

  if (name.includes('grebe')) {
    return { min: 100, max: 1600 };
  }

  return { min: 1000, max: 10000 };
}
