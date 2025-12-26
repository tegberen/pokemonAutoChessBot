import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import Mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import http from 'http';
import { cleanupFocusModeSessions } from './utils/focusCleanup';

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
    	GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
	],
}) as ClientWithCommands;

if (process.env.MONGO_URI) {
  Mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB not connected:', err.message));
} else {
  console.log('Skip Mongo');
}

interface ClientWithCommands extends Client {
	commands: Collection<string, any>;
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(__dirname.includes("build") ? "js" : ".ts"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, async () => {
	console.log("Ready!");
	await cleanupFocusModeSessions(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(process.env.BOT_TOKEN);

// simple http server?
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Discord bot works?!');
});

server.listen(PORT, () => {
  console.log(` ... running on port ${PORT}`);
});