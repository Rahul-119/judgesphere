import { spawn } from "node:child_process";
import type { RunResult } from "./types.js";

export function run(executable: string, input: string, timeout?: number): Promise<RunResult> {
    return new Promise((resolve, reject) => {
        const run = spawn(executable, {
            timeout: timeout,
            killSignal: "SIGKILL"
        })
        
        run.on("error", (err) => {
            console.log(err);
        });

        run.stdin.write(input);
        run.stdin.end();

        let output = "";
        run.stdout.on('data', (chunk) => {
            output += chunk.toString();
        })

        let errorOutput = "";
        run.stderr.on('data', (chunk) => {
            errorOutput += chunk.toString();
        })

        run.on("close", (code, signal) => {
            return resolve({
                output: output,
                error: errorOutput,
                exitCode: code,    
                signal: signal
            })
        })
    })
}