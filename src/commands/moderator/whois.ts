import { ChatInputCommandInteraction, CacheType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, EmbedBuilder, GuildMember, TeamMember, User } from "discord.js";
import { db } from "../..";
import isValidnetID from "../../scripts/isValidNetID";
import { mcToUUID, uuidToMC } from "../../scripts/mcuuid/mcUUID";

enum TYPES {
    DISCORD,
    MINECRAFT,
    NETID
}

export async function whois(interaction: ChatInputCommandInteraction<CacheType>) {
    let id : string;
    let option : TYPES;

    const discordId = interaction.options.get("discord")?.user || interaction.user;
    const mcUsername = interaction.options.getString("username");
    const netId = interaction.options.getString("netid")?.toString();

    const hasPerms = interaction.memberPermissions?.has("ModerateMembers") 
    || interaction.memberPermissions?.has("Administrator") 
    || interaction.memberPermissions?.has("ManageGuild");


    if (discordId !== undefined && (discordId?.id !== interaction.user.id || !hasPerms)) {
        await interaction.reply({
            ephemeral: true,
            content: "You do not have permission to view others' info."
        });
        return;
    }

    if (discordId) {
        id = discordId.id;
        option = TYPES.DISCORD;
    } else if (mcUsername) {
        try {
            id = await mcToUUID(mcUsername)
            option = TYPES.MINECRAFT;
        } catch (error) {
            console.log("Error getting UUID: ", error);
            await interaction.reply({
                ephemeral: true,
                content: "Could not get the UUID. Try again later."
            });
            return;
        }
    } else if (netId) {
        id = netId;
        if (!isValidnetID(id)) {
            await interaction.reply({
                ephemeral: true,
                content: "Not a valid NetID."
            });
            return;
        }
        option = TYPES.NETID;
    } else {
        await interaction.reply({
            ephemeral: true,
            content: "Please tag a user, input a minecraft username, or a netid."
        });
        return;
    }

    let whereClause;
    if (option == TYPES.NETID) {
        whereClause = {netid: id};
    } else if (option == TYPES.DISCORD) {
        whereClause = {discordId: id};
    } else if (option == TYPES.MINECRAFT) {
        whereClause = {mcuuid: id};
    }

    const user = await db.user.findFirst({where: whereClause});

    if (!user) {
        await interaction.reply({
            ephemeral: true,
            content: "Couldn't find this user in the database."
        });
        return;
    }


    const embed = new EmbedBuilder()
        .setTitle(`Whois for ${discordId?.tag || mcUsername || netId}`)
        .setColor("Purple")
        .setAuthor({
            name: discordId?.tag as string,
            iconURL: discordId?.avatarURL()!,
        })
        .addFields(
            {name: "Minecraft Username", value: mcUsername || "Not set"},
            {name: "NetID", value: user.netid || "Not set"},
        );


    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
    return;
}