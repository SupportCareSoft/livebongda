# Bảng tỉ số bóng đá — livestream

Sau khi đã điền `firebase-config.js` và bật GitHub Pages, dùng:

- `controller.html?session=ten-tran`: điều khiển trên điện thoại.
- `overlay.html?session=ten-tran`: nhúng vào Browser Source của phần mềm live.

Hai link phải có cùng `session` để đồng bộ. Mỗi trận có thể đặt một mã khác, ví dụ `vong-1` hoặc `ban-ket`.

Không mở trực tiếp file HTML trên điện thoại: Firebase module yêu cầu trang được phục vụ bằng HTTPS qua GitHub Pages.
