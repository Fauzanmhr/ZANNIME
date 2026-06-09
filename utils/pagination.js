export const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const paginate = (items = [], { page = 1, limit = 20 } = {}) => {
  const currentPage = parsePositiveInt(page, 1);
  const perPage = parsePositiveInt(limit, 20);
  const totalPages = Math.ceil(items.length / perPage);
  const startIndex = (currentPage - 1) * perPage;

  return {
    results: items.slice(startIndex, startIndex + perPage),
    currentPage,
    totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };
};
