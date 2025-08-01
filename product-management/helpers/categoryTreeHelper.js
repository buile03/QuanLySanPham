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

// Hàm tạo cây danh mục cho dropdown menu
function createCategoryTree(arr, parentId = "") {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      const newItem = {
        ...(item.toObject?.() || item),
        id: item._id?.toString() || item.id,
      };
      const children = createCategoryTree(arr, item._id?.toString());
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}

module.exports = {
  createTreeWithIndent,
  createCategoryTree,
};
