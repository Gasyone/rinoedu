# Tài liệu Kỹ thuật: Context-Aware AI Payload

## 1. Mô tả tính năng (What & Why)

### What
Tính năng này nâng cao yêu cầu API bằng cách bao gồm một đối tượng `screenContext` phong phú. Đối tượng này chứa thông tin chi tiết về ngữ cảnh hiện tại của người dùng, giúp cải thiện phản hồi và tương tác của AI.

### Why
Việc cung cấp thông tin ngữ cảnh chi tiết cho AI cho phép nó hiểu rõ hơn về những gì người dùng đang thấy và làm, từ đó cải thiện chất lượng và độ chính xác của các phản hồi.

## 2. Hướng dẫn sử dụng cho End User

Để sử dụng tính năng này, người dùng chỉ cần gửi một tin nhắn qua API chat. Đảm bảo rằng `screenContext` được điền đầy đủ với thông tin về module hiện tại, các tab đang hoạt động, các tính năng hiển thị và trạng thái UI liên quan. Ví dụ:

```json
{
  "message": "Chào bạn, tôi cần trợ giúp!",
  "userId": "user_001",
  "screenContext": {
    "currentModule": "chat",
    "activeTabs": ["Home"],
    "visibleFeatures": ["Send Message"],
    "uiState": {
      "isTyping": false,
      "lastActive": "2023-10-01T12:00:00Z"
    }
  }
}
```

## 3. API Documentation (cho Developer)

### Endpoint
**POST /api/chat/send**

### Request Body
```json
{
  "message": "string",
  "userId": "string",
  "screenContext": {
    "currentModule": "string",
    "activeTabs": ["string"],
    "visibleFeatures": ["string"],
    "uiState": {
      "isTyping": "boolean",
      "lastActive": "string"
    }
  }
}
```

### Response
- **Status Code:** 200 OK
- **Response Body:**
```json
{
  "success": true,
  "messageId": "string"
}
```

### Error Response
- **Status Code:** 400 Bad Request
- **Response Body:**
```json
{
  "success": false,
  "error": "string"
}
```

## 4. Hướng dẫn integrate với Backend

### Bước 1: Cập nhật Backend
- Implement logic để xử lý `screenContext` trong endpoint API. Đảm bảo rằng dữ liệu được xử lý đúng cách.

### Bước 2: Cập nhật Frontend
- Cập nhật gọi fetch trong `SquareHomepage.jsx` để bao gồm `screenContext` trong yêu cầu.

### Bước 3: Kiểm tra Mock Data
- Đảm bảo rằng mock data trong `db.json` có các mục nhập cho `screenContext` và các tin nhắn mẫu.

### Bước 4: Kiểm tra và Xác nhận
- Đảm bảo rằng tất cả các component đều xử lý trạng thái loading, error và empty. Kiểm tra không có credential nào bị hardcode trong codebase.

## 5. Các lỗi có thể gặp và cách xử lý
- **Lỗi 400 Bad Request:** Nếu người dùng gửi tin nhắn rỗng, API sẽ trả về lỗi này. Đảm bảo rằng nội dung tin nhắn không được để trống.
- **Lỗi 403 Forbidden:** Nếu người dùng không có quyền truy cập vào API chat, API sẽ trả về lỗi này. Đảm bảo rằng người dùng đã đăng nhập trước khi gửi yêu cầu.

## 6. Kết luận
Tính năng này giúp cải thiện trải nghiệm người dùng bằng cách cung cấp ngữ cảnh chi tiết cho AI, từ đó nâng cao chất lượng phản hồi và tương tác. Hãy chắc chắn rằng bạn đã thực hiện đầy đủ các bước tích hợp và kiểm tra trước khi triển khai.