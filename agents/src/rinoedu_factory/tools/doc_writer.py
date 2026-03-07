"""
Tool: DocWriterTool
Agent: doc (Technical Writer)
Mục đích: Ghi tài liệu Markdown vào thư mục docs/ của Rinoapp
"""
import os
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
RINOAPP_ROOT = os.getenv("RINOAPP_ROOT", r"c:\Users\Jacky Tran\Documents\Rinoapp")
DOCS_DIR = os.path.join(RINOAPP_ROOT, "docs")


class DocWriterInput(BaseModel):
    filename: str = Field(
        description="Tên file markdown. VD: education-student-list.md, crm-leads.md"
    )
    content: str = Field(
        description="Nội dung Markdown của tài liệu"
    )
    module: str = Field(
        description="Tên module liên quan. VD: education, crm, iam"
    )


class DocWriterTool(BaseTool):
    name: str = "doc_writer"
    description: str = (
        "Ghi tài liệu kỹ thuật Markdown vào thư mục docs/ của Rinoapp. "
        "Tạo tài liệu cho tính năng mới sau khi code đã được review PASS."
    )
    args_schema: type[BaseModel] = DocWriterInput

    def _run(self, filename: str, content: str, module: str) -> str:
        # Tạo thư mục docs/module nếu chưa có
        module_docs_dir = os.path.join(DOCS_DIR, module)
        os.makedirs(module_docs_dir, exist_ok=True)

        # Thêm .md nếu chưa có
        if not filename.endswith(".md"):
            filename += ".md"

        doc_path = os.path.join(module_docs_dir, filename)
        
        with open(doc_path, "w", encoding="utf-8") as f:
            f.write(content)

        relative_path = f"docs/{module}/{filename}"
        return f"✅ Đã ghi tài liệu: {relative_path} ({len(content)} ký tự)"
