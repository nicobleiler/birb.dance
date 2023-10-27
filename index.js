const fs = require('mz/fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');
const { Readable } = require('stream');
const colors = require('colors/safe');
const { debug } = require('console');

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
  console.debug("Parsing options:", searchParams.toString());
  let flipped = searchParams.get('flipped');
  let fps = searchParams.get('fps');
  let options = {
    flipped: String(flipped).toLowerCase() === 'true',
    fps: Number(fps) >= 1 ? fps : 24
  }
  console.debug("Options", options);
  return options
};

const validateBirb = (pathname) => {
  console.debug("Checking path for valid birb:", pathname);
  let basePath = pathname.substring(1).split("/")[0];
  let birb;

  if(birbs.includes(basePath)) {
    birb = basePath;
    console.debug("Matched birb, say hello to:", birb);
  } else {
    birb = birbs[0];
    console.debug("Could not match a birb, falling back to:", birb);
  }

  return birb;
};

const server = http.createServer((req, res) => {
  console.groupCollapsed(req.url);
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/healthcheck') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({status: 'ok'}));
  }

  if (
    req.headers &&
    req.headers['user-agent'] &&
    !req.headers['user-agent'].includes('curl')
  ) {
    res.writeHead(302, { Location: 'https://github.com/nicobleiler/birb.dance' });
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

const port = process.env.PARROT_PORT || 3000;
server.listen(port, err => {
  if (err) throw err;
  console.log(`Listening on localhost:${port}`);
});
