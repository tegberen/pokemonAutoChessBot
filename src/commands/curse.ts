import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('curse')
  .setDescription('me olmec, you curse ritual');

export async function execute(interaction: any) {
  await interaction.reply({
    content: "⚐︎♒︎🕯︎ ☹︎□︎❒︎♎︎ ⧫︎♒︎♋︎⧫︎ ⬥︎♒︎♓︎♍︎♒︎ ⧫︎♒︎⍓︎ ⬧︎♒︎♋︎●︎●︎ ♌︎♏︎📪︎ □︎♐︎ ⧫︎♒︎♏︎ ✌︎●︎❍︎♓︎♑︎♒︎⧫︎⍓︎ ♌︎♏︎♓︎■︎♑︎📬︎ ✋︎ ⬧︎♒︎♋︎●︎●︎ ⬧︎◻︎❒︎♏︎♋︎♎︎ ⧫︎♒︎♏︎ ☹︎□︎❒︎♎︎🕯︎⬧︎ ♐︎♋︎♓︎⧫︎♒︎📪︎ ♍︎□︎❍︎❍︎♓︎⧫︎ ⬧︎♓︎■︎⬧︎ ◆︎■︎♎︎♏︎❒︎ ⍓︎□︎◆︎❒︎ ♑︎◆︎♓︎♎︎♋︎■︎♍︎♏︎📪︎ ⬧︎□︎ ◻︎●︎♏︎♋︎⬧︎♏︎📪︎ ●︎♏︎■︎♎︎ ❍︎♏︎ ⍓︎□︎◆︎❒︎ ♌︎●︎♏︎⬧︎⬧︎♓︎■︎♑︎ ♋︎■︎♎︎ ♒︎♏︎♏︎♎︎⬧︎ ❍︎⍓︎ ⬥︎□︎❒︎♎︎⬧︎📪︎ 🏱︎☹︎💧︎ ☝︎✋︎✞︎☜︎ ⚐︎☝︎☜︎☼︎🏱︎⚐︎☠︎",
  });
}
