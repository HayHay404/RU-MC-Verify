import { RCON } from "minecraft-server-util";
import { mcStatus } from "../../scripts/mcStatus";

export async function whitelist(username: string) {
  const { isOnline } = await mcStatus();

  if (
    !isOnline ||
    !process.env.MC_SERVER_IP ||
    !process.env.MC_RCON_PORT ||
    !process.env.MC_SERVER_PASSWORD
  ) {
    return false;
  }

  const client = new RCON();

  await client
    .connect(process.env.MC_SERVER_IP, parseInt(process.env.MC_RCON_PORT))
    .then(() => client.login(process.env.MC_SERVER_PASSWORD!))
    .then(() => client.run(`whitelist add ${username}`))
    .then(() => client.close())
    .then(() => console.log("Whitelisted " + username));

  return true;
}
