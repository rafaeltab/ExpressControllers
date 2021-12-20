import { exec } from "./libs/execute";

const args = ["publish"];
if (!process.argv.includes("private")) {
    args.push(...["--access", "public"])
}

// Publish to npm
exec(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', args);