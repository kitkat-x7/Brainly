const { spawn } = require('child_process');
export async function AIquery(query:string) {
    return new Promise<string>((resolve, reject) => {
        const python = spawn('python', ['C:/Users/Kaustav/OneDrive/Desktop/TS_SD/dist/controllers/Query.py',query]);
        let output = '';
        let errorOutput = '';
        python.stdout.on('data', (data:any) => {
            output += data.toString();
        });
        python.stderr.on('data', (data:any) => {
            errorOutput += data.toString();
        });
        python.on('close', (code:any) => {
            if (code !== 0) {
                reject(`Process exited with code ${code} \n Error Output:\n${errorOutput}`);
            } else {
                resolve(output.trim());
            }
        });
    })
}