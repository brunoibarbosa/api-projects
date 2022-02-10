import multer from 'multer';
import { unlink, unlinkSync } from 'fs';
import { resolve, parse, extname } from 'path';
import sharp from 'sharp';
import multerConfig from '../config/multerConfig';
import ProjectImage from '../models/ProjectImage';
import Project from '../models/Project';

const upload = multer(multerConfig).single('picture');

class ProjectController {
  create(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          errors: [err.code],
        });
      }

      const project = await Project.findByPk(req.body.project_id);
      if (!project) {
        return res.status(400).json({
          errors: ['O projeto não existe'],
        });
      }

      try {
        let filename;
        if (extname(req.file.filename) !== '.webp') {
          filename = `${parse(req.file.filename).name}.webp`;
          await sharp(req.file.path)
            .toFormat('webp')
            .webp({ quality: 100 })
            .toFile(resolve(req.file.destination, filename));
          unlinkSync(req.file.path);
        } else { filename = req.file.filename; }

        const { originalname } = req.file;
        const { description } = req.body;
        const project_id = parseInt(req.body.project_id, 10);
        const favorite = !!parseInt(req.body.favorite, 10);
        const img = await ProjectImage.create({
          originalname, filename, description, project_id, favorite,
        });

        return res.json(img);
      } catch (e) {
        return res.status(400).json({
          errors: e.message,
        });
      }
    });
  }

  async update(req, res) {
    try {
      const image = await ProjectImage.findByPk(req.params.id);

      if (!image) {
        return res.status(400).json({
          errors: ['A imagem não existe'],
        });
      }

      const newDescription = req.body.description;
      const newFavorite = req.body.favorite;
      const newData = await image.update({ description: newDescription, favorite: newFavorite });
      return res.json(newData);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      const image = await ProjectImage.findByPk(req.params.id);

      if (!image) {
        return res.status(400).json({
          errors: ['A image não existe'],
        });
      }

      await image.destroy();
      unlink(resolve(__dirname, '..', '..', 'uploads', 'images', 'projects', image.filename), (err) => {
        if (err) throw err;
      });
      return res.json(image);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new ProjectController();
