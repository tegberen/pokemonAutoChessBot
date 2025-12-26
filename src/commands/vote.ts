import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { pokemonByRarity, RarityCategory } from '../data/pokemon';

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function formatPokemonName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function getRandomContext(): string {
  const contextTypes = [
    'in_context',
    'bis'
  ];
  
  const contextType = randomElement(contextTypes);
  
  switch (contextType) {
    case 'in_context':
      return 'in context';
    case 'bis':
      return 'with BiS';
    default:
      return 'in context';
  }
}

function getRandomPokemonPair(): { pokemon1: string; pokemon2: string } | null {
  const categories = Object.keys(pokemonByRarity) as RarityCategory[];
  
  const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);
  
  for (const category of shuffledCategories) {
    const categoryData = pokemonByRarity[category];
    const tiers = Object.keys(categoryData);
    
    const shuffledTiers = [...tiers].sort(() => Math.random() - 0.5);
    
    for (const tierKey of shuffledTiers) {
      const tierData = categoryData[tierKey as keyof typeof categoryData];
      
      const allPokemon: string[] = [
        ...tierData.regular,
        ...tierData.additional
      ];
      
      if (allPokemon.length >= 2) {
        const shuffled = [...allPokemon].sort(() => Math.random() - 0.5);
        
        return {
          pokemon1: shuffled[0],
          pokemon2: shuffled[1]
        };
      }
    }
  }
  
  return null;
}

export const data = new SlashCommandBuilder()
  .setName('vote')
  .setDescription('me olmec, you vote');

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const pair = getRandomPokemonPair();
    
    if (!pair) {
      await interaction.reply({
        content: 'Could not find a valid Pokemon pair!',
        ephemeral: true
      });
      return;
    }
    
    const randomContext = getRandomContext();
    
    const pokemon1Name = formatPokemonName(pair.pokemon1);
    const pokemon2Name = formatPokemonName(pair.pokemon2);
    
    const question = `${pokemon1Name} or ${pokemon2Name} ${randomContext}`;
    
    await interaction.reply(question);
    
    const message = await interaction.fetchReply();
    await message.react('1️⃣');
    await message.react('2️⃣');

  } catch (error) {
    console.error('Error in vote command:', error);
    
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'An error occurred while creating the poll!',
        ephemeral: true
      }).catch(console.error);
    }
  }
}