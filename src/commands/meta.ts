import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("meta")
	.setDescription("What is meta right now?");

const synergies = [
  "normal", "grass", "fire", "water", "electric", "fighting", 
  "psychic", "dark", "steel", "ground", "poison", "dragon", 
  "field", "monster", "human", "aquatic", "bug", "flying", 
  "flora", "rock", "ghost", "fairy", "ice", "fossil", "sound", 
  "artificial", "light", "wild", "baby", "amorphous"
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pickTwo = (arr) => {
	const first = pick(arr);
	let second = pick(arr);
	while (second === first) {
		second = pick(arr);
	}
	return [first, second];
};

export async function execute(interaction) {
	const [randomType1, randomType2] = pickTwo(synergies);
	
	const variations = [
		`The current meta is all about ${randomType1}`,
		`${randomType1} is the new meta`,
		`You should force ${randomType1}-${randomType2} in the current meta`,
		`${randomType1} is clearly over the top in the current meta`,
		`Don't listen to the haters, ${randomType1} is the best in the current meta`,
		`Without hesitation, ${randomType1} is the best in the current meta`,
		`${randomType1}-${randomType2} will deliver strong results in this current meta`,
		`${randomType1}-${randomType2} performs exceptionally well in this current meta`,
		`${randomType1}-${randomType2} means victory in this current meta`,
		`${randomType1}-${randomType2} offers remarkably good placements in this current meta`

	];
	const randomVariation =
		variations[Math.floor(Math.random() * variations.length)];
	await interaction.reply(randomVariation);
}
