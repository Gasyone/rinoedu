"""
Tool: FileWriterTool
Agent: fe (Frontend Engineer)
Mục đích: Ghi code React/JSX hoặc TypeScript Interface vào đúng vị trí trong Rinoapp
"""
import os
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
RINOAPP_ROOT = os.getenv("RINOAPP_ROOT", r"c:\Users\Jacky Tran\Documents\Rinoapp")


class FileWriterInput(BaseModel):
    relative_path: str = Field(
        description="Đường dẫn tương đối từ thư mục gốc Rinoapp. VD: src/modules/education/StudentList.jsx"
    )
    content: str = Field(
        description="Nội dung file cần ghi"
    )
    overwrite: bool = Field(
        default=False,
        description="Cho phép ghi đè nếu file đã tồn tại"
    )


class FileWriterTool(BaseTool):
    name: str = "file_writer"
    description: str = (
        "Ghi nội dung code vào file trong dự án Rinoapp. "
        "Dùng để tạo file JSX, TypeScript, CSS mới trong đúng module. "
        "Luôn kiểm tra đường dẫn có đúng chuẩn Modular Monolith không trước khi ghi."
    )
    args_schema: type[BaseModel] = FileWriterInput

    def _run(self, relative_path: str, content: str, overwrite: bool = False) -> str:
        # Validate module path
        valid_modules = ["iam", "hr", "mdm", "crm", "education", "logistics", "fintech", "comms"]
        
        if "modules/" in relative_path:
            module_name = relative_path.split("modules/")[1].split("/")[0]
            if module_name not in valid_modules:
                return f"❌ REJECTED: Module '{module_name}' không hợp lệ. Chỉ được dùng: {valid_modules}"

        full_path = os.path.join(RINOAPP_ROOT, relative_path.replace("/", os.sep))
        
        # Tạo thư mục nếu chưa tồn tại
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Kiểm tra file đã tồn tại
        if os.path.exists(full_path) and not overwrite:
            return f"⚠️  File đã tồn tại: {full_path}. Dùng overwrite=True để ghi đè."
        
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        
        return f"✅ Đã ghi file thành công: {full_path} ({len(content)} ký tự)"
