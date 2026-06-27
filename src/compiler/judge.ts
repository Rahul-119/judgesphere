import path from "node:path";
import fs from "node:fs";
import { compileCPP } from "./compile.js";
import { run } from "./run.js";
import type { TestCase } from "./types.js";
import type { Verdict } from "./types.js";

export async function judge(sourceFile: string, testCases: TestCase[], workingDirectory: string): Promise<Verdict> {
    await fs.mkdirSync(workingDirectory, {recursive: true})
    
    try {
        const executableName = process.platform === "win32" ? "main.exe" : "main";
        const executablePath = path.join(workingDirectory, executableName);
        const sandboxSource = path.join(workingDirectory, "main.cpp");

        await fs.copyFileSync(sourceFile, sandboxSource);

        const compileResult = await compileCPP(sandboxSource, executablePath);

        if(!compileResult.success) {
            // console.log(compileResult.error);
            return {
                verdict: "CE",
                compileError: compileResult.error
            };
        }

        let runTime = 0;
        for(const testCase of testCases) {
            const result = await run(compileResult.executable, testCase.input);

            if(result.signal === "SIGKILL") {
                return {
                    verdict: "TLE",
                };
            }

            if(result.exitCode !== 0) {
                return {
                    verdict: "RE",
                };
            }

            if(result.output.trim() !== testCase.expectedOutput.trim()) {
                return {
                    verdict: "WA",
                };
            }

            runTime += result.runtimeMs;
        }
        
        return {
            verdict: "AC",
            runTimeMs: runTime
        };
    } finally {
        await fs.rmSync(workingDirectory, {
            recursive: true,
            force: true,
        })
    }
}

const submissionId = "gsknvs1r3234"
const buildDir = path.resolve("sandbox", submissionId);
const sourceFile = path.resolve("src", "playground", "main.cpp");

judge(sourceFile, [{input: "5 6", expectedOutput: "11"}], buildDir)
.then(res => {if (res.verdict === "AC") {
      console.log(res.verdict, res.runTimeMs);
    } else {
      console.log(res.verdict);
    }})
.catch(err => console.log(err))