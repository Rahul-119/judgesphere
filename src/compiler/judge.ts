import type { TestCase } from "../modules/problems/problems.schema.js";
import { compileCPP } from "./compile.js";
import { run } from "./run.js";
import type { Verdict } from "./types.js";

export async function judge(sourceFile: string, testCases: TestCase[]): Promise<Verdict> {
    const compileResult = await compileCPP(sourceFile);

    if(!compileResult.success) {
        return {
            verdict: "CE",
            compileError: compileResult.error
        };
    }

    for(const testCase of testCases) {
        const result = await run(compileResult.executable, testCase.input, 1500);

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
    }

    return {
        verdict: "AC",
    };
}
