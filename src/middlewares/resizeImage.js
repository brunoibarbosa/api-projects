import { join } from 'path';
import sharp from 'sharp';
import mime from 'mime-types';

function limitNumberToRange(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function parseResizingURI(uri) {
  const matches = uri.match(/(?<path>.*\/)(?<name>[^]+)_(?<width>\d+)x(?<height>\d+)(?<extension>\.[a-z\d]+)$/i);

  if (matches) {
    const {
      name, width, height, extension,
    } = matches.groups;
    return {
      path: `/images/projects/${name}${extension}`,
      width: limitNumberToRange(+width, 16, 2000),
      height: limitNumberToRange(+height, 16, 2000),
      extension,
    };
  }
  return false;
}

async function resizeImage(path, width, height) {
  return sharp(path).resize({
    width,
    height,
    fit: sharp.fit.inside,
  }).toBuffer();
}

export default async (req, res, next) => {
  const data = parseResizingURI(req.baseUrl);
  if (!data) { return next(); }
  const path = join(__dirname, '..', '..', 'uploads', data.path);

  const image = await resizeImage(path, data.width, data.height);
  res.set('Content-type', mime.lookup(path));
  res.send(image);
  return next();
};
