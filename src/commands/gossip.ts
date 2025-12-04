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

const pickTwo = (arr) => {
	const first = pick(arr);
	let second = pick(arr);
	while (second === first) {
		second = pick(arr);
	}
	return [first, second];
};

export async function execute(interaction) {
	const randomName = pick(names);
	const [randomSynergy1, randomSynergy2] = pickTwo(synergies);
	const [randomItem1, randomItem2] = pickTwo(items);
	
	const variations = [
		`${randomName} should go live`,
		`Unfortunately ${randomName} got widegrabbed`,
		`You should ask ${randomName} to stop elo sitting`,
		`${randomName} should play more ${randomSynergy1}`,
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
		`${randomName} should build more ${randomItem1}`,
		`${randomName} let the dogs out ... `,
		`Go watch some Scooby Doo ${randomName}`,
		`We saw that ${randomName} ... `,
		`${randomName} tell them, go tell them the truth`,
		`Check out last game from ${randomName}. holey`,
		`${randomName}, do you even build ${randomItem1}`,
		`I miss ${randomName}`,
		`${randomSynergy1} is overrated`,
		`${randomSynergy1} is underrated`,
		`Can we rework ${randomSynergy1} please`,
		`You are my goat, ${randomName} <3`,
		`Swadloon was a 🍃🐛 15 golds Ultra unit with 280 ❤️20 🛡️, 12 SPDEF, 22 ✊, 54 🦵 with a 1-range ability costing 100 🌊 to unleash 60 TRUE damage, 60 SPECIAL Damage, 60 PHYSICAL Damage, totaling 180 Damage before defense calculation, with some Ability Power, swadloon can one shot a highly defensive unit like a 3-stack Groudon. Combined with the absurd item Shiny Charm ✨and some defensive items, Swadloon effectively survive for half of the battle duration it is field in.`,
		`${randomName} knows the sauce`,
		`${randomName} should rethink their ${randomSynergy1} gameplay`,
		`Why are you not dancing ${randomName}?`,
		`${randomName} ..., we need a bigger boat.`,
		`${randomName} stop stealing ${randomSynergy1} portals`,
		`thanks for being you ${randomName} <3`,
		`don't hide, we can see you ${randomName}`,
		`${randomName} for president`,
		`No one does it like ${randomName}`,
		`${randomName} stop eating all the cookies ......`,
		`Not bad ${randomName}, not bad.`,
		`${randomName} should pair ${randomItem1} with ${randomItem2}`,
		`${randomName} should not pair ${randomItem1} with ${randomItem2}`,
		`${randomName} thinks ${randomSynergy1} beats ${randomSynergy2}`,
		`You should try ${randomSynergy1}-${randomSynergy2} boards.`,
		`When in doubt play ${randomSynergy1} or ${randomSynergy2}`,
		`Stop one tricking ${randomSynergy1} and play ${randomSynergy2} instead.`,
		`Your last ${randomSynergy1} game was not da wae. This would not happen with "${randomSynergy2} synergy.`,
		`We believe in ${randomSynergy1} in this household.`,
		`Stop thinking about ${randomSynergy1}, ${randomName}`,
		`Go do some Push-ups ${randomName}!`,
		`No one plays ${randomSynergy1}-${randomSynergy2}, like ${randomName} <:Cinnema:1439722789178179705>`,
		`What was that ${randomName}?? <:OlmecBlush:1441967621544087624>`,
		`Shut up ${randomName}, I love you.`,
		`Calm down ${randomName}, it's just a luck based online browser game.`,
		`${randomName}, you should take pocket monster automatic chess more serious.`,
		`${randomName} is our hero <:Prayge:1428682058896511049>`,
		`${randomName} should win next tournament with ${randomSynergy1}.`
		
	
	];
	const randomVariation =
		variations[Math.floor(Math.random() * variations.length)];
	await interaction.reply(randomVariation);
}
