import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { pokemonByRarity, RarityCategory } from '../data/pokemon';

const items = [
  "Reapers Cloth", "Ability Shield", "Nomicon", "Powerlens", "Heavy Duty Boots",
  "Souldew", "Stones", "X-Ray", "Razor Fang", "Gracidae", "Punching Gloves",
  "Loaded Dice", "Muscle Band", "Blue Orb", "Smokeball", "Razor Claw",
  "Widelens", "Safety Goggles", "Scope Lens", "Max Revive", "Sticky Barb",
  "Star Dust", "Flame Orb", "Deep Sea Tooth", "Green Orb", "Pokedoll",
  "Rocky Helmet", "AV", "Shiny Charm", "Shell Bell", "Protective Pads", "King's Rock",
  "Aqua Egg"
];

const synergies = [
  "normal", "grass", "fire", "water", "electric", "fighting",
  "psychic", "dark", "steel", "ground", "poison", "dragon",
  "field", "monster", "human", "aquatic", "bug", "flying",
  "flora", "rock", "ghost", "fairy", "ice", "fossil", "sound",
  "artificial", "light", "wild", "amorphous"
];

const evolutionStones = [
  "Fire Stone", "Water Stone", "Thunder Stone", "Leaf Stone", 
  "Moon Stone", "Dusk Stone", 
  "Dawn Stone", "Ice Stone"
];

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
    'no_context',
    'bis',
    'no_items',
    'random_item',
    'random_synergy',
    'random_stone'
  ];
  
  const contextType = randomElement(contextTypes);
  
  switch (contextType) {
    case 'no_context':
      return 'no context';
    case 'bis':
      return 'with BiS';
    case 'no_items':
      return 'no items';
    case 'random_item':
      return `with ${randomElement(items)}`;
    case 'random_synergy':
      return `in ${randomElement(synergies)}.`;
    case 'random_stone':
      return `with ${randomElement(evolutionStones)}`;
    default:
      return 'no context';
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
  .setName('poll')
  .setDescription('me olmec, you vote');

export async function execute(interaction: ChatInputCommandInteraction) {
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
}
