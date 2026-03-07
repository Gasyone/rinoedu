"""
Tool: GitTool
Agent: pm (Project Manager) - dùng sau khi toàn bộ pipeline hoàn tất
Mục đích: Auto git add, commit và push lên GitHub
"""
import os
import subprocess
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
RINOAPP_ROOT = os.getenv("RINOAPP_ROOT", r"c:\Users\Jacky Tran\Documents\Rinoapp")


class GitCommitInput(BaseModel):
    commit_message: str = Field(
        description="Commit message mô tả thay đổi. Nên theo format: 'feat(module): mô tả ngắn'"
    )
    push: bool = Field(
        default=True,
        description="Nếu True, tự động push lên remote origin sau khi commit"
    )


class GitTool(BaseTool):
    name: str = "git_commit_push"
    description: str = (
        "Tự động git add tất cả thay đổi, tạo commit với message mô tả, "
        "và push lên GitHub remote. Chỉ dùng sau khi Agent review đã PASS."
    )
    args_schema: type[BaseModel] = GitCommitInput

    def _run(self, commit_message: str, push: bool = True) -> str:
        try:
            # git add
            result_add = subprocess.run(
                ["git", "add", "."],
                cwd=RINOAPP_ROOT,
                capture_output=True, text=True
            )
            if result_add.returncode != 0:
                return f"❌ git add thất bại: {result_add.stderr}"

            # git commit
            result_commit = subprocess.run(
                ["git", "commit", "-m", commit_message],
                cwd=RINOAPP_ROOT,
                capture_output=True, text=True
            )
            if result_commit.returncode != 0:
                if "nothing to commit" in result_commit.stdout:
                    return "ℹ️  Không có gì để commit — working tree sạch."
                return f"❌ git commit thất bại: {result_commit.stderr}"

            if not push:
                return f"✅ Đã commit thành công.\n{result_commit.stdout}"

            # git push
            result_push = subprocess.run(
                ["git", "push", "origin", "master"],
                cwd=RINOAPP_ROOT,
                capture_output=True, text=True
            )
            if result_push.returncode != 0:
                return f"⚠️  Commit OK nhưng push thất bại: {result_push.stderr}"

            return f"✅ Commit và Push thành công!\n{result_commit.stdout}\n{result_push.stdout}"

        except Exception as e:
            return f"❌ Lỗi Git: {str(e)}"
