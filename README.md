# Bemi de Bakery

Trang web giới thiệu và đặt hàng trực tuyến dành cho tiệm bánh Bemi de Bakery tại Melbourne, Australia. Trang web được thiết kế theo phong cách tối giản, hiện đại và tập trung vào sản phẩm bánh mini bites.

## Tính năng chính

- Giới thiệu sản phẩm: Trực quan hóa hộp bánh mini bites với 3 hương vị tùy chọn (Pistachio, Cream Cheese, Biscoff).
- Đặt hàng trực tuyến: Khách hàng có thể chọn số lượng hộp, chọn hương vị riêng cho từng hộp, điền thông tin cá nhân, ghi chú và địa điểm nhận hàng (Ascot Vale hoặc CBD).
- Tích hợp Google Sheets: Đơn hàng sau khi đặt được tự động gửi và lưu trữ trực tiếp lên Google Sheets theo thời gian thực.
- Đánh giá khách hàng: Hiển thị nhận xét từ cộng đồng và cho phép khách hàng gửi đánh giá mới kèm điểm số và ảnh chụp (được nén tự động trước khi tải lên).
- Hiệu ứng giao diện: Tích hợp hiệu ứng bụi bột bánh bay (canvas particles) và quầng sáng theo con trỏ chuột tinh tế.

## Cấu trúc dự án

- index.html: Giao diện chính của trang web, bao gồm cấu trúc các phần Home, About, Menu, Order, Feedback và Footer.
- style.css: Định nghĩa toàn bộ phong cách thiết kế, màu sắc (caramel, kem, tối giản) và hiệu ứng chuyển động.
- script.js: Xử lý logic nghiệp vụ, quản lý trạng thái chọn vị bánh, gửi dữ liệu đơn hàng/đánh giá lên Google Sheets, tải các bài đánh giá mới và hiển thị hiệu ứng canvas.
- images/: Thư mục chứa các tài nguyên hình ảnh được sử dụng trên trang web.
- CNAME: Cấu hình tên miền tùy chỉnh cho dịch vụ Github Pages.

## Cách chạy dự án

1. Tải toàn bộ mã nguồn về máy tính.
2. Mở trực tiếp file index.html bằng trình duyệt web, hoặc chạy thông qua một máy chủ local (ví dụ: Live Server trên VS Code) để các tính năng tải ảnh/gửi dữ liệu hoạt động tối ưu nhất.

## Cấu hình Backend (Google Sheets)

Hệ thống sử dụng một API được xây dựng trên Google Apps Script (liên kết trong script.js) để:
- Nhận dữ liệu đặt hàng từ form và ghi vào Google Sheets.
- Lưu trữ hình ảnh và nội dung đánh giá của khách hàng.
- Trả về danh sách đánh giá thời gian thực để hiển thị lên trang web.
