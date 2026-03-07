"""
RinoEdu AI Factory — Crew Pipeline
Kết nối 7 Agents + Tasks thành một luồng tự động hoàn chỉnh
"""
import os
import yaml
from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv

# Import các Tools
from rinoedu_factory.tools.file_writer import FileWriterTool
from rinoedu_factory.tools.mock_server import MockServerTool
from rinoedu_factory.tools.git_tool import GitTool
from rinoedu_factory.tools.doc_writer import DocWriterTool

load_dotenv()

# ── Khởi tạo LLM (tự động chọn theo biến môi trường) ──
def get_llm():
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    if openai_key:
        model = os.getenv("LLM_MODEL", "gpt-5.4")
        return LLM(model=model, api_key=openai_key, temperature=0.3)
    elif gemini_key:
        model = os.getenv("LLM_MODEL", "gemini/gemini-2.0-flash")
        return LLM(model=model, api_key=gemini_key, temperature=0.3)
    else:
        raise ValueError(
            "Chua co API Key! "
            "Hay dien OPENAI_API_KEY hoac GEMINI_API_KEY vao file .env"
        )



# ── Tải cấu hình YAML ──
CONFIG_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "config")

def load_yaml(filename):
    with open(os.path.join(CONFIG_DIR, filename), "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def build_crew(feature_request: str) -> Crew:
    """
    Xây dựng Crew với 7 agents và 7 tasks từ file cấu hình YAML.
    feature_request: Yêu cầu tính năng từ Human Developer.
    """
    agents_config = load_yaml("agents.yaml")
    tasks_config  = load_yaml("tasks.yaml")
    llm = get_llm()

    # ── Khởi tạo Tools ──
    file_writer_tool  = FileWriterTool()
    mock_server_tool  = MockServerTool()
    git_tool          = GitTool()
    doc_writer_tool   = DocWriterTool()

    # ── Khởi tạo 7 Agents ──
    def make_agent(key, tools=None):
        cfg = agents_config[key]
        return Agent(
            role=cfg["role"],
            goal=cfg["goal"],
            backstory=cfg["backstory"],
            llm=llm,
            tools=tools or [],
            verbose=cfg.get("verbose", True),
            max_iter=cfg.get("max_iter", 3),
            allow_delegation=False,
        )

    pm_agent     = make_agent("pm",     tools=[git_tool])
    ui_agent     = make_agent("ui")
    be_agent     = make_agent("be",     tools=[mock_server_tool])
    fe_agent     = make_agent("fe",     tools=[file_writer_tool])
    review_agent = make_agent("review")
    test_agent   = make_agent("test")
    doc_agent    = make_agent("doc",    tools=[doc_writer_tool])

    # ── Tạo 7 Tasks theo thứ tự pipeline ──
    task_plan = Task(
        description=tasks_config["planning_task"]["description"].format(
            feature_request=feature_request
        ),
        expected_output=tasks_config["planning_task"]["expected_output"],
        agent=pm_agent,
    )

    task_be = Task(
        description=tasks_config["backend_task"]["description"].format(
            planning_output="{task_plan.output}"
        ),
        expected_output=tasks_config["backend_task"]["expected_output"],
        agent=be_agent,
        context=[task_plan],
    )

    task_ui = Task(
        description=tasks_config["ui_design_task"]["description"].format(
            planning_output="{task_plan.output}"
        ),
        expected_output=tasks_config["ui_design_task"]["expected_output"],
        agent=ui_agent,
        context=[task_plan],
    )

    task_fe = Task(
        description=tasks_config["frontend_task"]["description"].format(
            planning_output="{task_plan.output}",
            backend_output="{task_be.output}",
            ui_output="{task_ui.output}",
        ),
        expected_output=tasks_config["frontend_task"]["expected_output"],
        agent=fe_agent,
        context=[task_plan, task_be, task_ui],
    )

    task_review = Task(
        description=tasks_config["review_task"]["description"].format(
            backend_output="{task_be.output}",
            frontend_output="{task_fe.output}",
        ),
        expected_output=tasks_config["review_task"]["expected_output"],
        agent=review_agent,
        context=[task_be, task_fe],
    )

    task_test = Task(
        description=tasks_config["test_task"]["description"].format(
            planning_output="{task_plan.output}"
        ),
        expected_output=tasks_config["test_task"]["expected_output"],
        agent=test_agent,
        context=[task_plan, task_be, task_fe, task_review],
    )

    task_doc = Task(
        description=tasks_config["documentation_task"]["description"].format(
            planning_output="{task_plan.output}",
            backend_output="{task_be.output}",
            review_output="{task_review.output}",
        ),
        expected_output=tasks_config["documentation_task"]["expected_output"],
        agent=doc_agent,
        context=[task_plan, task_be, task_review, task_test],
    )

    # ── Tổ hợp thành Crew ──
    crew = Crew(
        agents=[pm_agent, be_agent, ui_agent, fe_agent, review_agent, test_agent, doc_agent],
        tasks=[task_plan, task_be, task_ui, task_fe, task_review, task_test, task_doc],
        process=Process.sequential,   # Chạy tuần tự, output task trước làm input task sau
        verbose=True,
        memory=True,                  # Ghi nhớ context xuyên suốt session
    )

    return crew
