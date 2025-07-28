function createTreeWithIndent(arr, parentId = "", indent = 0) {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      const newItem = {
        ...(item.toObject?.() || item),
        id: item._id?.toString() || item.id,
        indent,
      };
      const children = createTreeWithIndent(
        arr,
        item._id?.toString(),
        indent + 1
      );
      tree.push(newItem, ...children);
    }
  });
  return tree;
}

module.exports = {
  createTreeWithIndent,
};
