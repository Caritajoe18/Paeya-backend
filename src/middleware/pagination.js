import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';

export function paginate(model, options = {}) {
  return async (req, res, next) => {
    try {
      const { page, limit, offset } = parsePagination(req.query);
      const { rows, count } = await model.findAndCountAll({
        ...options,
        where: { ...options.where },
        offset,
        limit,
        order: options.order || [['createdAt', 'DESC']],
      });

      res.json(buildPaginatedResponse(rows, count, { page, limit }));
    } catch (err) {
      next(err);
    }
  };
}
