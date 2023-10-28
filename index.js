const fs = require('mz/fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');
const { Readable } = require('stream');
const colors = require('colors/safe');

// Setup frames in memory
const birbs = ['cockatiel', 'parrot'];
let original = [];
let flipped = [];

const prepareBirbs = () => {
  birbs.forEach(birb => {
    handleBirb(birb);
  })
}

const handleBirb = (birb) => {  
  const framesPath = `frames/${birb}`;
  const files = fs.readdirSync(framesPath);

  original[birb] = files.map((file) => {
    const frame = fs.readFileSync(path.join(framesPath, file));
    return frame.toString();
  });

  flipped[birb] = original[birb].map(f => {
    return f
      .toString()
      .split('')
      .reverse()
      .join('')
  })
}

prepareBirbs();

const colorsOptions = [
  'red',
  'yellow',
  'green',
  'blue',
  'magenta',
  'cyan',
  'white'
];
const numColors = colorsOptions.length;
const selectColor = previousColor => {
  let color;

  do {
    color = Math.floor(Math.random() * numColors);
  } while (color === previousColor);

  return color;
};

const streamer = (stream, opts, birb) => {
  let index = 0;
  let lastColor;
  let frame = null;
  const frames = opts.flipped ? flipped[birb] : original[birb];

  return setInterval(() => {
    // clear the screen
    stream.push('\x1b[2J\x1b[3J\x1b[H');

    const newColor = lastColor = selectColor(lastColor);

    stream.push(colors[colorsOptions[newColor]](frames[index]));

    index = (index + 1) % frames.length;
  }, (1000 / opts.fps));
};

const validateQuery = (searchParams) => {
  console.log("Parsing options:", searchParams.toString());
  let flipped = searchParams.get('flipped');
  let fps = searchParams.get('fps');
  let options = {
    flipped: String(flipped).toLowerCase() === 'true',
    fps: Number(fps) >= 1 && Number(fps) <= 100 ? fps : 24
  }
  console.log("Options", options);
  return options
};

const validateBirb = (pathname) => {
  console.log("Checking path for valid birb:", pathname);
  let basePath = pathname.substring(1).split("/")[0];
  let birb;

  if(birbs.includes(basePath)) {
    birb = basePath;
    console.log("Matched birb, say hello to:", birb);
  } else if(birbs.includes(process.env.DEFAULT_BIRB)) {
    birb = process.env.DEFAULT_BIRB;
    console.log("Could not match a birb, using default:", birb);
  } else {
    birb = birbs[0];
    console.log("Could not match a birb and default birb is faulty, falling back to:", birb);
    console.log(`"DEFAULT_BIRB" is set to "${process.env.DEFAULT_BIRB}", but available birbs are:`, birbs.toString());
  }

  return birb;
};

const server = http.createServer((req, res) => {
  console.groupCollapsed(req.url);
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/healthcheck') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.groupEnd();
    return res.end(JSON.stringify({status: 'ok'}));
  }

  if (!req?.headers['user-agent']?.includes('curl')) {
    res.writeHead(302, { Location: 'https://github.com/nicobleiler/birb.dance' });
    console.groupEnd();
    return res.end();
  }

  const stream = new Readable();
  stream._read = function noop() {};
  stream.pipe(res);
  const interval = streamer(stream, validateQuery(url.searchParams), validateBirb(url.pathname));

  req.on('close', () => {
    stream.destroy();
    clearInterval(interval);
  });
  console.groupEnd();
});

const port = process.env.BIRB_PORT || 80;
const host = process.env.BIRB_HOST || "0.0.0.0";
server.listen(port, host, err => {
  if (err) throw err;
  console.log(`Listening on ${host}:${port}`);
  console.log('Available birbs are:', birbs.toString());
});
