const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
import { 
  fishList,
  dlcFishList,
  fishPokemon,
  fishTreasures,
  TREASURE_RATE,
  DLC_CATCH_RATE
} from '../data/animals';

import { EmbedBuilder, AttachmentBuilder } from "discord.js"

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
	
		const isPokemon = Math.random() < 0.05;
		
		if (isPokemon) {
			const pokemonId = fishPokemon[Math.floor(Math.random() * fishPokemon.length)];
			const randomWeight = Math.floor(Math.random() * 1000) + 1;
			
      const pokeData = await fetchApi(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`) as PokeAPIResponse;
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
				return interaction.editReply(`Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg`);
			}
			
			return interaction.editReply({
				content: `Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg`,
				files: [imageUrl]
			});
		
    } else {
      const isTreasure = Math.random() < TREASURE_RATE;
      if (isTreasure) {
        const treasure = fishTreasures[Math.floor(Math.random() * fishTreasures.length)];
        const randomPrice = Math.floor(Math.random() * 1000000) + 1;
        const embed = new EmbedBuilder()
          .setTitle(`Wow a rare treasure!!!`)
          .setDescription(`You reeled in **${treasure.name}**, it is worth $${randomPrice}!`)
          .setImage(treasure.imageUrl);
        return interaction.editReply({ embeds: [embed] });
      }

      const isDLC = Math.random() < DLC_CATCH_RATE;
      const fishArray = isDLC ? dlcFishList : fishList;
      const fish = fishArray[Math.floor(Math.random() * fishArray.length)];

      const weightRange = getWeightRange(fish);
      const randomWeight = weightRange.max < 1
        ? (Math.random() * (weightRange.max - weightRange.min) + weightRange.min).toFixed(1)
        : Math.floor(Math.random() * (weightRange.max - weightRange.min + 1)) + weightRange.min;

      const taxaData = await fetchApi(
        `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(fish)}&photos=true&per_page=1`
      ) as any;

      const taxon = taxaData.results?.[0];
      const imageUrl = taxon?.default_photo?.medium_url;

      if (!imageUrl) {
        return interaction.editReply(`You legally and ethically caught a ${fish}, it weighs ${randomWeight}kg`);
      }

      const imageBuffer = await fetchImageBuffer(imageUrl);
      const attachment = new AttachmentBuilder(imageBuffer, { name: 'fish.jpg' });
      const embed = new EmbedBuilder()
        .setTitle(`You legally and ethically caught a ${fish}`)
        .setDescription(`It weighs ${randomWeight}kg`)
        .setImage('attachment://fish.jpg');
      return interaction.editReply({ embeds: [embed], files: [attachment] });
    } 
	} catch (err) {
		console.error(err);
		return interaction.editReply("error fish img fetch");
	}
	}
};

//////////////////////////////////////////////// HELPER ////////////////////////////////////////////////

function fetchApi(url) {
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

function fetchImageBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'discord bot - fish command' } }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}
