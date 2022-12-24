import { RCON, } from "minecraft-server-util";
import { mcStatus } from "../../scripts/mcStatus";

export async function whitelist(username : string) {
    const isOnline = await mcStatus();

    if (!isOnline) {
        return false;
    }



}