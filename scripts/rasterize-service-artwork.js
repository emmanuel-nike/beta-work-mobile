/**
 * Rasterizes the artisan-type service illustrations from SVG to PNG.
 *
 * These illustrations ship as large, detailed 500x500 SVGs (up to ~4MB each)
 * that react-native-svg has to rasterize on the UI thread every time a tile
 * mounts. They are only ever displayed as small thumbnails (56-80pt), so we
 * pre-render them to bitmaps once, at @1x/@2x/@3x, and load them with <Image>.
 *
 * Fidelity: @resvg/resvg-js renders the full viewBox with high-quality
 * anti-aliasing and preserves the alpha channel, so the PNG is a pixel-faithful
 * raster of the vector — nothing is cropped, recoloured, or flattened onto a
 * background. The source files are pure paths + clipPaths (no filters, text,
 * gradients, or embedded rasters), which resvg reproduces exactly.
 *
 * Usage: node scripts/rasterize-service-artwork.js
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const SRC_DIR = path.resolve(__dirname, '../assets/images/artisan-types');
const OUT_DIR = path.resolve(__dirname, '../assets/images/service-artwork');

/**
 * Base display size in points. The tiles render at 56pt (All services) and
 * 80pt (Dashboard); 80 is the larger, so we key the resolutions off it and let
 * downscaling handle the smaller tile. React Native / Metro picks the matching
 * @Nx asset for the device's pixel density automatically.
 */
const BASE_SIZE = 80;
const SCALES = [
  { suffix: '', factor: 1 },
  { suffix: '@2x', factor: 2 },
  { suffix: '@3x', factor: 3 },
];

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    throw new Error(`Source directory not found: ${SRC_DIR}`);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(SRC_DIR)
    .filter(name => name.toLowerCase().endsWith('.svg'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No .svg files found in ${SRC_DIR}`);
  }

  let written = 0;
  for (const file of files) {
    const svg = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
    const base = path.basename(file, '.svg');

    for (const { suffix, factor } of SCALES) {
      const px = BASE_SIZE * factor;
      const resvg = new Resvg(svg, {
        // Scale the 500-unit viewBox down to the target pixel width; the square
        // aspect ratio means height follows. 'zoom' keeps the whole drawing.
        fitTo: { mode: 'width', value: px },
        // Transparent background => alpha preserved, exactly like the SVG.
        background: 'rgba(0, 0, 0, 0)',
        shapeRendering: 2, // geometricPrecision — highest-quality anti-aliasing
        imageRendering: 0, // optimizeQuality
      });
      const png = resvg.render().asPng();
      const outName = `${base}${suffix}.png`;
      fs.writeFileSync(path.join(OUT_DIR, outName), png);
      written += 1;
    }
    process.stdout.write(`  ${base} -> ${SCALES.length} PNGs\n`);
  }

  process.stdout.write(
    `\nDone. Wrote ${written} PNGs for ${files.length} illustrations to\n  ${OUT_DIR}\n`,
  );
}

main();
