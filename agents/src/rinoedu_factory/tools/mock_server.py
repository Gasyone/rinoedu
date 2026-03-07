"""
Tool: MockServerTool
Agent: be (Backend Engineer)
Mục đích: Cập nhật mock-server/db.json với dữ liệu mẫu chuẩn Modular Monolith
"""
import os
import json
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
RINOAPP_ROOT = os.getenv("RINOAPP_ROOT", r"c:\Users\Jacky Tran\Documents\Rinoapp")
DB_JSON_PATH = os.path.join(RINOAPP_ROOT, "mock-server", "db.json")


class MockServerInput(BaseModel):
    table_name: str = Field(
        description="Tên bảng cần thêm/cập nhật. PHẢI có tiền tố module. VD: education_students, crm_leads"
    )
    records: list[dict] = Field(
        description="Danh sách các record (JSON objects) cần thêm vào bảng"
    )
    replace: bool = Field(
        default=False,
        description="Nếu True, xóa data cũ và thay bằng records mới. Nếu False, nối thêm vào cuối."
    )


class MockServerTool(BaseTool):
    name: str = "mock_server_updater"
    description: str = (
        "Cập nhật file mock-server/db.json của Rinoapp với dữ liệu mẫu mới. "
        "Tên bảng BẮT BUỘC phải có tiền tố tên module (VD: education_students). "
        "Đây là luật SỐNG CÒN của Modular Monolith — vi phạm sẽ bị reject."
    )
    args_schema: type[BaseModel] = MockServerInput

    def _run(self, table_name: str, records: list[dict], replace: bool = False) -> str:
        # Validate tiền tố module
        valid_prefixes = ["iam_", "hr_", "mdm_", "crm_", "education_", "logistics_", "fintech_", "comms_"]
        has_valid_prefix = any(table_name.startswith(p) for p in valid_prefixes)
        
        if not has_valid_prefix:
            return (
                f"❌ REJECTED: Tên bảng '{table_name}' vi phạm Modular Monolith Rule!\n"
                f"Tên bảng PHẢI bắt đầu bằng tiền tố module: {valid_prefixes}\n"
                f"Ví dụ đúng: education_students, crm_leads, iam_users"
            )

        # Đọc db.json hiện tại
        with open(DB_JSON_PATH, "r", encoding="utf-8") as f:
            db = json.load(f)

        if replace or table_name not in db:
            db[table_name] = records
        else:
            # Merge, tránh duplicate id
            existing_ids = {r.get("id") for r in db[table_name]}
            new_records = [r for r in records if r.get("id") not in existing_ids]
            db[table_name].extend(new_records)

        with open(DB_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(db, f, ensure_ascii=False, indent=4)

        total = len(db[table_name])
        return f"✅ Đã cập nhật bảng '{table_name}' — tổng {total} records trong mock-server/db.json"
