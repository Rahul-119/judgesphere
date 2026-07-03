import { execInContainer, startContainer, stopContainer } from "./docker.js";
import type { TestCase } from "./types.js";
import type { VerdictStatus } from "../db/schema/submissions.js";

type ExecResult =
  | {
      verdict: VerdictStatus;
      runTimeMs: number;
	  passedTestCases: number;
    }
  | {
      verdict: VerdictStatus;
	  runTimeMs: number;
	  passedTestCases: number;
      error: string;
    };

	
export async function execCPP(workingDirectory: string, testCases: TestCase[]): Promise<ExecResult> {
	const containerId = await startContainer(workingDirectory);
	try {
		const compiledResult = await execInContainer(containerId, [
			"g++",
			"/workspace/main.cpp",
			"-std=c++17",
            "-O2",
            "-pipe",
			"-o",
			"/workspace/main",
		]);

		if (compiledResult.exitCode !== 0) {
            return {
                verdict: "CE",
				runTimeMs: 0,
				passedTestCases: 0,
                error: compiledResult.stderr,
            };
		}

		const result = await runCPP(
			containerId,
			testCases,
		);

		return result;
	} finally {
		await stopContainer(containerId);
	}
}

export async function runCPP(
	containerId: string,
	testCases: TestCase[],
): Promise<ExecResult> {
	let totalRunTimeMs = 0;
    
	let passed = 0;
	for (const testCase of testCases) {
		const result = await execInContainer(
			containerId,
			["/workspace/main"],
			testCase.input,
		);

		totalRunTimeMs += result.runTimeMs;

		if (result.signal === "SIGKILL") {
			return {
                verdict: "TLE",
                runTimeMs: totalRunTimeMs,
				passedTestCases: passed
            };
		}

		if (result.exitCode !== 0) {
			return {
                verdict: "RE",
                runTimeMs: totalRunTimeMs,
				passedTestCases: passed
            };
		}

		if (result.output.trim() !== testCase.expectedOutput.trim()) {
			return {
                verdict: "WA",
                runTimeMs: totalRunTimeMs,
				passedTestCases: passed
            };
		}

		passed++;
	}

	return {
		verdict: "AC",
		runTimeMs: totalRunTimeMs,
		passedTestCases: passed
	};
}
