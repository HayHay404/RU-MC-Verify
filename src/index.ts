import { config } from "dotenv";
import {
  ActivityType,
  ChatInputCommandInteraction,
  Client,
  Interaction,
  StringSelectMenuInteraction,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import { whois } from "./commands/moderator/whois";
import { getCoords } from "./commands/coords/getCoords";
import { setCoords } from "./commands/coords/setCoords";
import { setIGN } from "./commands/link/setIGN";
import { deleteCoords } from "./commands/coords/delCoords";
import { serverInfo } from "./commands/server/serverInfo";
import { mcStatus } from "./scripts/mcStatus";

config(); // Set up dotenv config and get it from root of project

export const db = new PrismaClient(); // Initalize the db orm (prisma) and export it

const client = new Client({ intents: [] }); // Initalize new client, doesn't need intents as not reading messages

(async () => {
  await client.login(process.env.TOKEN);
})(); // Use the token from .env file to login to the bot

// create a presence and refresh it every 5 minutes with the player count
client.on("ready", () => {
  console.log("Bot is ready!");
});

// client.on("guildCreate", (guild) => {
//   db.discordServer.upsert({
//     where: {
//       id: guild.id,
//     },
//     update: {
//       id: guild.id,
//     },
//     create: {
//       id: guild.id,
//     },
// });

async function setPresence() {
  client.user?.setPresence({
    activities: [
      {
        name: `with ${(await mcStatus()).players.online} players`,
        type: ActivityType.Playing,
      },
    ],
    status: "online",
  });
}

client.on("ready", async () => {
  await setPresence();
  setInterval(async () => {
    await setPresence();
  }, 300000);
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
    case "server":
      serverInfo(interaction as ChatInputCommandInteraction);
      break;
    case "ip":
      serverInfo(interaction as ChatInputCommandInteraction);
      break;
    case "coords-set":
      setCoords(interaction as ChatInputCommandInteraction);
      break;
    case "coords-get":
      getCoords(interaction as ChatInputCommandInteraction);
      break;
    case "coords-delete":
      deleteCoords(interaction as ChatInputCommandInteraction);
      break;
    case "info":
      break;

    default:
      break;
  }
});

// client.on("interactionCreate", async (interaction: Interaction) => {
//   if (!interaction.isStringSelectMenu()) return;

//   const customId = interaction.customId;

//   switch (customId) {
//     case "deleteCoords":/
//       deleteCoords(interaction as StringSelectMenuInteraction);
//       break;

//     default:
//       break;
//   }
// }
