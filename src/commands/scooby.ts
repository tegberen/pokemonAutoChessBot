import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("scooby")
	.setDescription("woof woof");

const episodes = [
	'Season 1 Episode 1 "What a Night for a Knight"',
	'Season 1 Episode 2 "A Clue for Scooby-Doo"',
	'Season 1 Episode 3 "Hassle In the Castle"',
	'Season 1 Episode 4 "Mine Your Own Business"',
	'Season 1 Episode 5 "Decoy for a Dognapper"',
	'Season 1 Episode 6 "What The Hex is Going On"',
	'Season 1 Episode 7 "Never Ape an Ape Man"',
	'Season 1 Episode 8 "Foul Play in Funland"',
	'Season 1 Episode 9 "The Backstage Rage"',
	'Season 1 Episode 10 "Bedlam in the Big Top"',
	'Season 1 Episode 11 "A Gaggle of Galloping Ghosts"',
	'Season 1 Episode 12 "Scooby-Doo and a Mummy Too"',
	'Season 1 Episode 13 "Which Witch Is Which"',
	'Season 1 Episode 14 "Go Away Ghost Ship"',
	'Season 1 Episode 15 "Spooky Space Kook"',
	'Season 1 Episode 16 "A Night of Fright Is No Delight"',
	'Season 1 Episode 17 "That\'s Snow Ghost"',
  
	'Season 2 Episode 1 "Nowhere to Hyde"',
	'Season 2 Episode 2 "Mystery Mask Mix-Up"',
	'Season 2 Episode 3 "Scooby\'s Night With a Frozen Fright"',
	'Season 2 Episode 4 "Jeepers, It\'s the Creeper"',
	'Season 2 Episode 5 "Haunted House Hang-Up"',
	'Season 2 Episode 6 "A Tiki Scare Is No Fair"',
	'Season 2 Episode 7 "Who\'s Afraid of the Big Bad Werewolf?"',
	'Season 2 Episode 8 "Don\'t Fool With a Phantom"'
];

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

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export async function execute(interaction) {
	const randomEpisode = pick(episodes);
	const randomName = pick(names);
	
	const variations = [
    `You remind me of the villain in ${randomEpisode} from the hit 1969 cartoon Scooby Doo Where Are You? <:Scoobymec:1446051156764917951>`,
    `You should watch ${randomEpisode} from the hit 1969 cartoon Scooby Doo Where Are You? <:Scoobymec:1446051156764917951>`,
    `I really dislike ${randomEpisode} from the hit 1969 cartoon Scooby Doo Where Are You? and would not recommend it if you get scared easily <:Scoobymec:1446051156764917951>`,
    `Remember that time when ${randomName} turned out to be the villain in ${randomEpisode} from the hit 1969 cartoon Scooby Doo Where Are You? <:Scoobymec:1446051156764917951>`,
    `You and ${randomName} should get together and have a watch party of the hit 1969 cartoon Scooby Doo Where Are You? <:Scoobymec:1446051156764917951>`,
    `Little known fact, ${randomName} was actually a voice actor in the hit 1969 cartoon Scooby Doo Where Are You? <:Scoobymec:1446051156764917951>`,
    `The Ghost Clown in Season 1 Episode 10 “Bedlam in the Big Top” from the hit 1969 cartoon Scooby Doo Where Are You? May be freaky, but not as freaky as ${randomName} <:Scoobymec:1446051156764917951>`,
    `If ${randomName} were in Season 1 Episode 12 “Scooby-Doo and a Mummy Too” from the hit 1969 cartoon Scooby Doo Where Are You? I think they would make a good looking stone statue! <:Scoobymec:1446051156764917951>`,
    `Season 1 Episode 7 “Never Ape an Ape Man” from the hit 1969 cartoon Scooby Doo Where Are You? May be a terrible episode, but it’s not as terrible as ${randomName}'s gameplay <:Scoobymec:1446051156764917951>`,
    `While Season 1 Episode 15 “Spooky Space Kook” and Season 1 Episode 9 “The Backstage Rage” from the hit 1969 cartoon Scooby Doo Where Are You? May be in the top 3 greatest things ever created, the number one spot obviously goes to ${randomName} <:Scoobymec:1446051156764917951>`,
    `The chase song in Season 2 Episode 4 “Jeepers, It’s the Creeper” from the hit 1969 cartoon Scooby Doo Where Are You? Is titled “I’m In Love With An Ostrich” but for me it would be titled, “I’m In Love With ${randomName}” <:Scoobymec:1446051156764917951>`,
    `I wish ${randomName} and I could go on a romantic get-a-way to the carnival in Season 1 Episode 8 “Foul Play in Funland” from the hit 1969 cartoon Scooby Doo Where Are You? <:Scoobymec:1446051156764917951>`,
    `Redbeard’s Ghost in Season 1 Episode 14 “Go Away Ghost Ship” from the hit 1969 cartoon Scooby Doo Where Are You? Has a pretty good laugh, but even his laugh wouldn’t make me smile as much as ${randomName}'s laugh <:Scoobymec:1446051156764917951>`,
    `You should force ${randomEpisode} from the hit 1969 cartoon Scooby Doo Where Are You? In this meta <:Scoobymec:1446051156764917951>`
	];
	
	const randomVariation = pick(variations);
	await interaction.reply(randomVariation);
}
