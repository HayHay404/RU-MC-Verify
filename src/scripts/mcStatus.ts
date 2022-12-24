import { config } from "dotenv";
import * as util from "minecraft-server-util";

config({});

export async function mcStatus(): Promise<{
  isOnline: boolean;
  players: {
    online: number;
    max: number;
    list: string[] | undefined;
  };
}> {
  const options = {
    timeout: 1000,
    enableSRV: true,
  };

  const server: string | undefined = process.env.MC_SERVER_IP;
  const port: string | undefined = process.env.MC_SERVER_PORT;

  if (server && port) {
    try {
      if (await util.status(server, parseInt(port), options)) {
        try {
          const response = await util.queryFull(
            server,
            parseInt(port),
            options
          );
          return { isOnline: true, players: response.players };
        } catch (error) {
          return {
            isOnline: true,
            players: { online: 0, max: 0, list: undefined },
          };
        }
      }
    } catch (error) {
      return { isOnline: false, players: { list: [], online: 0, max: 0 } };
    }
  }

  return { isOnline: false, players: { list: [], online: 0, max: 0 } };
}
