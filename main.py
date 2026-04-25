import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from starlette.applications import Starlette
from starlette.routing import Route, Mount
from starlette.requests import Request
from starlette.responses import JSONResponse, FileResponse, PlainTextResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
import json
import httpx
import time

# --- LIGHTWEIGHT ASSISTANT (No ADK) ---
from assistant_agent import init_db
from assistant_agent.database import save_message, get_chat_history, get_tasks, get_notes, set_new_session, get_sessions, get_session_messages
from assistant_agent.deterministic_agent import run_deterministic_query

# --- INITIALISE DATABASE ---
init_db()

# --- PLATFORM DETECTION ---
def detect_platform() -> dict:
    if os.environ.get("VERCEL"):
        return {"name": "Vercel", "icon": "▲"}
    elif os.environ.get("SPACE_ID"):
        return {"name": "Hugging Face Spaces", "icon": "🤗", "space_id": os.environ.get("SPACE_ID")}
    elif os.environ.get("RENDER"):
        return {"name": "Render", "icon": "⚡"}
    elif os.environ.get("K_SERVICE"):
        return {"name": "Google Cloud Run", "icon": "☁️"}
    else:
        return {"name": "Local Development", "icon": "💻"}

PLATFORM = detect_platform()
print(f"Runtime Platform: {PLATFORM['name']}")

port = int(os.environ.get("PORT", 3000))

# --- TAVILY WEB SEARCH ---
async def fetch_web_context(query: str) -> str:
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        return ""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://api.tavily.com/search",
                json={"api_key": api_key, "query": query, "search_depth": "basic", "include_answer": False, "max_results": 2},
                timeout=5.0
            )
            if res.status_code == 200:
                results = res.json().get("results", [])
                context = "\n".join([f"- {r['title']}: {r['content']}" for r in results])
                return f"### WEB CONTEXT:\n{context}\n"
    except Exception:
        pass
    return ""

# ── Endpoints ───────────────────────────────────────────────────────────────

async def root(request: Request):
    if os.path.exists("frontend/dist/index.html"):
        return FileResponse("frontend/dist/index.html")
    return JSONResponse({"status": "ok", "service": "Career AI"})

async def health_check(request: Request):
    return JSONResponse({"status": "healthy", "service": "Career AI", "platform": PLATFORM})

async def ping(request: Request):
    return PlainTextResponse("pong")

async def chat_history(request: Request):
    return JSONResponse({"history": get_chat_history()})

async def dashboard_data(request: Request):
    return JSONResponse({
        "tasks": get_tasks(status="pending")[:5],
        "notes": get_notes()[:3],
        "system": {"model": os.environ.get("MODEL", "gemini-2.0-flash")}
    })

async def new_chat(request: Request):
    session_id = set_new_session()
    return JSONResponse({"status": "ok", "session_id": session_id})

async def list_sessions(request: Request):
    return JSONResponse({"sessions": get_sessions()})

async def session_detail(request: Request):
    session_id = request.path_params["session_id"]
    return JSONResponse({"messages": get_session_messages(int(session_id))})


# ── LLM ENGINE CALLERS ──────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are Gemini, a helpful, friendly, and highly intelligent personal assistant for Career AI. 
Be concise, fluid, and premium in your responses. Do not sound generic or robotic.
You help with career guidance, task management, scheduling, and general questions.
Use Markdown formatting for better readability."""

async def call_groq(text, history, enriched_prompt):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("No Groq API key")
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 500,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *[{"role": "assistant" if m['role'] == "bot" else "user", "content": m['content']} for m in history],
                    {"role": "user", "content": enriched_prompt}
                ]
            },
            timeout=15.0
        )
        if res.status_code == 200:
            data = res.json()
            return data['choices'][0]['message']['content'], data.get('usage', {}).get('total_tokens', 0), "Gemini 2.0 Flash"
        raise Exception(f"Groq API Error: {res.status_code}")

async def call_gemini_api(text, history, enriched_prompt):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("No Google API key")
    from google import genai
    client = genai.Client(api_key=api_key)
    history_genai = [{"role": "model" if m['role'] == "bot" else "user", "parts": [m['content']]} for m in history]
    res = await client.aio.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            {"role": "user", "parts": [SYSTEM_PROMPT]},
            {"role": "model", "parts": ["Understood. I'm ready to help."]},
            *history_genai,
            {"role": "user", "parts": [enriched_prompt]}
        ]
    )
    tokens = res.usage_metadata.total_token_count if hasattr(res, 'usage_metadata') else len(res.text) // 4
    return res.text, tokens, "Gemini 2.0 Flash"

async def call_deep_cloud(text, history, enriched_prompt):
    together_key = os.environ.get("TOGETHER_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    fallback_key = together_key or openai_key
    if not fallback_key:
        raise ValueError("No fallback API key")
    fallback_url = "https://api.together.xyz/v1/chat/completions" if together_key else "https://api.openai.com/v1/chat/completions"
    fallback_model = "meta-llama/Llama-3.3-70B-Instruct-Turbo" if together_key else "gpt-4o-mini"
    async with httpx.AsyncClient() as client:
        res = await client.post(
            fallback_url,
            headers={"Authorization": f"Bearer {fallback_key}"},
            json={
                "model": fallback_model,
                "max_tokens": 500,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *[{"role": "assistant" if m['role'] == "bot" else "user", "content": m['content']} for m in history],
                    {"role": "user", "content": enriched_prompt}
                ]
            },
            timeout=15.0
        )
        if res.status_code == 200:
            data = res.json()
            return data['choices'][0]['message']['content'], data.get('usage', {}).get('total_tokens', 0), "Gemini Cloud"
        raise Exception(f"Cloud API Error: {res.status_code}")


async def query_agent(request: Request):
    try:
        form = await request.form()
        text = form.get("text")
        if not text:
            return JSONResponse({"detail": "Missing 'text' field"}, status_code=400)

        history = get_chat_history(limit=5)
        save_message("user", text)
        start_time = time.perf_counter()
        
        context = await fetch_web_context(text)
        enriched_prompt = f"{context}\n{text}" if context else text
        
        response_text, tokens_used, agent_used = None, 0, None
        
        # Route 1: Groq (fastest)
        try:
            response_text, tokens_used, agent_used = await call_groq(text, history, enriched_prompt)
        except Exception as e:
            print(f"Groq failed: {e}")
            # Route 2: Gemini API
            try:
                response_text, tokens_used, agent_used = await call_gemini_api(text, history, enriched_prompt)
            except Exception as e2:
                print(f"Gemini failed: {e2}")
                # Route 3: Together/OpenAI
                try:
                    response_text, tokens_used, agent_used = await call_deep_cloud(text, history, enriched_prompt)
                except Exception as e3:
                    print(f"Cloud failed: {e3}")

        duration = round(time.perf_counter() - start_time, 2)
        tps = round(tokens_used / duration, 1) if duration > 0 else 0
        
        if response_text and response_text.strip():
            save_message("bot", response_text, agent=agent_used, duration=duration, tokens=tokens_used, tps=tps)
            return JSONResponse({"response": response_text, "metadata": {"agent": agent_used, "duration": duration, "tokens": tokens_used, "tps": tps}})
        
        # Fallback: Deterministic
        response_text = run_deterministic_query(text)
        duration = round(time.perf_counter() - start_time, 2)
        save_message("bot", response_text, agent="System", duration=duration, tokens=len(response_text) // 4, tps=0)
        return JSONResponse({"response": response_text, "metadata": {"agent": "System", "duration": duration}})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse({"detail": str(e)}, status_code=500)


# ── App Assembly ────────────────────────────────────────────────────────────

routes = [
    Route("/", root, methods=["GET", "HEAD"]),
    Route("/health", health_check, methods=["GET"]),
    Route("/ping", ping, methods=["GET"]),
    Route("/history", chat_history, methods=["GET"]),
    Route("/dashboard", dashboard_data, methods=["GET"]),
    Route("/query", query_agent, methods=["POST"]),
    Route("/new-chat", new_chat, methods=["POST"]),
    Route("/sessions", list_sessions, methods=["GET"]),
    Route("/sessions/{session_id:int}", session_detail, methods=["GET"]),
]

if os.path.exists("frontend/dist/assets"):
    routes.append(Mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets"))

middleware = [
    Middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
]

app = Starlette(debug=False, routes=routes, middleware=middleware)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
