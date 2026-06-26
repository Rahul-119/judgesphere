export type CompileResult =
	| {
			success: true;
			executable: string;
	  }
	| {
			success: false;
			error: string;
	  };

export interface TestCase {
    input: string;
    expectedOutput: string;
}

export interface RunResult {
    output: string;
    error: string;
    exitCode: number | null;
    signal: string | null;
}

export type Verdict =
    | { verdict: "AC" }
    | { verdict: "WA" }
    | { verdict: "RE" }
    | { verdict: "TLE" }
    | {
          verdict: "CE";
          compileError: string;
      };