import json
import os
from typing import Any, AsyncIterator

import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse

app = FastAPI(title="Alsamos AI Gateway", version="0.3.0")
DEFAULT_MODEL = os.getenv("AI_MODEL", "pollinations/openai")
ROUTES = {"chat", "image", "video", "document", "code", "spreadsheet", "slides", "diagram"}


def require_access(x_api_key: str | None, x_alsamos_subject: str | None) -> None:
    expected = os.getenv("AI_API_KEY")
    if x_alsamos_subject or (expected and x_api_key == expected):
        return
    if not expected:
        raise HTTPException(status_code=503, detail="AI gateway authentication is not configured")
    raise HTTPException(status_code=401, detail="Invalid AI gateway credentials")


def classify(message: str, hinted: str | None = None) -> tuple[str, float]:
    text = message.lower()
    if hinted in ROUTES and hinted != "chat":
        return hinted, 1.0
    groups = {
        "image": ["rasm", "draw", "image", "picture", "logo", "illustration", "chiz", "нарисуй", "изображение"],
        "video": ["video", "videoni", "ролик", "видео"],
        "document": ["hujjat", "document", "pdf", "docx", "hisobot", "report"],
        "code": ["kod", "code", "react", "flutter", "python", "typescript", "javascript", "debug"],
        "spreadsheet": ["excel", "xlsx", "spreadsheet", "jadval", "formula"],
        "slides": ["slayd", "slides", "powerpoint", "presentation", "taqdimot"],
        "diagram": ["diagram", "flowchart", "arxitektura sxemasi", "mind map"],
    }
    for route, words in groups.items():
        if any(word in text for word in words):
            return route, 0.88
    return "chat", 0.99


def build_messages(payload: dict[str, Any]) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = []
    context: list[str] = []
    if payload.get("projectInstructions"):
        context.append(f"Project instructions: {payload['projectInstructions']}")
    context.extend(f"Memory: {item}" for item in payload.get("memoryContext") or [])
    context.extend(f"Enabled skill: {skill}" for skill in payload.get("skillIds") or [])
    if context:
        messages.append({"role": "system", "content": "\n".join(context)})
    for item in payload.get("history") or []:
        role = item.get("role")
        content = str(item.get("content") or "").strip()
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content})
    message = str(payload.get("message") or "").strip()
    if message:
        messages.append({"role": "user", "content": message})
    return messages


def provider_config(model: str) -> tuple[str, str, dict[str, str]]:
    if model.startswith("openrouter/"):
        key = os.getenv("OPENROUTER_API_KEY")
        if not key:
            raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY is not configured")
        return (
            "https://openrouter.ai/api/v1/chat/completions",
            model.removeprefix("openrouter/"),
            {
                "Authorization": f"Bearer {key}",
                "HTTP-Referer": os.getenv("APP_PUBLIC_URL", "https://alsamos.com"),
                "X-Title": "Alsamos",
            },
        )
    return "https://text.pollinations.ai/openai", model.removeprefix("pollinations/"), {}


async def provider_completion(payload: dict[str, Any], stream: bool = False) -> httpx.Response:
    model = str(payload.get("model") or DEFAULT_MODEL)
    url, provider_model, headers = provider_config(model)
    forwarded = {**payload, "model": provider_model, "stream": stream}
    async with httpx.AsyncClient(timeout=None if stream else 60) as client:
        return await client.post(url, headers=headers, json=forwarded)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/v1/models")
def models(x_api_key: str | None = Header(default=None), x_alsamos_subject: str | None = Header(default=None)) -> dict[str, Any]:
    require_access(x_api_key, x_alsamos_subject)
    return {"object": "list", "data": [{"id": DEFAULT_MODEL, "object": "model", "owned_by": "alsamos"}]}


@app.post("/v1/intent")
async def intent(payload: dict[str, Any], x_api_key: str | None = Header(default=None), x_alsamos_subject: str | None = Header(default=None)) -> dict[str, Any]:
    require_access(x_api_key, x_alsamos_subject)
    route, confidence = classify(str(payload.get("message") or ""), payload.get("hintedRoute"))
    return {"route": route, "confidence": confidence, "requiresClarification": False}


@app.post("/v1/generate")
async def generate(payload: dict[str, Any], x_api_key: str | None = Header(default=None), x_alsamos_subject: str | None = Header(default=None)) -> dict[str, Any]:
    require_access(x_api_key, x_alsamos_subject)
    route, _ = classify(str(payload.get("message") or ""), payload.get("route"))
    response = await provider_completion({"model": DEFAULT_MODEL, "messages": build_messages(payload)}, stream=False)
    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    data = response.json()
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    return {"messageId": os.urandom(12).hex(), "conversationId": payload.get("conversationId") or os.urandom(12).hex(), "route": route, "content": content}


async def provider_stream(payload: dict[str, Any]) -> AsyncIterator[str]:
    model = str(payload.get("model") or DEFAULT_MODEL)
    url, provider_model, headers = provider_config(model)
    request_payload = {**payload, "model": provider_model, "stream": True}
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, headers=headers, json=request_payload) as response:
            if response.status_code >= 400:
                body = await response.aread()
                yield f"data: {json.dumps({'type':'error','error':{'code':str(response.status_code),'message':body.decode(errors='replace'),'retryable':response.status_code >= 500}})}\n\n"
                return
            buffer = ""
            async for chunk in response.aiter_text():
                buffer += chunk
                frames = buffer.split("\n\n")
                buffer = frames.pop() or ""
                for frame in frames:
                    for line in frame.splitlines():
                        if not line.startswith("data:"):
                            continue
                        raw = line[5:].strip()
                        if not raw or raw == "[DONE]":
                            continue
                        try:
                            data = json.loads(raw)
                            delta = data.get("choices", [{}])[0].get("delta", {}).get("content")
                            if delta:
                                yield f"data: {json.dumps({'type':'message.delta','delta':delta})}\n\n"
                        except json.JSONDecodeError:
                            continue


@app.post("/v1/stream")
async def stream(payload: dict[str, Any], x_api_key: str | None = Header(default=None), x_alsamos_subject: str | None = Header(default=None)) -> StreamingResponse:
    require_access(x_api_key, x_alsamos_subject)
    route, _ = classify(str(payload.get("message") or ""), payload.get("route"))
    message_id = os.urandom(12).hex()

    async def event_stream():
        try:
            async for event in provider_stream({"model": DEFAULT_MODEL, "messages": build_messages(payload)}):
                yield event
        except HTTPException as exc:
            yield f"data: {json.dumps({'type':'error','error':{'code':str(exc.status_code),'message':str(exc.detail),'retryable':exc.status_code >= 500}})}\n\n"
            return
        yield f"data: {json.dumps({'type':'message.completed','messageId':message_id,'route':route})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers={"Cache-Control":"no-cache", "X-Accel-Buffering":"no"})


@app.post("/v1/chat/completions")
async def chat_completions(payload: dict[str, Any], x_api_key: str | None = Header(default=None), x_alsamos_subject: str | None = Header(default=None)) -> Any:
    require_access(x_api_key, x_alsamos_subject)
    response = await provider_completion(payload, stream=False)
    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()
