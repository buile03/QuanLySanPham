module.exports = (currentPageQuery, totalItems, limit = 10) => {
  const currentPage =
    parseInt(currentPageQuery) > 0 ? parseInt(currentPageQuery) : 1;
  const totalPage = Math.ceil(totalItems / limit);
  const skip = (currentPage - 1) * limit;

  return {
    currentPage,
    totalPage,
    limit,
    skip,
  };
};
