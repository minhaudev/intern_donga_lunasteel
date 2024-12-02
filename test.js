const { parentPort } = require('worker_threads');

// Nhận dữ liệu từ thread chính
parentPort.on('message', (data) => {
  // Thực hiện tác vụ xử lý nặng
  let result = data.num1 + data.num2;

  // Gửi kết quả lại cho thread chính
  parentPort.postMessage(result);
});
