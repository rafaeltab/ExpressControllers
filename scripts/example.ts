import { exec } from "./libs/execute";

// execute node
exec(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ["ts-node", "example/index.ts"]);
