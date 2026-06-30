import { spawn } from "node:child_process";
interface ExecResult {
    output: string;
    stderr: string;
    exitCode: number | null;
    signal: string | null;
    runTimeMs: number;
}
    
export function startContainer(workingDirectory: string): Promise<string> {
    return new Promise((resolve, reject) =>{
        
        const docker = spawn("docker", ["run", "--rm", "-d", "-v", `${workingDirectory}:/workspace`, "judgesphere-cpp", "tail", "-f", "/dev/null"])

        let containerId = "";
        docker.stdout.on("data", (data) => {
            containerId += data.toString(); 
        })

        let stderr = "";
        docker.stderr.on("data", (data) => {
            stderr += data.toString();
        })

        docker.on("error", (err) => {
            reject(err);
        });

        docker.on("close", (code) => {
            if(code === 0) {
                resolve(containerId.trim())
            }
            else {
                reject(new Error(stderr || `docker exited with code ${code}`));
            }
        })
    })
}

export function execInContainer(containerId: string, command:string[], input ?: string, timeLimitMs = 1500): Promise<ExecResult> {
    return new Promise((resolve, reject) =>{
        const start = process.hrtime.bigint();
        const docker = spawn("docker", ["exec", "-i", containerId, ...command], {
            timeout: timeLimitMs,
            killSignal: "SIGKILL"
        })
        
        if (input !== undefined) {
            docker.stdin.write(input);
            docker.stdin.end();
        }

        let stdout = "";
        docker.stdout.on("data", (data) => {
            stdout += data.toString();
        })
        
        let stderr = "";
        docker.stderr.on("data", (data) => {
            stderr += data.toString();
        })
        
        docker.on("error", reject);
        
        docker.on("close", (code, signal) => {
            const end = process.hrtime.bigint();
            const runtimeMs = Number(end - start) / 1_000_000;
            
            resolve({
                output: stdout,
                stderr: stderr,
                exitCode: code,
                signal: signal,
                runTimeMs: runtimeMs
            })
        })
    })
}

export function stopContainer(containerId: string): Promise<void>  {
    return new Promise((resolve, reject) => {

        const docker = spawn("docker", ["stop", containerId]);

        let stderr = "";
        docker.stderr.on("data", (data) => {
            stderr += data.toString();
        })
        
        docker.on("error", (err) => {
            reject(err);
        });

        docker.on("close", (code) => {
            if(code === 0) {
                resolve()
            }
            else {
                reject(new Error(stderr.trim() || `Docker exited with code ${code}`));
            }
        })
    })
}