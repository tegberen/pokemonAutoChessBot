
const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
import { 
    exploreList,
    explorePokemon,
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('explore')
        .setDescription('me olmec, you explore'),

    async execute(interaction: any) {
        await interaction.deferReply();

        try {
            const isPokemon = Math.random() < 0.005;

            if (isPokemon) {
                const pokemonId = explorePokemon[Math.floor(Math.random() * explorePokemon.length)];
                const randomWeight = Math.floor(Math.random() * 1000) + 1;

                const pokeData = await fetchApi(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`) as PokeAPIResponse;
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
                const animal = exploreList[Math.floor(Math.random() * exploreList.length)];

                const weightRange = getWeightRange(animal);
                const randomWeight = weightRange.max < 1
                    ? (Math.random() * (weightRange.max - weightRange.min) + weightRange.min).toFixed(2)
                    : Math.floor(Math.random() * (weightRange.max - weightRange.min + 1)) + weightRange.min;

                const taxaData = await fetchApi(
                    `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(animal)}&photos=true&per_page=1`
                ) as any;

                const taxon = taxaData.results?.[0];
                const imageUrl = taxon?.default_photo?.medium_url;

                if (!imageUrl) {
                    return interaction.editReply(`You explored the wilderness and found a ${animal}, it weighs ${randomWeight}kg`);
                }

                const imageBuffer = await fetchImageBuffer(imageUrl);
                const attachment = new AttachmentBuilder(imageBuffer, { name: 'animal.jpg' });
                const embed = new EmbedBuilder()
                    .setTitle(`You explored the wilderness and found a ${animal}`)
                    .setDescription(`It weighs ${randomWeight}kg`)
                    .setImage('attachment://animal.jpg');

                return interaction.editReply({ embeds: [embed], files: [attachment] });
            }

        } catch (err) {
            console.error(err);
            return interaction.editReply("error animal img fetch");
        }
    }
};

//////////////////////////////////////////////// HELPER ////////////////////////////////////////////////

function fetchApi(url: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': 'discord bot - explore command' }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function fetchImageBuffer(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'discord bot - explore command' } }, (res) => {
            const chunks: Buffer[] = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
    });
}

function getWeightRange(animalName: string): { min: number; max: number } {
  const name = animalName.toLowerCase();
  
  if (name.includes('bear')) {
    return { min: 100, max: 700 };
  }

  //cats
  if (name.includes('cougar') || 
      name.includes('lynx') || 
      name.includes('bobcat') || 
      name.includes('jaguarundi') || 
      name.includes('ocelot')) {
    return { min: 10, max: 150 }; 
  }

  //dogs
  if (name.includes('wolf') || 
      name.includes('coyote') || 
      name.includes('fox') || 
      name.includes('red wolf') || 
      name.includes('gray wolf')) {
    return { min: 40, max: 120 };
  }
  //mammals
  if (name.includes('squirrel') || 
      name.includes('chipmunk') || 
      name.includes('rat') || 
      name.includes('mouse') ||
      name.includes('mole') ||
      name.includes('bat') ||
      name.includes('shrew') ||
      name.includes('vole')) {
    return { min: 0.1, max: 2 };
  }

  //reptiles 
  if (name.includes('snake') || 
      name.includes('lizard') || 
      name.includes('turtle') || 
      name.includes('boa') || 
      name.includes('rattlesnake') || 
      name.includes('gecko')) {
    return { min: 0.1, max: 100 };
  }

  //amphibians
  if (name.includes('frog') || 
      name.includes('salamander') || 
      name.includes('newt') || 
      name.includes('toad')) {
    return { min: 0.01, max: 1 };
  }

  //apes
  if (name.includes('monkey') || 
      name.includes('gorilla') || 
      name.includes('chimpanzee') || 
      name.includes('orangutan') || 
      name.includes('bonobo') || 
      name.includes('howler monkey') || 
      name.includes('capuchin monkey')) {
    return { min: 20, max: 200 };
  }


  return { min: 1, max: 1000 };
}
