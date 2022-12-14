import {
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import { db } from "../..";

export async function getCoords(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  const isPublic = interaction.options.getBoolean("public");
  const getUser = interaction.options.getUser("user") || interaction.user;
  const guild = interaction.guild;

  if (!guild) return;

  let embed: EmbedBuilder = new EmbedBuilder();

  if (isPublic) {
    const coords = await db.coords.findMany({
      where: {
        discordServer: {
          serverId: guild.id,
        },
        isPublic: true,
      },
    });

    embed
      .setTitle("Public Coords")
      .setDescription("List of public coords accessible for the server")
      .setColor("Purple");

    embed.addFields(
      coords.map((coord) => {
        return {
          name: coord.name,
          value: coord.coords,
        };
      })
    );
  }

  if (getUser && !isPublic) {
    const user = await db.user.findUnique({
      where: {
        discordId: getUser.id,
      },
    });

    if (!user) {
      interaction.reply({
        content: "User not found",
        ephemeral: true,
      });
      return;
    }

    const coords = await db.coords.findMany({
      where: {
        discordServer: {
          serverId: guild.id,
        },
        user: {
          discordId: user.discordId,
        },
      },
    });

    embed
      .setTitle(`Coords for ${getUser.tag}`)
      .setColor("Purple")
      .setAuthor({
        name: interaction.user.tag
      });

    embed.addFields(
      coords.map((coord) => {
        return {
          name: coord.name,
          value: coord.coords,
        };
      })
    );
  }

  await interaction.reply({
    embeds: [embed],
  });

  return;
}
