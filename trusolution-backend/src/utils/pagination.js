function parsePagination(query = {}) {
  const pageRaw = query.page;
  const limitRaw = query.limit;

  const page = Math.max(1, Number(pageRaw || 1) || 1);
  const limit = Math.max(1, Math.min(50, Number(limitRaw || 20) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
}

module.exports = {
  parsePagination,
};

