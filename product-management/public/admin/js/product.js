const buttonChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  const redirectInput = document.querySelector("#redirect-input");

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const statusChange = statusCurrent === "active" ? "inactive" : "active";

      redirectInput.value = window.location.pathname + window.location.search;

      formChangeStatus.action = `${path}/${statusChange}/${id}`;
      formChangeStatus.submit();
    });
  });
}

// Change status cho nhiều sản phẩm
