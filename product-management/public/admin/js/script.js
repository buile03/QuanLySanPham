document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------
  // Filter theo trạng thái
  // ---------------------------
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

  // ---------------------------
  // Tìm kiếm sản phẩm
  // ---------------------------
  const formSearch = document.querySelector("#form-search");
  if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = e.target.elements.keyword.value;
      if (keyword) {
        url.searchParams.set("keyword", keyword);
      } else {
        url.searchParams.delete("keyword");
      }
      window.location.href = url.href;
    });
  }
});

//show alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeButton = showAlert.querySelector(".alert-close");

  // Tự động ẩn sau time ms
  const timeoutId = setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Xử lý nút đóng
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
      clearTimeout(timeoutId); // Hủy timeout nếu người dùng đóng thủ công
    });
  }
  // Xóa phần tử khỏi DOM sau khi animation kết thúc
  showAlert.addEventListener("transitionend", () => {
    showAlert.remove();
  });
}

//end show alert

//upload img

const thumbnailInput = document.getElementById("thumbnail");
const previewImg = document.getElementById("preview-img");
const removeBtn = document.getElementById("remove-btn");

// Khi chọn ảnh
if (thumbnailInput) {
  thumbnailInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        previewImg.src = event.target.result;
        previewImg.style.display = "block";
        removeBtn.style.display = "inline-block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.style.display = "none";
      removeBtn.style.display = "none";
    }
  });
}
if (removeBtn) {
  // Khi bấm nút xóa ảnh
  removeBtn.addEventListener("click", function () {
    thumbnailInput.value = ""; // Xóa file đã chọn
    previewImg.src = "";
    previewImg.style.display = "none";
    removeBtn.style.display = "none";
  });
}

//end upload img

//sort

const sortSelect = document.querySelector("[sort-select]");
const sortClear = document.querySelector("[sort-clear]");

if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    const url = new URL(window.location.href);
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    url.searchParams.delete("page"); // reset về trang 1

    window.location.href = url.href;
  });
}

if (sortClear) {
  sortClear.addEventListener("click", () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    url.searchParams.delete("sort");
    url.searchParams.delete("page"); // reset về trang 1

    window.location.href = url.href;
  });
}
//end sort
