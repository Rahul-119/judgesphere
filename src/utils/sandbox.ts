import fs from "node:fs"
import path from "node:path";
import type { languageEnum } from "../db/schema/submissions.js";
type Language = typeof languageEnum.enumValues[number];

export function createSandbox(submissionId: string) {
    const sandboxDir = path.resolve("sandbox", submissionId);
    fs.mkdirSync(sandboxDir, {recursive : true});

    return sandboxDir;
}

export function writeSourceCode(sourceCode: string, workingDirectory: string, language: Language) {

    let filePath = "";
    switch (language) {
        case "CPP":
            filePath = path.join(workingDirectory, "main.cpp");
            break;
        case "JAVA":
            filePath = path.join(workingDirectory, "Main.java");
            break;
        case "PYTHON":
            filePath = path.join(workingDirectory, "main.py");
            break;
        case "JAVASCRIPT":
            filePath = path.join(workingDirectory, "main.js");
            break;
        default:
            throw new Error(`Unsupported language: ${language}`);
    }

    fs.writeFileSync(filePath, sourceCode);

    return filePath;
}

export function deleteSandbox(workingDirectory: string) {
    fs.rmSync(workingDirectory, {recursive : true, force: true});
}