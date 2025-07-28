tinymce.init({
  selector: "textarea",
  height: 300,
  plugins: "image code",
  toolbar: "undo redo | image code",
  branding: false,

  /* ✅ Cấu hình file picker */
  file_picker_types: "image",
  file_picker_callback: function (callback, value, meta) {
    if (meta.filetype === "image") {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");

      input.onchange = function () {
        const file = this.files[0];
        const reader = new FileReader();

        reader.onload = function () {
          const base64 = reader.result;
          callback(base64, { title: file.name });
        };

        reader.readAsDataURL(file);
      };

      input.click();
    }
  },
});
