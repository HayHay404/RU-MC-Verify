import { CacheType, ChatInputCommandInteraction, Embed, EmbedBuilder } from "discord.js";
import { db } from "../../index";

export async function setCoords(interaction : ChatInputCommandInteraction<CacheType>) {
    const coords = interaction.options.getString("coords");
    const locationName = interaction.options.getString("name");
    const isPublic = interaction.options.getBoolean("public");
    const discordUser = interaction.user;
    const guild = interaction.guild;

    if (!guild) return;

    // Check if user exists
    const user = await db.user.upsert({
        where: {
            discordId: discordUser?.id
        },
        update: {
            discordId: discordUser?.id!
        },
        create: {
            discordId: discordUser?.id!
        }
    });

    await db.coords.create({
        data: {
            coords: coords!,
            name: locationName!,
            isPublic: isPublic || false,
            user: {
                connectOrCreate: {
                    where: {
                        discordId: user.discordId
                    },
                    create: {
                        discordId: user.discordId,
                    }
                }
            },
            discordServer: {
                connectOrCreate: {
                    create: {
                        serverId: guild.id
                    },
                    where: {
                        serverId: guild.id
                    }
                },
            },
        }
    });

    // Create an embed
    const embed = new EmbedBuilder()
        .setTitle(`Coords Set for ${locationName}`)
        .setDescription(`Your coords have been set to ${coords}`)
        .setColor("Purple")
        .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.avatarURL()!
        });

    await interaction.reply({ embeds: [embed] });
}