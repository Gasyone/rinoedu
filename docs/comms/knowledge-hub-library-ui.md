# Knowledge Hub Library UI

## Mô tả tính năng
**What & Why**: Tính năng "Knowledge Hub Library UI" được thiết kế để cải thiện trải nghiệm người dùng của module Knowledge Hub hiện tại. Tính năng này bao gồm một giao diện thư viện toàn diện với các thành phần UI cải tiến như Hero Banner với thanh tìm kiếm trung tâm, Category Grid với biểu tượng emoji, Document Cards đẹp mắt với tóm tắt/thẻ/thời gian đọc/lượt xem, Reader View cải tiến với thanh bên Mục lục, và Ticket/Report Modal tự động đính kèm ngữ cảnh tài liệu hiện tại.

## Hướng dẫn sử dụng cho End User
1. **Truy cập vào Knowledge Hub Library**: Người dùng có thể truy cập vào giao diện thư viện thông qua trang chính của ứng dụng.
2. **Sử dụng thanh tìm kiếm**: Nhập từ khóa vào thanh tìm kiếm trung tâm để tìm kiếm tài liệu nhanh chóng.
3. **Duyệt qua các danh mục**: Sử dụng Category Grid để duyệt qua các danh mục tài liệu khác nhau, được hiển thị với biểu tượng emoji.
4. **Xem chi tiết tài liệu**: Nhấp vào Document Card để xem chi tiết tài liệu trong Reader View, nơi có thể thấy Mục lục bên cạnh.
5. **Báo cáo vấn đề**: Sử dụng CreateTicketModal để báo cáo vấn đề với tài liệu, ngữ cảnh tài liệu sẽ được tự động đính kèm.

## API Documentation
### GET /documents
- **Description**: Lấy danh sách tài liệu với các tùy chọn lọc theo danh mục, thẻ, v.v.
- **Request Parameters**:
  - `category` (optional): Lọc tài liệu theo danh mục.
  - `tags` (optional): Lọc tài liệu theo thẻ.
- **Response**: Mảng các đối tượng `Document`.

### GET /documents/:id
- **Description**: Lấy thông tin chi tiết về một tài liệu cụ thể.
- **Request Parameters**: `id` (required): ID của tài liệu.
- **Response**: Một đối tượng `Document`.

### POST /tickets
- **Description**: Tạo một ticket mới với ngữ cảnh tài liệu.
- **Request Body**:
  - `title`: Tiêu đề của ticket.
  - `description`: Mô tả vấn đề.
  - `documentId`: ID của tài liệu liên quan.
- **Response**: Một đối tượng `Ticket`.

### GET /categories
- **Description**: Lấy danh sách các danh mục tài liệu với biểu tượng emoji liên quan.
- **Response**: Mảng các đối tượng `Category`.

## Hướng dẫn tích hợp với Backend
- **Mock Server**: Hiện tại, các API endpoint được tích hợp với mock-server để phát triển và thử nghiệm.
- **Chuyển đổi sang Backend thật**: Khi backend thật sẵn sàng, cần cập nhật URL endpoint để trỏ đến server thật. Đảm bảo rằng tất cả các endpoint đều được kiểm tra và hoạt động đúng với dữ liệu thực tế.

## Các lỗi có thể gặp và cách xử lý
1. **Unauthorized Access (403)**: Khi gặp lỗi này, kiểm tra quyền truy cập của người dùng và xác thực lại nếu cần.
2. **Network Error**: Đảm bảo kết nối mạng ổn định và thử lại.
3. **Empty Document List**: Kiểm tra lại điều kiện lọc hoặc dữ liệu trên server.

## Ví dụ thực tế
- **Truy cập tài liệu**: Người dùng có thể tìm kiếm "TypeScript" để xem danh sách tài liệu liên quan đến TypeScript.
- **Báo cáo lỗi**: Nếu phát hiện lỗi trong tài liệu, người dùng có thể tạo ticket với tiêu đề và mô tả chi tiết, ngữ cảnh tài liệu sẽ được tự động đính kèm.