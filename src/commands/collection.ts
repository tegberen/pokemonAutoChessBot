import { SlashCommandBuilder } from 'discord.js';
import { getUserPokemon, getPokemonCount } from '../services/pokemonService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collection')
    .setDescription('view shiny collection')
    .addStringOption(option =>
      option.setName('pokemon')
        .setDescription('specific pokemon to display')
        .setRequired(false)
    ),
  
  async execute(interaction: any) {
    await interaction.deferReply();
    
    try {
      const pokemon = await getUserPokemon(interaction.user.id);
      
      if (pokemon.length === 0) {
        return interaction.editReply('no shiny fish yet');
      }
      
      const pokemonName = interaction.options.getString('pokemon');
      
      // If specific pokemon requested
      if (pokemonName) {
        const found = pokemon.find(p => 
          p.pokemonName.toLowerCase() === pokemonName.toLowerCase()
        );
        
        if (!found) {
          return interaction.editReply(`${pokemonName} not found in collection`);
        }
        
        const date = new Date(found.caughtAt);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        
        return interaction.editReply({
          content: `${found.pokemonName} (${found.weight}kg) - ${formattedDate}`,
          files: [found.imageUrl]
        });
      }
      
      // Show last 15 catches
      const recent = pokemon.slice(0, 15);
      const list = recent.map((p, i) => {
        const date = new Date(p.caughtAt);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return `${i + 1}. ${p.pokemonName} (${p.weight}kg) - ${formattedDate}`;
      }).join('\n');
      
      // get rando pkmn from list
      const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
      
      return interaction.editReply({
        content: `Shiny Collection\n\`\`\`\n${list}\n\`\`\``,
        files: [randomPokemon.imageUrl]
      });
      
    } catch (error) {
      console.error('Error:', error);
      return interaction.editReply('Error loading collection.');
    }
  }
};
