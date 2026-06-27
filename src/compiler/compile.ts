import { spawn } from "node:child_process";
import type { CompileResult } from "./types.js";

export function compileCPP(sourceFile: string, executablePath: string): Promise<CompileResult> {
    return new Promise((resolve, reject) => {
        const cpp = spawn('g++',[sourceFile, "-std=c++17","-o","main"])

        let errorOutput = "";
        cpp.stderr.on("data", (data) => {
            errorOutput += data.toString();
        })
        
        cpp.on("error", (err) => {
            reject(err)
        })
        
        cpp.on("close", (code) => {
            if(code !== 0) {
                resolve({
                    success: false,
                    error: errorOutput
                })
            }
            else {
                resolve({
                    success: true,
                    executable: "./main.exe"
                })
            }
        })
    })
}