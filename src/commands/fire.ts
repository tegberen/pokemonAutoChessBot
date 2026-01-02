import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('fire')
  .setDescription('me olmec, you burn the kitchen');

const gifs = [
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDNuYWozZm95cDR2eGZwN3Y1ZTIwaWJqYnVjMzcxcDlveXp2Mm1lbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IFaUfRBSV6rWeGFSye/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmg4dTVrMzB5YmU3dGNtY3g4c3pyZ2I4djNuZ3ptczFseHFoaGlkeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VIPfTy8y1Lc5iREYDS/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXpnbzVqNnF1OXRueXZnbmV4b3VnbmNvMTB0NjNxZ2I1cjlla2trYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y4VkyhG1RO7pQbQFhF/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2VjMGczdzhqOXJidGI2bjc0bTVudjAxaGRsZHl1cDZxOTU5dDhnOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RUQL7vIPJZ5xoDDcqV/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXloY3lybGtqMGlqbmFjc3R3bDJlYzB0dTdhN2lnbnU4cW8yNG54dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GyMM5HbTjiMIUPsKmL/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXdwajZpZnhucDFucGZtbHR1dDljMDdmOWMxZWU5YzV3dmlidHl3diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lCqRKYWcq6Uj1Wi4ni/giphy.gif'
];

export async function execute(interaction: any) {
  const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

  await interaction.reply({
    content: randomGif
  });
}
