const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
import { savePokemonCatch } from '../services/pokemonService';
import { 
    dinoList,
    fossilPokemon,
    digTreasures,
    TREASURE_RATE
} from '../data/animals';

import { EmbedBuilder } from "discord.js"

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

const DIG_PHRASES = [
    `You hit something hard...`,
    `The earth trembles. Something ancient stirs.`,
    `Your shovel flies out of your hands.`,
    `You dig for hours. Your back hurts.`,
    `The ground cracks open.`,
    `You find bones. Big ones.`,
    `Something down there is looking back at you.`,
    `You unearth something that should have stayed buried.`,
];

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
                    return interaction.editReply(`Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg`);
                }

                return interaction.editReply({
                    content: `Super rare mythical pull. You caught a shiny ${pokemonName}! It weighs ${randomWeight}kg`,
                    files: [imageUrl]
                });

            } else {
                const dino = dinoList[Math.floor(Math.random() * dinoList.length)];
                const randomWeight = Math.floor(Math.random() * 50001) + 50000;
                const isTreasure = Math.random() < TREASURE_RATE;

                if (isTreasure) {
                    const treasure = digTreasures[Math.floor(Math.random() * digTreasures.length)];
                    const randomPrice = Math.floor(Math.random() * 100000) + 1;

                    const embed = new EmbedBuilder()
                        .setTitle(`Wow a rare treasure!!!`)
                        .setDescription(`You unearthed **${treasure.name}**, it is valued at $${randomPrice}!`)
                        .setImage(treasure.imageUrl);

                    return interaction.editReply({ embeds: [embed] });
                }

                const phrase = DIG_PHRASES[Math.floor(Math.random() * DIG_PHRASES.length)];

                return interaction.editReply(`${phrase}\n\nYou unearthed a fossil and revived it into a **${dino}**! It weighs ${randomWeight}kg`);
            }

        } catch (err) {
            console.error(err);
            return interaction.editReply("error no fossil");
        }
    }
};

//////////////////////////////////////////////// HELPER ////////////////////////////////////////////////

function fetchApi(url: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': 'discord bot - dig command' }
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
