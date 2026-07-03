export function parsePagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function buildPaginatedResponse(rows, count, { page, limit }) {
  const totalPages = Math.ceil(count / limit) || 1;
  return {
    data: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
