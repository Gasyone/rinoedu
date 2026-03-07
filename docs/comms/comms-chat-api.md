# Tài liệu API Chat

## 1. Mô tả tính năng
Tính năng này nhằm khắc phục lỗi 403 khi gọi OpenAI API trong Cloudflare Worker. Điều này giúp ứng dụng có thể giao tiếp thành công với OpenAI API mà không bị chặn do các hạn chế khu vực, từ đó cải thiện trải nghiệm người dùng.

## 2. Hướng dẫn sử dụng cho End User
### 2.1 Gửi tin nhắn
- Mở ứng dụng và đăng nhập.
- Nhập tin nhắn vào ô chat và nhấn nút gửi.
- Tin nhắn sẽ được hiển thị trong danh sách tin nhắn.

### 2.2 Xem nhật ký lỗi
- Chỉ có quản trị viên mới có quyền truy cập vào nhật ký lỗi.
- Truy cập vào phần quản lý để xem các lỗi đã ghi lại.

## 3. API Documentation (cho Developer)
### 3.1 API Endpoints

#### 1. Lấy nhật ký chat
- **Endpoint**: `GET /api/chat/logs`
- **Query Parameters**: 
  - `status`: string (ví dụ: "error")
- **Response Schema**:
  ```json
  [
    {
      "id": "string",
      "userId": "string",
      "message": "string",
      "timestamp": "string"
    }
  ]
  ```

#### 2. Gửi tin nhắn chat
- **Endpoint**: `POST /api/chat/send`
- **Request Body**:
  ```json
  {
    "message": "string",
    "userId": "string"
  }
  ```
- **Response Schema**:
  ```json
  {
    "success": boolean,
    "messageId": "string"
  }
  ```

#### 3. Lấy tin nhắn
- **Endpoint**: `GET /api/chat/messages`
- **Query Parameters**: 
  - `userId`: string
- **Response Schema**:
  ```json
  [
    {
      "id": "string",
      "userId": "string",
      "message": "string",
      "timestamp": "string"
    }
  ]
  ```

## 4. Hướng dẫn integrate với Backend
Để tích hợp với Backend:
1. Cài đặt Node.js nếu chưa có.
2. Cấu hình các endpoint API trong file `rino/src/index.js`.
3. Đảm bảo rằng các yêu cầu đến OpenAI API được xử lý thông qua reverse proxy.
4. Kiểm tra và đảm bảo rằng cơ chế ghi log ghi lại các lỗi một cách hiệu quả.

## 5. Các lỗi có thể gặp và cách xử lý
- **Lỗi 403 Forbidden**: Kiểm tra quyền truy cập vào OpenAI API và đảm bảo rằng không có hạn chế khu vực.
- **Lỗi 400 Bad Request**: Đảm bảo rằng tin nhắn không rỗng khi gửi.
- **Lỗi kết nối**: Kiểm tra kết nối mạng và đảm bảo rằng mock-server đang chạy đúng.

---

### Mock Data cho db.json
```json
{
  "comms_chat_messages": [
    {
      "id": "1",
      "userId": "user_1",
      "message": "Chào bạn, tôi có thể giúp gì cho bạn hôm nay?",
      "timestamp": "2023-10-01T10:00:00Z"
    },
    {
      "id": "2",
      "userId": "user_2",
      "message": "Tôi đang gặp vấn đề với API.",
      "timestamp": "2023-10-01T10:05:00Z"
    }
  ],
  "comms_error_logs": [
    {
      "id": "1",
      "error": "403 Forbidden: Access to the OpenAI API is blocked.",
      "timestamp": "2023-10-01T10:20:00Z"
    }
  ]
}
```