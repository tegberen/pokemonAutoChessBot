const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
import { 
     dinoList,
	 fossilPokemon,
	 treasureList,
     SHINY_RATE,
	 TREASURE_RATE
   } from '../data/animals';

interface WikiSearchResult {
  query?: {
    search?: Array<{ pageid: number }>;
  };
}

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
		.setName('dig')
		.setDescription('me olmec, you dig'),
  
	async execute(interaction: any) {
	await interaction.deferReply();
	
	try {
	
		const isPokemon = Math.random() < 0.005;
		
		if (isPokemon) {
			const pokemonId = fossilPokemon[Math.floor(Math.random() * fossilPokemon.length)];
			const randomWeight = Math.floor(Math.random() * 1000) + 1;
			const pokeData = await fetchPokeAPI(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`) as PokeAPIResponse;
			const imageUrl = pokeData.sprites.other['official-artwork'].front_shiny;
			const pokemonName = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);

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
	        }

			if (!imageUrl) {
				return interaction.editReply(`Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg <:pog:1416513137536008272>`);
			}
			

			return interaction.editReply({
				content: `Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg <:pog:1416513137536008272>`,
				files: [imageUrl]
			});
		
		} else {
			// check treasure list
          

			const isTreasure = Math.random() < TREASURE_RATE;
      if (isTreasure) {
        const treasure = treasureList[Math.floor(Math.random() * treasureList.length)];
        const randomPrice = Math.floor(Math.random() * 100000) + 1;
        
        return interaction.editReply({
          content: `Wow a rare treasure!!! You unearthed ${treasure.name}, it is valued at $${randomPrice}! <:pog:1416513137536008272>`,
          files: [treasure.imageUrl]
        });
      }
      // check dino list and fetch wiki image code
			const dino = dinoList[Math.floor(Math.random() * dinoList.length)];
			
			const searchData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(dino)}&format=json`
			) as WikiSearchResult;
			
			if (!searchData.query?.search?.[0]) {
				return interaction.editReply( `You could not unearthe the fossil and revived it ...`);
			}
			
			const pageId = searchData.query.search[0].pageid;
			const pageData = await fetchWikipedia(
				`https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&format=json`
			) as WikiPageResult;
			
            const randomWeight = Math.floor(Math.random() * 50001) + 50000;
			const page = pageData.query.pages[pageId];
			const imageUrl = page.thumbnail?.source || page.original?.source;
            
			if (!imageUrl) {
				return interaction.editReply( `You unearthed a fossil and revived it into a ${dino}! It weighs ${randomWeight}kg`);
			}

			const fileSize = await getFileSize(imageUrl);
			const MAX_SIZE = 25 * 1024 * 1024; //25mb
			
			if (fileSize > MAX_SIZE) {
				console.log(`img error`);
				return interaction.editReply({
				content: `You unearthed a fossil and revived it into a ${dino}! It weighs ${randomWeight}kg`,
				});
			}
			

			return interaction.editReply({
				content:  `You unearthed a fossil and revived it into a ${dino}! It weighs ${randomWeight}kg`,
				files: [imageUrl]
			});
		}
		
	} catch (err) {
		console.error(err);
		return interaction.editReply("error no fossil");
	}
	}
};

// helper see /fish
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
        'User-Agent': 'discord bot - dig command'
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
        'User-Agent': 'discord bot - dig command'
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
