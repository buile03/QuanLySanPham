// Xử lý dropdown menu
$(document).ready(function () {
  // Hover effect cho dropdown
  $(".dropdown").hover(
    function () {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(true, true)
        .delay(200)
        .fadeIn(300);
    },
    function () {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(true, true)
        .delay(200)
        .fadeOut(300);
    }
  );

  // Hover effect cho submenu
  $(".dropdown-submenu").hover(
    function () {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(true, true)
        .delay(200)
        .fadeIn(300);
    },
    function () {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(true, true)
        .delay(200)
        .fadeOut(300);
    }
  );

  // Click để mở dropdown trên mobile
  $(".dropdown > a").on("click", function (e) {
    if ($(window).width() <= 768) {
      e.preventDefault();
      $(this).siblings(".dropdown-menu").toggle();
    }
  });

  // Click để mở submenu trên mobile
  $(".dropdown-submenu > a").on("click", function (e) {
    if ($(window).width() <= 768) {
      e.preventDefault();
      $(this).siblings(".dropdown-menu").toggle();
    }
  });
});
const showAlerts = document.querySelectorAll("[show-alert]");

showAlerts.forEach((showAlert) => {
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeButton = showAlert.querySelector(".alert-close");

  // Tự động ẩn sau time ms
  const timeoutId = setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Xử lý nút đóng
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
      clearTimeout(timeoutId);
    });
  }

  // Xóa phần tử khỏi DOM sau khi animation kết thúc
  showAlert.addEventListener("transitionend", () => {
    showAlert.remove();
  });
});
