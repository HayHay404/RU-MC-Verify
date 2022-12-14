import { Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { config } from "dotenv";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Sends an email to your scarletmail with a code to input")
    .addStringOption((option) =>
      option.setName("netid").setDescription("Your netid").setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code sent to your email")
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("minecraft")
    .setDescription("Links your minecraft username to your netid")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Your minecraft username")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("optout")
    .setDescription("Remove all your data from the database"),

  new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get a user's netid and minecraft username")
    .addStringOption((option) =>
      option
        .setName("netid")
        .setDescription("Gets a user based off their netid")
    )
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Gets a user based off their minecraft username")
    )
    .addMentionableOption((option) =>
      option
        .setName("discord")
        .setDescription("Gets a user based off their Discord username")
    ),

  new SlashCommandBuilder()
    .setName("coords-set")
    .setDescription("Set your coords")
    .addStringOption((option) =>
      option
        .setName("coords")
        .setDescription("Your coords")
        .setRequired(false)
    ),
  
  new SlashCommandBuilder()
    .setName("coords-get")
    .setDescription("Get your coords")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get coords for")
        .setRequired(false)
    ),
];

config();
const token: string = process.env.TOKEN as string;
const rest = new REST({ version: "10" }).setToken(token);
(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID as string),
      { body: [] }
    );

    try {
      console.log("Started refreshing application (/) commands.");
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID as string),
        { body: commands }
      );
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
    throw Error("Could not delete commands.");
  }
})();
