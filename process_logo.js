const Jimp = require('jimp');

async function processImage() {
  const imagePath = String.raw`C:\Users\User\.gemini\antigravity\brain\0467c6f0-3e8a-4469-83e2-58a952434746\media__1774506483603.png`;
  const img = await Jimp.read(imagePath);
  
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  
  const isWhite = (c) => {
      const rgba = Jimp.intToRGBA(c);
      return rgba.r > 230 && rgba.g > 230 && rgba.b > 230 && rgba.a > 50;
  };
  
  const visited = new Set();
  const queue = [];
  
  const startPoints = [[0,0], [w-1,0], [0,h-1], [w-1,h-1]];
  for (const [sx, sy] of startPoints) {
      if (isWhite(img.getPixelColor(sx, sy))) {
          queue.push([sx, sy]);
          visited.add(`${sx},${sy}`);
      }
  }
  
  while (queue.length > 0) {
      const [x, y] = queue.shift();
      img.setPixelColor(0x00000000, x, y); // transparent
      
      const neighbors = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
      for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const key = `${nx},${ny}`;
              if (!visited.has(key)) {
                  visited.add(key);
                  if (isWhite(img.getPixelColor(nx, ny))) {
                      queue.push([nx, ny]);
                  }
              }
          }
      }
  }
  
  await img.writeAsync('public/icon.png');
  await img.writeAsync('src/app/icon.png');
  console.log('Processing complete!');
}

processImage().catch(console.error);
