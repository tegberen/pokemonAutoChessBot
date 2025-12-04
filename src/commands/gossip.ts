import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("gossip")
	.setDescription("so true");

const names = [
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
	"alakadabra",
	"salamander",
	"brother david",
	"exeatop",
	"5g_arty",
	"eelmaz torcado smithbald papelson cinnang weffberg",
	"waterelle",
	"birdlives",
	"spanishcrow",
	"katbor",
];

const synergies = [
  "normal", "grass", "fire", "water", "electric", "fighting", 
  "psychic", "dark", "steel", "ground", "poison", "dragon", 
  "field", "monster", "human", "aquatic", "bug", "flying", 
  "flora", "rock", "ghost", "fairy", "ice", "fossil", "sound", 
  "artificial", "light", "wild", "baby", "amorphous"
];


const items = [
  "Reapers Cloth", "Ability Shield", "Nomicon", "Powerlens", "Heavy Duty Boots", 
  "Souldew", "Stones", "X-Ray", "Razor Fang", "Gracidae", "Punching Gloves", 
  "Loaded Dice", "Muscle Band", "Blue Orb", "Smokeball", "Razor Claw", 
  "Widelens", "Fluffy Tail *cough* Goggles", "Scope Lens", "Max Revive", "Sticky Barb", 
  "Star Dust", "Flame Orb", "Deep Sea Tooth", "Green Orb", "Pokedoll", 
  "Rocky Helmet", "AV", "Shiny Charm", "Shell Bell", "Protective Pads", "King's Rock", 
  "Aqua Egg"
];


const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export async function execute(interaction) {
	const randomName = pick(names);
	const randomSynergy = pick(synergies);
	const randomItem = pick(items);
	
	const variations = [
		`${randomName} should go live`,
		`Unfortunately ${randomName} got widegrabbed`,
		`You should ask ${randomName} to stop elo sitting`,
		`${randomName} should play more ${randomSynergy}`,
		`Listen to the haters, ${randomName} will go 9th`,
		`Without hesitation, ${randomName} is the best reroller in the current meta`,
		`${randomName} should drink more water`,
		`${randomName}'s board has the juice.`,
		`${randomName} is cooking`,
		`We support ${randomName} <:cyndaheart:1416512341213843518> `,
		`Pharaos curse: Red Gary for ${randomName}`,
		`${randomName} should make more Wonderbox`,
		`${randomName} should psycholevel to 5 at stage 6`,
		`${randomName} should write a guide`,
		`${randomName} should join afk lobbies`,
		`${randomName} should stop rolling`,
		`${randomName} has no angle`,
		`${randomName} is just awesome`,
		`${randomName} bribed curry`,
		`${randomName} bribed keldaan`,
		`${randomName} is fucking broke`,
		`${randomName} played too much and needs a break`,
		`Hold the phone, ${randomName}.`,
		`${randomName} should build more ${randomItem}`,
		`${randomName} let the dogs out ... `,
		`Go watch some Scooby Doo ${randomName}`,
		`We saw that ${randomName} ... `,
		`${randomName} tell them, go tell them the truth`,
		`Check out last game from ${randomName}. holey`,
		`${randomName}, do you even ${randomItem}`,
		`I miss ${randomName}`,
		`${randomSynergy} is overrated`,
		`Can we rework ${randomSynergy} please`,
		`You are my goat, ${randomName} <3`,
		`Swadloon was a 🍃🐛 15 golds Ultra unit with 280 ❤️20 🛡️, 12 SPDEF, 22 ✊, 54 🦵 with a 1-range ability costing 100 🌊 to unleash 60 TRUE damage, 60 SPECIAL Damage, 60 PHYSICAL Damage, totaling 180 Damage before defense calculation, with some Ability Power, swadloon can one shot a highly defensive unit like a 3-stack Groudon. Combined with the absurd item Shiny Charm ✨and some defensive items, Swadloon effectively survive for half of the battle duration it is field in.`,
		`${randomName} knows the sauce`,
		`${randomName} should rethink their ${randomSynergy} gameplay`,
		`Why are you not dancing ${randomName}?`,
		`${randomName} ..., we need a bigger boat.`,
		`${randomName} stop stealing ${randomSynergy} portals`,
		`thanks for being you ${randomName} <3`,
		`don't hide, we can see you ${randomName}`,
		`${randomName} for president`,
		
	
	];
	const randomVariation =
		variations[Math.floor(Math.random() * variations.length)];
	await interaction.reply(randomVariation);
}
