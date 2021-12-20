import { spawn, SpawnOptions } from "child_process";

export function exec(command: string, args: readonly string[] = [], callback?: (code: number | null) => void, options?: SpawnOptions) {
    const spRet = spawn(command, args, {
        windowsHide: true,
        stdio: "inherit",
        ...options
    });
    spRet.on('close', (code) => {
        if (callback) callback(code);
    })
}

export function execAsync(command: string, args: readonly string[] = [], options?: SpawnOptions): Promise<number | null> {
    return new Promise((resolve) => {
        exec(command, args, (code) => {
            resolve(code);
        }, options);
    });
}