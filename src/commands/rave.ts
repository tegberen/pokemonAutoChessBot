import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('rave')
  .setDescription('i said ooooooo ooo ooo');

export async function execute(interaction: any) {
  await interaction.reply({
    content: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWNxcXB5MW50MjN5MGhiY2sxNXl0N2p3ejFhYnQ3M3BlM2hhcHRsciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/m7URgFktt1JjDPjGKy/giphy.gif'
  });
}
