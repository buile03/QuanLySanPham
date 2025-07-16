module.exports = (query) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "active",
    },
    {
      name: "Hiển thị",
      status: "active",
      class: "",
    },
    {
      name: "Ẩn",
      status: "inactive",
      class: "",
    },
  ];
  if (query.status) {
    const index = filterStatus.findIndex((item) => item.status == query.status);
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }

  return filterStatus;
};
