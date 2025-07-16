// - Chọn tất cả các phần tử có thuộc tính 'button-status'
// - Nếu tồn tại ít nhất một nút lọc trạng thái với thực hiện
//   - Tạo 1 đối tượng URL dựa trên đường dẫn hiện tại
//   - Lặp qua từng nút trạng thái
//     -Gán sự kiện click cho mỗi nút
//       - Lấy giá trị của thuộc tính 'button-status' từ nút được click
//       - Nếu có giá trị 'status', cập nhật trong URL
//       - Nếu không có (lọc tất cả) xóa 'status' khỏi url

//     - Điều hướng trình duyệt tới url mới, sẽ reload lại trang

const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    });
  });
}

// Tìm kiếm
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // chặn sự kiện mặt định ngăn load lại trang
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']");

  // Xử lý sự kiện khi click vào checkbox "Chọn tất cả"
  inputCheckAll.addEventListener("change", () => {
    inputIds.forEach((input) => {
      input.checked = inputCheckAll.checked;
    });
  });

  // Xử lý sự kiện khi click vào các checkbox item
  inputIds.forEach((input) => {
    input.addEventListener("change", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      // Cập nhật trạng thái của checkbox "Chọn tất cả"
      inputCheckAll.checked = countChecked === inputIds.length;
    });
  });
}
// End Checkbox Multi

// Form Chang Multi
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", function handleSubmit(e) {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    if (inputChecked.length > 0) {
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      const inputRedirect = formChangeMulti.querySelector(
        "input[name='redirect']"
      );

      // Gán danh sách ID
      let ids = [];
      inputChecked.forEach((input) => ids.push(input.value));
      inputIds.value = ids.join(",");

      // Gán giá trị redirect về URL hiện tại
      inputRedirect.value = window.location.pathname + window.location.search;

      // 👉 Gỡ bỏ event để tránh lặp submit sau khi gọi lại
      formChangeMulti.removeEventListener("submit", handleSubmit);
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi");
    }
  });
}

// End Form Chang Multi
