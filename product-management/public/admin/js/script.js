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
