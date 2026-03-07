# Cẩm nang Lập trình viên (Developer Guide)

Tài liệu này hướng dẫn cách Đội ngũ Kỹ sư (Human + AI) hoạt động chung trong ranh giới dự án RinoEdu.

## 1. Cấu trúc thư mục Frontend
```text
/src
 ├── /api            (Nơi chứa client.js, config axios chung)
 ├── /assets         (Hình ảnh tĩnh, icon custom)
 ├── /components     (Nơi chứa UI Components dùng chung toàn hệ thống, VD: Button, Modal)
 ├── /layouts        (Khung sườn, Sidebar, Topbar)
 ├── /modules        (Chứa 8 module nghiệp vụ chính: iam, hr, education...)
 │    └── /education
 │         ├── /components  (Component dùng riêng lẻ trong education)
 │         ├── /pages       (Màn hình của education)
 │         └── index.js     (Export các routes/pages ra ngoài)
 ├── /pages          (Màn hình chung ko thuộc module rập khuôn: Homepage, Login)
 ├── /shared         (Tài sản cốt lõi: interfaces, design-tokens)
 └── /utils          (Hàm trợ năng formatters, i18n)
```

## 2. Coding Convention (Quy ước Code UI/FE)
### 2.1 CSS & UI Tailwind
- Tuân thủ bộ màu quy định tại `src/shared/design-tokens.css`.
- Để áp dụng màu nền: className="bg-brand-primary" hoặc dùng style={{ backgroundColor: 'var(--color-brand-primary)'}}.

### 2.2 Xử lý Lỗi và Loading
Tuyệt đối không để màn hình chết (Trắng trang). 
- Bắt buộc sử dụng `try/catch` ở mọi API call.
- Trong lúc đợi API, hiển thị Component **Loading Spinner / Skeleton**.
- Nếu mảng dữ liệu rỗng (`data.length === 0`), Render Component **Empty State** (Ví dụ: "Chưa có học viên nào trong lớp này").

## 3. Cách Tương tác Với Đội AI (RinoEdu Factory)
Với tư cách Human Developer, bạn không cần code tay các màn hình dạng CRUD lặp đi lặp lại.

**Quy trình Request AI:**
1. Khởi động AI Factory bằng file `run.bat` (Window) ở thư mục `agents/`.
2. Trò chuyện với Agent `@pm` (Project Manager) và cung cấp yêu cầu:
   *Ví dụ: "Hãy tạo màn hình Danh sách Học viên thuộc Module Education. API trả về mảng user, có nút Sửa/Xóa. Giao diện dùng Card Tailwind đẹp mắt".*
3. Hệ thống sẽ lần lượt:
   - `pm`: Viết Specification.
   - `be`: Viết DTO và db.json (Mock data).
   - `ui`: Vẽ luồng Component tree.
   - `fe`: Gen file `StudentList.jsx` ném thẳng vào source code.
   - `doc`: Viết HDSD tại nhánh này.
4. Đợi AI chạy xong, Human Dev xem kết quả trực tiếp ở localhost và đưa feedback cho `pm` sửa đổi.

## 4. Cách Deploy Code
Mọi Code sẽ được đẩy thẳng lên nhánh GitHub (`Gasy-headquater/rinoedu`).
- Branch `staging`: Sẽ tự build ra link Preview (Dành cho Tester).
- Branch `master`: Cloudflare Pages tự build phát hành lên Production (`rino.gasy.io`).
- Rino AI Backend nằm tại `rino` được deploy qua lệnh `npm run deploy` (Wrangler).
