import { NotFoundError } from '../utils/errors.js';
import initializeModels from '../models/index.js';

const { Category } = initializeModels();

export async function listCategories(req, res, next) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) throw new NotFoundError('Category');
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await Category.create({ name: req.body.name });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) throw new NotFoundError('Category');
    await category.update({ name: req.body.name });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}
