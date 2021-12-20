import { exec } from "./libs/execute";

const args = ["mocha","'tests/**/*.ts'"]


exec(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', args, undefined, {
    env: {
        TS_NODE_PROJECT: 'tsconfig.tests.json'
    }
});