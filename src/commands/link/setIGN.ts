import { CacheType, ChatInputCommandInteraction, InteractionType } from "discord.js";
import { db } from "../../index";
import { mcToUUID } from "../../scripts/mcuuid/mcUUID";
import { whois } from "../moderator/whois";
import { serverInfo } from "../server/serverInfo";
import { whitelist } from "./autoWhitelist";

export async function setIGN(interaction : ChatInputCommandInteraction<CacheType>) {
    const ign = interaction.options.getString("username")!;
    const discordUser = interaction.user;

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

    let uuid : string;
    try {
        uuid = await mcToUUID(ign);
    } catch (error) {
        console.log(error)
        await interaction.reply({
            content: "Invalid IGN",
            ephemeral: true
        });
        return;
    }

    await db.user.upsert({
        where: {
            discordId: discordUser?.id
        },
        update: {
            discordId: discordUser?.id!,
            mcuuid: uuid,
        },
        create: {
            discordId: discordUser?.id!,
            mcuuid: uuid,
        }
    });


    if (!serverInfo) {
        await interaction.reply({
            content: "Information set successfully, but something went wrong with the whitelist... Contact an admin.",
            ephemeral: true
        });
        return;
    }

    await whitelist(ign);

    return whois(interaction);
}