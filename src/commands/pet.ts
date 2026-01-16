const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { EmbedBuilder } from "discord.js"
import {
  catBreeds,
  dogBreeds,
  sheepBreeds,
  cattleBreeds,
  donkeyBreeds,
  goatBreeds,
  pigBreeds,
  turkeyBreeds,
  chickenBreeds,
  duckBreeds,
  horseBreeds,
  rabbitBreeds,
  waterBuffaloBreeds,
  fieldPokemon,
} from '../data/pets';

import { savePokemonCatch } from '../services/pokemonService';
  
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
		.setName('pet') 
		.setDescription('me olmec, you pet'),
  
	async execute(interaction: any) {
	await interaction.deferReply();
	
	try {
    const isPokemon = Math.random() < 0.005;
    if (isPokemon) {

			const pokemonId = fieldPokemon[Math.floor(Math.random() * fieldPokemon.length)];
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

      const allPetLists = [
          ...catBreeds,
          ...dogBreeds,
          ...sheepBreeds,
          ...cattleBreeds,
          ...donkeyBreeds,
          ...goatBreeds,
          ...pigBreeds,
          ...turkeyBreeds,
          ...chickenBreeds,
          ...duckBreeds,
          ...horseBreeds,
          ...rabbitBreeds,
          ...waterBuffaloBreeds,
      ];

      const pet = allPetLists[Math.floor(Math.random() * allPetLists.length)];
      
      const searchData = await fetchWikipedia(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(pet)}&format=json`
      ) as WikiSearchResult;
      
      if (!searchData.query?.search?.[0]) {
          return interaction.editReply(`You caught a ${pet}, but it got away!`);
      }
      
      const pageId = searchData.query.search[0].pageid;
      const pageData = await fetchWikipedia(
          `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&format=json`
      ) as WikiPageResult;
      
      const weightRange = getPetWeightFromList(pet); // from your list-based function
      const randomWeight = Math.floor(Math.random() * (weightRange.max - weightRange.min + 1)) + weightRange.min;

      const page = pageData.query.pages[pageId];
      const imageUrl = page.thumbnail?.source || page.original?.source;
      
      if (!imageUrl) {
          return interaction.editReply(`You only traveled ... fair enough`);
      }

      const fileSize = await getFileSize(imageUrl);
      const MAX_SIZE = 25 * 1024 * 1024; //25mb
      
      if (fileSize > MAX_SIZE) {
          console.log('img error');
          return interaction.editReply({
          content: `You only traveled ... fair enough.`,
          });
      }

      function formatPetName(pet: string) {
          // Replace underscores and # with spaces
          const cleanPet = pet.replace(/[_#]/g, ' ').trim();

          // Capitalize first letter of each word
          return cleanPet
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
      }

      const displayPet = formatPetName(pet);

      const embed = new EmbedBuilder()
          .setTitle(`You traveled the world and pet a ${displayPet}`)
          .setDescription(`It looks like it weighs ${randomWeight}kg`)
          .setImage(imageUrl)

      return interaction.editReply({ embeds: [embed] });
  }
    
		
	} catch (err) {
		console.error(err);
		return interaction.editReply("error pet");
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
        'User-Agent': 'discord bot - pet command'
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


// Define strict weight ranges per category
const petWeightMap: Record<string, { min: number; max: number }> = {
  catBreeds: { min: 3, max: 8 },           // small cats
  dogBreeds: { min: 4, max: 80 },          // all dogs (small to large)
  sheepBreeds: { min: 30, max: 120 },
  cattleBreeds: { min: 200, max: 1000 },
  donkeyBreeds: { min: 250, max: 400 },
  goatBreeds: { min: 25, max: 120 },
  pigBreeds: { min: 50, max: 350 },
  turkeyBreeds: { min: 5, max: 15 },
  chickenBreeds: { min: 1, max: 5 },
  duckBreeds: { min: 1, max: 7 },
  horseBreeds: { min: 350, max: 700 },
  rabbitBreeds: { min: 1, max: 6 },
  waterBuffaloBreeds: { min: 400, max: 900 },
};

// Function that knows the source list
function getPetWeightFromList(pet: string): { min: number; max: number } {
  if (catBreeds.includes(pet)) return petWeightMap.catBreeds;
  if (dogBreeds.includes(pet)) return petWeightMap.dogBreeds;
  if (sheepBreeds.includes(pet)) return petWeightMap.sheepBreeds;
  if (cattleBreeds.includes(pet)) return petWeightMap.cattleBreeds;
  if (donkeyBreeds.includes(pet)) return petWeightMap.donkeyBreeds;
  if (goatBreeds.includes(pet)) return petWeightMap.goatBreeds;
  if (pigBreeds.includes(pet)) return petWeightMap.pigBreeds;
  if (turkeyBreeds.includes(pet)) return petWeightMap.turkeyBreeds;
  if (chickenBreeds.includes(pet)) return petWeightMap.chickenBreeds;
  if (duckBreeds.includes(pet)) return petWeightMap.duckBreeds;
  if (horseBreeds.includes(pet)) return petWeightMap.horseBreeds;
  if (rabbitBreeds.includes(pet)) return petWeightMap.rabbitBreeds;
  if (waterBuffaloBreeds.includes(pet)) return petWeightMap.waterBuffaloBreeds;

  // Default fallback
  return { min: 1, max: 10 };
}
