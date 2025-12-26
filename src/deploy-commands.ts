import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "path";

dotenv.config();

const commands = new Array<any>();
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
	.readdirSync(path.join(__dirname, "commands"))
	.filter((file) => file.endsWith(".js"));

async function readFolder() {
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		console.log(path.join(__dirname, "commands", file));
		const command = require(path.join(__dirname, "commands", file));
		commands.push(command.data.toJSON());
	}
}

async function register() {
	// Construct and prepare an instance of the REST module
	const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

	const serverIds = [
		process.env.SERVER_TOKEN1!,
		process.env.SERVER_TOKEN2!
	];
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);
		for (const serverId of serverIds) {
			const data = (await rest.put(
				Routes.applicationGuildCommands(
					process.env.CLIENT_TOKEN!,
					serverId
				),
				{ body: commands },
			)) as any;

			console.log(
				`Successfully reloaded ${data.length} application (/) commands.`,
			);
		}
		// The put method is used to fully refresh all commands in the guild with the current set

	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}

async function main() {
	await readFolder();
	await register();
}

main();
