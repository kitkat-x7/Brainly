const { spawn } = require('child_process');

export async function create_embeddings(id:number,Data:string) {
    return new Promise<string>((resolve, reject) => {
        const python = spawn('python', ['C:/Users/Kaustav/OneDrive/Desktop/TS_SD/dist/controllers/Embeddings.py',id,Data]);
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
                reject(`Process exited with code ${code}\nError Output:\n${errorOutput}`);
            } else {
                resolve(output.trim());
            }
        });
    })
}

export async function update_embeddings(id:number,Data:string) {
    return new Promise<string>((resolve, reject) => {
        const python = spawn('python', ['C:/Users/Kaustav/OneDrive/Desktop/TS_SD/dist/controllers/Update_Embeddings.py',id,Data]);
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
                reject(`Process exited with code ${code}\nError Output:\n${errorOutput}`);
            } else {
                resolve(output.trim());
            }
        });
    })
}