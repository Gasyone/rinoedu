---
description: Quy tắc Giao tiếp nội bộ và Cập nhật RAG cho Team AI (CrewAI)
---

# HỆ THỐNG QUY TẮC CỐT LÕI DÀNH CHO AI AGENTS (RINOEDU FACTORY)
*File này định nghĩa các quy định bắt buộc phải tuân thủ khi các AI Agent làm việc với nhau và cập nhật hệ thống.*

## 1. QUY TẮC GIAO TIẾP GIỮA CÁC AI (AI-TO-AI COMMUNICATION RULE)
Tuyệt đối không sử dụng ngôn ngữ tự nhiên dài dòng (conversational language) khi các Agent (PM, UI, FE, BE, QA) truyền đạt thông tin cho nhau. 

**Bắt buộc sử dụng một trong các định dạng sau:**
- **JSON / YAML:** Định dạng cấu trúc dữ liệu cho API Contract, thông số kỹ thuật, cấu hình logic.
- **Markdown Bullet Points:** Chỉ dùng gạch đầu dòng ngắn gọn để liệt kê Tasks, Acceptance Criteria.
- **Mermaid Block:** Sử dụng biểu đồ để truyền đạt State Machine hoặc Luồng logic.

**Ví dụ Giao tiếp Sai (Nghiêm cấm):**
> "Chào FE Agent, tôi đã phân tích xong yêu cầu của sếp. Sếp muốn bạn làm cái nút màu xanh lá cây nhé. Nhớ check kỹ nhé."

**Ví dụ Giao tiếp Đúng (Bắt buộc):**
```yaml
task_type: ui_update
target_component: Dashboard.jsx
element: button#view_all
action: update_class
new_classes: "text-emerald-500 hover:text-emerald-600"
```

## 2. QUY TẮC CẬP NHẬT RAG KHI CÓ TÍNH NĂNG MỚI (RAG UPDATE RULE)
Tại sao "AI không biết tính năng mới"? Vì tính năng mới chỉ nằm ở code (Frontend/Backend) mà chưa được đẩy vào **Bộ nhớ lõi RAG (Sách Trắng)**.

Mỗi khi Team AI hoặc Dev hoàn thành một Component/Feature mới, **BẮT BUỘC** phải thực hiện quy trình sau trước khi đóng Task:
1. Mở file `docs/architecture/whitepaper.md`
2. Bổ sung Component, Mô tả hoạt động, hoặc cấu trúc dữ liệu vào đúng Hạng mục (Module).
3. (Bắt buộc) Chạy lệnh Build nội dung RAG:
   ```bash
   node rino/src/build_wp.js
   ```
4. (Bắt buộc) Triển khai lại Backend (Ai Worker) để AI nạp bộ nhớ mới vào bộ não:
   ```bash
   cd rino && npm run deploy
   ```
*Nếu bỏ sót bước này, Rino AI trên hệ thống sẽ bị "mù" về tính năng vừa tạo.*
