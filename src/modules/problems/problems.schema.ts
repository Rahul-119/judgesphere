import z from "zod";

export const problemSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	inputFormat: z.string(),
	outputFormat: z.string(),
	constraints: z.string(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    timeLimitMs: z.number().positive(),
    memoryLimitMb: z.number().positive(),
    problemExamples: z.array(
        z.object({
            input: z.string(),
            output: z.string(),
            explanation: z.string().optional()
        })
    ).min(1),
    testCases: z.array(
        z.object({
            input: z.string(),
            expectedOutput: z.string(),
            isHidden: z.boolean()
        })
    ).min(1)
});

export type ProblemInput = z.infer<typeof problemSchema>;
export type ProblemExample = ProblemInput["problemExamples"][number];
export type TestCase = ProblemInput["testCases"][number];