import { spawn } from "node:child_process";
import type { RunResult } from "./types.js";

export function run(executable: string, input: string, timeout = 1500): Promise<RunResult> {
    return new Promise((resolve, reject) => {
        const start = process.hrtime.bigint();

        const run = spawn(executable, {
            timeout: timeout,
            killSignal: "SIGKILL"
        })
        
        run.on("error", (err) => {
            reject(err);
        });
        
        run.stdin.write(input + "\n");
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
            const end = process.hrtime.bigint();
            const runtimeMs = Number(end - start) / 1_000_000;
            
            return resolve({
                output: output,
                error: errorOutput,
                exitCode: code,    
                signal: signal,
                runtimeMs: runtimeMs
            })
        })
    })
}