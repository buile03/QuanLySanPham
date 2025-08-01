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
