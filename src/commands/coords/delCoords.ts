import { EmbedBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  CacheType,
  Colors,
  StringSelectMenuBuilder,
} from "discord.js";
import { db } from "../..";

export async function deleteCoords(
  interaction: ChatInputCommandInteraction<CacheType>
) {
  try {
    throw new Error("Not implemented");
  } catch (error) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Error")
          .setDescription("I'm lazy, I'll make this l8r <3")
          .setColor(Colors.Red),
      ],
    });
    return;
  }

  const findUser = await db.user.findUnique({
    where: {
      discordId: interaction.user.id,
    },
  });

  if (!findUser) {
    await interaction.reply({
      content: "You do not have any coords set.",
      ephemeral: true,
    });
    return;
  }

  const allCoords = await db.coords.findMany({
    where: { userId: findUser!.id },
  });

  if (allCoords.length === 0) {
    await interaction.reply({
      content: "You don't have any coords to delete.",
      ephemeral: true,
    });
    return;
  }

  // Create an embed with an option to select a coord to delete
  const embed = new EmbedBuilder()
    .setTitle("Select a coord to delete")
    .setColor(Colors.Gold)
    .setDescription("Select a coord to delete by clicking the reaction below.")
    .addFields(
      allCoords.map((coord, index) => {
        return {
          name: `${index + 1}. ${coord.name}`,
          value: coord.coords,
        };
      })
    );

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("deleteCoords")
    .setPlaceholder("Select a coord to delete")
    .setOptions(
      allCoords.map((coord, index) => {
        return {
          label: coord.name,
          value: index.toString(),
          description: coord.coords,
        };
      })
    );

  await interaction.reply({
    embeds: [embed],
    components: [
      {
        type: 1,
        components: [selectMenu],
      },
    ],
  });

  // Wait for the user to select a coord to delete
  const selectMenuInteraction = await interaction
    .fetchReply()
    .then((message) => {
      return message.createMessageComponentCollector({
        filter: (interaction) => interaction.user.id === interaction.user.id,
        max: 1,
        time: 10000,
      }).next;
    });

  // Delete the coord
  // const coordId = allCoords[parseInt(selectMenuInteraction.value)].id;
  console.log(selectMenuInteraction);
  // await db.coords.delete({
  //     where: {
  //         id: allCoords[parseInt(coordId!.customId)].id
  //     }
  // });

  // await interaction.editReply({
  //     content: "Coord deleted.",
  //     components: []
  // });

  return;
}
