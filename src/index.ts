import { config } from "dotenv";
import { ChatInputCommandInteraction, Client, Interaction } from "discord.js";
import { PrismaClient } from "@prisma/client";
import { whois } from "./commands/moderator/whois";
import { getCoords } from "./commands/coords/getCoords";
import { setCoords } from "./commands/coords/setCoords";
import { setIGN } from "./commands/link/setIGN";

config(); // Set up dotenv config and get it from root of project

export const db = new PrismaClient(); // Initalize the db orm (prisma) and export it

const client = new Client({ intents: [] }); // Initalize new client, doesn't need intents as not reading messages

(async () => {
  await client.login(process.env.TOKEN);
})(); // Use the token from .env file to login to the bot

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  // Check if the interaction is a command and then reply if the command is "ping"
  if (!interaction.isCommand()) return; // If the interaction isn't a command, return (stop the function

  const command = interaction.commandName; // Get the command name from the interaction

  if (command === "ping") {
    await interaction.reply("pong");
  }
  switch (command) {
    case "whois":
      whois(interaction as ChatInputCommandInteraction);
      break;
    case "minecraft":
      setIGN(interaction as ChatInputCommandInteraction);
      break;
    case "coords-set":
      setCoords(interaction as ChatInputCommandInteraction);
      break;
    case "coords-get":
      getCoords(interaction as ChatInputCommandInteraction);
      break;
    
    default:
      break;
  }
});
