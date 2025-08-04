//cập nhật số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("item-id");
      const quantity = input.value;

      if (parseInt(quantity) < 1) {
        alert("Số lượng tối thiểu là 1");
        input.value = 1;
        return;
      }

      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}

//end cập nhật số lượng sản phẩm trong giỏ hàng
