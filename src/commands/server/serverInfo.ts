import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction, Colors } from "discord.js";
import { config } from "dotenv";
import { mcStatus } from "../../scripts/mcStatus";

config({});

export async function serverInfo(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const ip = process.env.MC_SERVER_IP || "not set";
  const port = process.env.MC_SERVER_PORT || "not set";
  const version = process.env.MC_SERVER_VERSION || "not set";
  const { isOnline, players } = await mcStatus();
  let { max, online } = players;
  if (players.list === undefined) {
    max = 0;
    online = 0;
  }
  const embed = new EmbedBuilder()
    .setTitle("Server Info")
    .addFields(
      { name: "Server IP", value: ip },
      { name: "Server Port", value: port },
      { name: "Server Version", value: version },
      { name: "Server Status", value: isOnline ? "Online" : "Offline" },
      { name: "Players Online", value: isOnline ? online.toString() : "0" },
      { name: "Max Players", value: isOnline ? max.toString() : "0" },
      {
        name: "Current online players",
        value:
          isOnline && players.list !== undefined
            ? players.list!.join(", ")
            : "N/A",
      }
    )
    .setColor(Colors.Purple)
    .setTimestamp();

  interaction.reply({ embeds: [embed] });
}
