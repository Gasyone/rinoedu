# Tài liệu kỹ thuật: Xử lý lỗi OpenAI API Error 401

## 1. Mô tả tính năng (What & Why)
Tính năng này được thiết kế để xử lý lỗi OpenAI API Error 401, đảm bảo rằng hệ thống có thể sử dụng OpenAI API mà không gặp phải lỗi liên quan đến token không hợp lệ. Điều này giúp cải thiện khả năng tích hợp của hệ thống với OpenAI, mang lại trải nghiệm người dùng tốt hơn.

## 2. Hướng dẫn sử dụng cho End User
### Bước 1: Cấu hình Proxy OpenAI
- Truy cập vào màn hình cấu hình proxy OpenAI trong ứng dụng.
- Nhập vào API key hợp lệ của bạn.
- Nhấn nút "Lưu" để lưu cấu hình.

### Bước 2: Gửi yêu cầu đến OpenAI API
- Chọn endpoint mà bạn muốn gửi yêu cầu.
- Nhập dữ liệu cần thiết và nhấn nút "Gửi".
- Kiểm tra phản hồi từ OpenAI API trên giao diện người dùng.

### Ví dụ thực tế
- Nếu bạn muốn gửi yêu cầu đến endpoint `/v1/engines/davinci-codex/completions`, bạn cần nhập vào dữ liệu như sau:
  ```json
  {
    "prompt": "Hello, world!",
    "max_tokens": 5
  }
  ```

## 3. API Documentation (cho Developer)
### 3.1. GET /api/openai/proxy
- **Mô tả**: Lấy cấu hình proxy OpenAI.
- **Request**: 
  - **Headers**: 
    - `Authorization`: Bearer token (JWT)
- **Response**: 
  - **Status Code**: 200 OK
  - **Body**:
    ```json
    {
      "url": "https://api.openai-proxy.com",
      "status": "active"
    }
    ```

### 3.2. POST /api/openai/request
- **Mô tả**: Gửi yêu cầu đến OpenAI API thông qua proxy.
- **Request**:
  - **Headers**: 
    - `Authorization`: Bearer token (JWT)
  - **Body**:
    ```json
    {
      "endpoint": "/v1/engines/davinci-codex/completions",
      "data": {
        "prompt": "Hello, world!",
        "max_tokens": 5
      }
    }
    ```
- **Response**:
  - **Status Code**: 200 OK
  - **Body**:
    ```json
    {
      "response": {
        "id": "cmpl-12345",
        "object": "text_completion",
        "created": 1633072800,
        "choices": [
          {
            "text": "Hello!",
            "index": 0,
            "logprobs": null,
            "finish_reason": "stop"
          }
        ]
      }
    }
    ```
  - **Status Code**: 401 Unauthorized (nếu token không hợp lệ)
  - **Body**:
    ```json
    {
      "error": {
        "message": "Invalid API key",
        "type": "invalid_request_error",
        "param": null,
        "code": "invalid_api_key"
      }
    }
    ```

## 4. Hướng dẫn integrate với Backend
### Bước 1: Cài đặt API endpoints
- Trong file `rino/src/index.js`, thêm mã để xây dựng các API endpoints cho proxy OpenAI.

### Bước 2: Xử lý yêu cầu và phản hồi
- Đảm bảo rằng các yêu cầu từ frontend được xử lý đúng cách và phản hồi từ OpenAI API được chuyển tiếp về cho người dùng.

### Bước 3: Kiểm tra và xác nhận
- Thực hiện kiểm tra để xác nhận rằng các endpoint hoạt động đúng và không có lỗi xảy ra trong quá trình gửi yêu cầu.

## 5. Các lỗi có thể gặp và cách xử lý
- **Lỗi 401: Invalid API key**
  - **Nguyên nhân**: API key không hợp lệ hoặc đã hết hạn.
  - **Cách xử lý**: Kiểm tra lại API key và đảm bảo rằng nó còn hiệu lực.

- **Lỗi null response**
  - **Nguyên nhân**: OpenAI API không trả về dữ liệu.
  - **Cách xử lý**: Kiểm tra lại endpoint và dữ liệu gửi đi.

- **Lỗi mạng**
  - **Nguyên nhân**: Kết nối mạng không ổn định.
  - **Cách xử lý**: Kiểm tra kết nối mạng và thử lại sau.

---

Tài liệu này cung cấp hướng dẫn chi tiết cho người dùng và nhà phát triển để sử dụng và tích hợp tính năng xử lý lỗi OpenAI API Error 401 vào hệ thống.