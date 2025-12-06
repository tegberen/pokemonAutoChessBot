import { SlashCommandBuilder } from 'discord.js';
import { getUserPokemon, getPokemonCount } from '../services/pokemonService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collection')
    .setDescription('view shiny collection'),
  
  async execute(interaction: any) {
    await interaction.deferReply();
    
    try {
      const pokemon = await getUserPokemon(interaction.user.id);
      
      if (pokemon.length === 0) {
        return interaction.editReply('no shiny fish yet');
      }
      
      // Show last 15 catches
      const recent = pokemon.slice(0, 15);
      const list = recent.map((p, i) => `${i + 1}. ${p.pokemonName} (${p.weight}kg)`).join('\n');
      
      return interaction.editReply(`Shiny Collection \n\`\`\`\n${list}\n\`\`\``);
      
    } catch (error) {
      console.error('Error:', error);
      return interaction.editReply('Error loading collection.');
    }
  }
};
