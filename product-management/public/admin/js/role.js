// permissions
const permissionsTable = document.querySelector("[table-permissions]");
if (permissionsTable) {
  const buttonSubmit = document.querySelector("#button-submit");

  buttonSubmit.addEventListener("click", (e) => {
    e.preventDefault(); // Ngăn form submit mặc định

    let perrmissions = [];
    const rows = document.querySelectorAll("tr[data-name]");

    rows.forEach((row) => {
      const permissionName = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (permissionName == "id") {
        inputs.forEach((input) => {
          perrmissions.push({
            id: input.value,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          if (input.type === "checkbox" && input.checked) {
            perrmissions[index].permissions.push(permissionName);
          }
        });
      }
    });

    if (perrmissions.length > 0) {
      const formchangePermissions = document.querySelector(
        "#form-change-permissions"
      );
      const inputPermissions = formchangePermissions.querySelector(
        "input[name='permissionsData']"
      );
      inputPermissions.value = JSON.stringify(perrmissions);
      formchangePermissions.submit();
    }
  });
}
// Permission data default
const dataRecord = document.querySelector("[data-record]");
if (dataRecord) {
  const record = JSON.parse(dataRecord.getAttribute("data-record"));
  const tablePermissions = document.querySelector("[table-permissions]");

  record.forEach((item, index) => {
    if (item.permissions && item.permissions.length > 0) {
      item.permissions.forEach((permission) => {
        const row = tablePermissions.querySelector(
          `[data-name="${permission}"]`
        );
        if (row) {
          const inputs = row.querySelectorAll("input[type='checkbox']");
          if (inputs[index]) {
            inputs[index].checked = true;
          }
        }
      });
    }
  });
}
