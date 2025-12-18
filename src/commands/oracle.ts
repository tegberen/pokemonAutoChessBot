import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('oracle')
  .setDescription('me olmec, you question');

export async function execute(interaction: CommandInteraction) {
  const answers = [
    'Yes',
    'No',
    'I cannot judge this',
    'You must ask yourself first',
    'The answer is within you',
    'The answer is obvious if you look closely',
    'This is not for me to decide'
  ];
  
  const answer = answers[Math.floor(Math.random() * answers.length)];
  
  await interaction.reply(answer);
}