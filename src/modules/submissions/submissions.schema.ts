import z from "zod";

export const submissionSchema = z.object({
  problemPublicId: z.uuid(),
  sourceCode: z.string(),
  language: z.enum(['CPP', 'JAVA', 'PYTHON', 'JAVASCRIPT']),
});

export type submissionInput = z.infer<typeof submissionSchema>;