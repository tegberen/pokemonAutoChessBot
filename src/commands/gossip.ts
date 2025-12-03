import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("gossip")
	.setDescription("so true");

const types = [
	"torterrable",
	"sandshrew",
	"agentavocado",
	"eeli",
	"moth mad",
	"john rei",
	"cinn",
	"evolto",
	"bigweff",
	"bugsnax",
	"kaploop",
	"nexomaki",
	"seija",
	"thomas wang",
	"fake",
	"grace",
	"goose",
	"spielearmy",
	"vimby",
	"maz",
	"birp",
	"alakadbra",
	"salamander",
	"brother david",

];

export async function execute(interaction) {
	const randomType = types[Math.floor(Math.random() * types.length)];
	const variations = [
		`${randomType} should go live`,
		`Unfortunately ${randomType} got widegrabbed`,
		`You should ask ${randomType} to stop elo sitting`,
		`${randomType} should play more ground`,
		`Don't listen to the haters, ${randomType} will go 9th`,
		`Without hesitation, ${randomType} is the best reroller in the current meta`,
		`${randomType} should drink more water`,
		`${randomType}'s board has the juice.`,
		`${randomType}' is cooking`,
		`We support ${randomType} :cyndaheart: `,
	
	];
	const randomVariation =
		variations[Math.floor(Math.random() * variations.length)];
	await interaction.reply(randomVariation);
}
