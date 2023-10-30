import colors from 'colors/safe';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { RequestEvent } from './$types';

const birbs: string[] = ['cockatiel', 'parrot'];
const colorsOptions: string[] = [
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
];

function getRandomColor(previousColor: string =  colorsOptions[0]) {
    let color: string;

    do {
        color = colorsOptions[Math.floor(Math.random() * colorsOptions.length)];
    } while (color === previousColor);
    
    return color;
}

async function getBirbFrames(birb: string) {
    const frames: string[] = [];
    const path: string = `static/frames/${birb}`

    try {
        const files = await readdir(path);
        for (const file of files) {
            const filePath: string = resolve(`${path}/${file}`);
            const contents: string = await readFile(filePath, { encoding: 'utf8' });
            frames.push(contents);
        }            
    } catch (err) {
        console.error(err);
    } 

    return frames;
}

function validateBirb(birb: string): string {  
    if(birbs.includes(birb)) {
        console.log("Matched birb, say hello to:", birb);
    } else if(birbs.includes(import.meta.env.DEFAULT_BIRB)) {
        birb = import.meta.env.DEFAULT_BIRB;
        console.log("Could not match a birb, using default:", birb);
    } else {
        birb = birbs[0];
        console.log("Could not match a birb and default birb is faulty, falling back to:", birb);
        console.log(`"DEFAULT_BIRB" is set to "${import.meta.env.DEFAULT_BIRB}", but available birbs are:`, birbs.toString());
    }
  
    return birb;
};

function getOptions(searchParams: URLSearchParams) {
    console.log("Parsing options:", searchParams.toString());
    const flipped: boolean = searchParams.has("flipped");
    console.log("flipped:", flipped);
    const fps: number = Number(searchParams.get("fps"));
    const options = {
      flipped: flipped,
      fps: (fps >= 1 && fps <= 100) ? fps : 24
    }
    console.log("Options:", options);
    return options;
}

function delay(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
}
  
export function GET(event: RequestEvent) {
    console.log("ClientAddress", event.getClientAddress());
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            const client: string = event.getClientAddress();
            const path: string = (event.url.pathname == "/") ? "" : event.url.pathname;
            let birb: string = event.params.birb ? event.params.birb : "";
            birb = validateBirb(birb);
            const frames: string[] = await getBirbFrames(birb); 
            const search: string = event.url.search;
            const url: string = `${path}${search}`;
            const introText: string = `curl birb.dance${url}`;
            const clearTerminal: string = "\x1b[2J\x1b[3J\x1b[H";
            let color: string = getRandomColor();
            let birbIndex: number = 0;
            const options = getOptions(event.url.searchParams);

            controller.enqueue(encoder.encode(clearTerminal));
            await delay(5);
            controller.enqueue(encoder.encode(`[root@${client} ~] $ `));
            await delay(1000);
            for (const letter of introText) {
                controller.enqueue(encoder.encode(colors["white"](letter)));
                await delay(100)
            }
            await delay(250);

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const frame = frames[birbIndex];
                color = getRandomColor(color);

                controller.enqueue(encoder.encode(clearTerminal));
                await delay(5);
                controller.enqueue(encoder.encode(colors[color](frame)));
                await delay(1000 / options.fps);

                birbIndex = (birbIndex + 1) % frames.length;
            }
        }
    });

    return new Response(readable, {
        headers: {
            'content-type': 'text/event-stream',
        }
    });
}