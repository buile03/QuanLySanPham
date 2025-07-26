// Import Express app từ file index gốc (không có app.listen)
const app = require("../index");

// Import gói serverless-http để chuyển Express thành hàm xử lý cho Vercel
const serverless = require("serverless-http");

// Export Express app dưới dạng handler để Vercel có thể gọi
module.exports = serverless(app);
