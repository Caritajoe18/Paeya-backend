import { v2 as cloudinary } from 'cloudinary';
import { NotFoundError } from '../utils/errors.js';
import initializeModels from '../models/index.js';
import config from '../config/index.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const { Product } = initializeModels();

export async function listProducts(req, res, next) {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) throw new NotFoundError('Product');
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    let photo = req.body.photo;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'nomba/products',
      });
      photo = result.secure_url;
    }

    const product = await Product.create({ ...req.body, photo });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) throw new NotFoundError('Product');

    let photo = req.body.photo;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'nomba/products',
      });
      photo = result.secure_url;
    }

    await product.update({ ...req.body, ...(photo && { photo }) });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}
