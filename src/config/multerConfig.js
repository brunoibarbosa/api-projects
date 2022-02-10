import multer, { MulterError } from 'multer';
import { extname, resolve } from 'path';

const random = () => Math.floor(Math.random() * 10000 + 20000);
const arrMimetypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/tiff', 'image/gif', 'image/svg'];

export default {
  fileFilter: (req, file, cb) => {
    if (!arrMimetypes.includes(file.mimetype)) {
      return cb(new MulterError('O arquivo precisa ser do formato PNG, JPEG, WEBP, AVIF, TIFF, GIF ou SVG'));
    }
    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'uploads', 'images', 'projects'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${random()}${extname(file.originalname)}`);
    },
  }),
};
