document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------
  // Checkbox Multi - Chọn tất cả
  // ---------------------------
  const formChangeMulti = document.querySelector("#form-change-multi");
  const checkboxWrapper = document.querySelector("[checkbox-multi]");

  if (formChangeMulti && checkboxWrapper) {
    const inputCheckAll = checkboxWrapper.querySelector(
      "input[name='checkall']"
    );
    const inputItems = checkboxWrapper.querySelectorAll("input[name='id']");

    // 1. Chọn tất cả
    inputCheckAll?.addEventListener("change", () => {
      inputItems.forEach((input) => {
        input.checked = inputCheckAll.checked;
      });
    });

    // 2. Cập nhật trạng thái "chọn tất cả"
    inputItems.forEach((input) => {
      input.addEventListener("change", () => {
        const checkedCount = checkboxWrapper.querySelectorAll(
          "input[name='id']:checked"
        ).length;
        inputCheckAll.checked = checkedCount === inputItems.length;
      });
    });

    // 3. Submit form
    formChangeMulti.addEventListener("submit", function (e) {
      const checkedItems = checkboxWrapper.querySelectorAll(
        "input[name='id']:checked"
      );

      if (checkedItems.length === 0) {
        e.preventDefault();
        alert("Vui lòng chọn ít nhất 1 bản ghi để thực hiện thao tác");
        return;
      }

      const ids = Array.from(checkedItems).map((input) => input.value);
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      const inputRedirect = formChangeMulti.querySelector(
        "input[name='redirect']"
      );

      inputIds.value = ids.join(",");
      inputRedirect.value = window.location.pathname + window.location.search;
    });
  }

  // ---------------------------
  // Change status từng sản phẩm
  // ---------------------------
  const buttonChangeStatus = document.querySelectorAll(
    "[button-change-status]"
  );
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

  // ---------------------------
  // Xóa sản phẩm
  // ---------------------------
  const buttonDelete = document.querySelectorAll("[button-delete]");
  if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach((button) => {
      button.addEventListener("click", () => {
        const isConfirm = confirm("Bạn có muốn xóa sản phẩm này?");
        if (isConfirm) {
          const id = button.getAttribute("data-id");
          const currentUrl = encodeURIComponent(
            window.location.pathname + window.location.search
          );
          const action = `${path}/${id}?redirect=${currentUrl}`;
          formDeleteItem.action = action;
          formDeleteItem.submit();
        }
      });
    });
  }

  formChangeMulti.addEventListener("submit", (e) => {
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;

    if (inputsChecked.length === 0) {
      e.preventDefault();
      alert("Vui lòng chọn ít nhất 1 bản ghi để thực hiện thao tác");
      return;
    }

    if (typeChange === "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");
      if (!isConfirm) {
        e.preventDefault();
        return;
      }
    }

    // Thu thập id và vị trí tương ứng
    const idAndPositions = Array.from(inputsChecked).map((input) => {
      const row = input.closest("tr");
      const positionInput = row.querySelector("input[name='position']");
      return {
        id: input.value,
        position: parseInt(positionInput.value) || 0,
      };
    });

    const ids = idAndPositions.map((item) => item.id);

    const inputIds = formChangeMulti.querySelector("input[name='ids']");
    const inputRedirect = formChangeMulti.querySelector(
      "input[name='redirect']"
    );
    const inputPositions = formChangeMulti.querySelector(
      "input[name='positions']"
    );

    inputIds.value = ids.join(",");
    inputRedirect.value = window.location.pathname + window.location.search;
    inputPositions.value = JSON.stringify(idAndPositions);
  });
});
