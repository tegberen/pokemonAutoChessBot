const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
import { 
     fishList,
	 dlcFishList,
     fishPokemon,
	 fishTreasures,
     SHINY_RATE,
	 TREASURE_RATE,
	 DLC_CATCH_RATE
   } from '../data/animals';

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
//////////////////////////////////////////////// DECISION ////////////////////////////////////////////////
module.exports = {
	data: new SlashCommandBuilder()
		.setName('fish')
		.setDescription('me olmec, you fish'),
  
	async execute(interaction: any) {
	await interaction.deferReply();
	
	try {
	
		const isPokemon = Math.random() < 0.005;
		
		if (isPokemon) {
			const pokemonId = fishPokemon[Math.floor(Math.random() * fishPokemon.length)];
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
			const isTreasure = Math.random() < TREASURE_RATE;
			if (isTreasure) {
				const treasure = fishTreasures[Math.floor(Math.random() * fishTreasures.length)];
				const randomPrice = Math.floor(Math.random() * 1000000) + 1;
				
				return interaction.editReply({
				content: `Wow a rare treasure!!! You reeled in ${treasure.name}, it is worth $${randomPrice}! <:pog:1416513137536008272>`,
				files: [treasure.imageUrl]
				});
			}

			const isDLC = Math.random() < DLC_CATCH_RATE;
			const fishArray = isDLC ? dlcFishList : fishList;
			const fish = fishArray[Math.floor(Math.random() * fishArray.length)];
			
			const searchData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(fish)}&format=json`
			) as WikiSearchResult;
			
			if (!searchData.query?.search?.[0]) {
				return interaction.editReply(`You caught a ${fish}, but it got away!`);
			}
			
			const pageId = searchData.query.search[0].pageid;
			const pageData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&format=json`
			) as WikiPageResult;
			
			const weightRange = getWeightRange(fish);
			const randomWeight = weightRange.max < 1 
			  ? (Math.random() * (weightRange.max - weightRange.min) + weightRange.min).toFixed(1) // small case
			  : Math.floor(Math.random() * (weightRange.max - weightRange.min + 1)) + weightRange.min;
			
			const page = pageData.query.pages[pageId];
			const imageUrl = page.thumbnail?.source || page.original?.source;
			
			if (!imageUrl) {
				return interaction.editReply(`You legally and ethically caught a ${fish}, it weighs ${randomWeight}kg`);
			}

			const fileSize = await getFileSize(imageUrl);
			const MAX_SIZE = 25 * 1024 * 1024; //25mb
			
			if (fileSize > MAX_SIZE) {
				console.log(`img error`);
				return interaction.editReply({
				content: `You legally and ethically caught a ${fish}, it weighs ${randomWeight}kg`,
				});
			}
			
			return interaction.editReply({
				content: `You legally and ethically caught a ${fish}, it weighs ${randomWeight}kg`,
				files: [imageUrl]
			});
		}
		
	} catch (err) {
		console.error(err);
		return interaction.editReply("error fish img fetch");
	}
	}
};

//////////////////////////////////////////////// HELPER ////////////////////////////////////////////////
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
        'User-Agent': 'discord bot - fish command'
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
        'User-Agent': 'discord bot - fish command'
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

function getWeightRange(fishName: string): { min: number; max: number } {
  const name = fishName.toLowerCase();
  
  //sharks and whales
  if (name.includes('whale') || 
      name.includes('shark') && (name.includes('great white') || name.includes('basking') || 
      name.includes('whale shark') || name.includes('megalodon'))) {
    return { min: 1000, max: 100000 };
  }
  
  //jmts
  if (name.includes('seal') || 
      name.includes('sea lion') || 
      name.includes('walrus') ||
      name.includes('shark')) {
    return { min: 100, max: 10000 };
  }
  
  //seijas
  if (name.includes('jelly') ||
	  name.includes('shrimp') || 
      name.includes('prawn') || 
      name.includes('crab') && !name.includes('crabby') ||
      name.includes('lobster') && Math.random() < 0.3) {
    return { min: 0.1, max: 0.9 };
  }
  
  //mammal
  if (name.includes('tuna') || 
      name.includes('marlin') || 
      name.includes('swordfish') ||
      name.includes('sturgeon') ||
      name.includes('otter') ||
      name.includes('dolphin') ||
      name.includes('porpoise')) {
    return { min: 100, max: 1000 };
  }
  //fossils
  if (name.includes('megalodon') || 
      name.includes('mosasaurus') || 
      name.includes('plesiosaur') ||
      name.includes('dunkleosteus') ||
      name.includes('basilosaurus') ||
      name.includes('liopleurodon')) {
    return { min: 90000, max: 100000 };
  }
  
  return { min: 1, max: 100 };
}
