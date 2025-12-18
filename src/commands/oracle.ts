import { SlashCommandBuilder, ChatInputCommandInteraction  } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('oracle')
  .setDescription('me olmec, you question')
  .addBooleanOption(option =>
    option
      .setName('simple')
      .setDescription('simple yes/no mode')
      .setRequired(false)
  )

export async function execute(interaction: ChatInputCommandInteraction ) {
  const simple = interaction.options.get('simple')?.value as boolean | undefined;
  const answers = [
    'Yes',
    'No',
    'I cannot judge this',
    'You must ask yourself first',
    'The answer is within you',
    'The answer is obvious if you look closely',
    'This is not for me to decide'
  ];
  
  const simpleAnswers = [
    'Yes',
    'No'
  ];
  
  const list = simple ? simpleAnswers : answers;
  const answer = list[Math.floor(Math.random() * answers.length)];
  
  await interaction.reply(answer);
}