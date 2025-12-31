import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('gamble')
  .setDescription('always roll');

export async function execute(interaction: any) {

  await interaction.reply({
    content: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTVjcGk4ZzJrZzBhbHVnaTE1ZGRldGlrc2l0N2JhYTI3amF3MHc0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ywGp4PMJdeLyuRq7vJ/giphy.gif'
  });
}
