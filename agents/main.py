#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════╗
║          RINOEDU AI FACTORY — Entry Point                    ║
║  Hệ thống 7 AI Agents tự động phát triển phần mềm           ║
╚══════════════════════════════════════════════════════════════╝

Cách dùng:
    python main.py "Mô tả tính năng bạn muốn làm"

Ví dụ:
    python main.py "Tạo màn hình danh sách học sinh cho module education"
    python main.py "Làm trang quản lý lead khách hàng cho module crm"
    python main.py "Xây dựng màn hình chấm công nhân viên cho module hr"
"""

import sys
import os
import time
from pathlib import Path

# Thêm src vào Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from dotenv import load_dotenv
load_dotenv()


def print_banner():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                 🏭 RINOEDU AI FACTORY                        ║
║         7 Agents — Fully Automated Dev Pipeline              ║
╠══════════════════════════════════════════════════════════════╣
║  👑 pm      — Project Manager & Architect                    ║
║  🎨 ui      — UI/UX Designer                                 ║
║  ⚙️  be      — Backend Engineer                               ║
║  🖥️  fe      — Frontend Engineer                              ║
║  👁️  review  — Code Reviewer (Gác cổng)                      ║
║  🧪 test    — QA Automation Engineer                         ║
║  📚 doc     — Technical Writer                               ║
╚══════════════════════════════════════════════════════════════╝
""")


def validate_environment():
    """Kiểm tra môi trường trước khi chạy"""
    errors = []
    
    if not os.getenv("GEMINI_API_KEY") and not os.getenv("OPENAI_API_KEY"):
        errors.append("❌ Chưa có API Key! Hãy copy .env.example thành .env và điền API Key.")
    
    rinoapp_root = os.getenv("RINOAPP_ROOT", r"c:\Users\Jacky Tran\Documents\Rinoapp")
    db_path = Path(rinoapp_root) / "mock-server" / "db.json"
    if not db_path.exists():
        errors.append(f"❌ Không tìm thấy mock-server/db.json tại: {db_path}")
    
    if errors:
        print("\n".join(errors))
        print("\n💡 Hướng dẫn setup:")
        print("   1. cd agents")
        print("   2. copy .env.example .env")
        print("   3. Mở .env và điền GEMINI_API_KEY hoặc OPENAI_API_KEY")
        print("   4. Chạy lại: python main.py \"yêu cầu của bạn\"")
        return False
    return True


def main():
    print_banner()
    
    # Lấy feature request từ args
    if len(sys.argv) < 2:
        print("⚠️  Thiếu yêu cầu tính năng!")
        print("Cách dùng: python main.py \"Mô tả tính năng bạn muốn làm\"")
        print("\nVí dụ:")
        print("  python main.py \"Tạo màn hình danh sách học sinh module education\"")
        sys.exit(1)

    feature_request = " ".join(sys.argv[1:])
    
    print(f"📋 Yêu cầu nhận được:")
    print(f"   {feature_request}\n")
    
    # Validate môi trường
    if not validate_environment():
        sys.exit(1)
    
    # Import và chạy crew
    from rinoedu_factory.crew import build_crew
    
    print("🚀 Khởi động AI Factory...\n")
    start_time = time.time()
    
    try:
        crew = build_crew(feature_request)
        result = crew.kickoff()
        
        elapsed = time.time() - start_time
        minutes = int(elapsed // 60)
        seconds = int(elapsed % 60)
        
        print(f"\n{'='*60}")
        print(f"✅ AI FACTORY HOÀN TẤT trong {minutes}m {seconds}s")
        print(f"{'='*60}")
        print("\n📊 BÁO CÁO KẾT QUẢ CUỐI CÙNG:")
        print(result)
        
    except KeyboardInterrupt:
        print("\n⏹️  Đã dừng AI Factory theo yêu cầu.")
    except Exception as e:
        print(f"\n❌ Lỗi trong quá trình chạy: {str(e)}")
        print("Kiểm tra file .env và API Key của bạn.")
        raise


if __name__ == "__main__":
    main()
