import os
from typing import Any

import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse

app = FastAPI(title="Alsamos AI Gateway", version="0.1.0")

FREE_MODELS = [
    {
        "id": "openrouter/auto:free",
        "object": "model",
        "owned_by": "openrouter",
    },
    {
        "id": "pollinations/openai",
        "object": "model",
        "owned_by": "pollinations",
    },
]


def require_api_key(x_api_key: str | None) -> None:
    expected = os.getenv("AI_API_KEY")
    if not expected:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")
    if x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/v1/models")
def models(x_api_key: str | None = Header(default=None)) -> dict[str, Any]:
    require_api_key(x_api_key)
    return {"object": "list", "data": FREE_MODELS}


@app.post("/v1/chat/completions")
async def chat_completions(
    payload: dict[str, Any],
    x_api_key: str | None = Header(default=None),
) -> Any:
    require_api_key(x_api_key)

    model = str(payload.get("model") or "pollinations/openai")
    if model.endswith(":free") or model.startswith("openrouter/"):
        openrouter_key = os.getenv("OPENROUTER_API_KEY")
        if not openrouter_key:
            raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY is not configured")
        forwarded = {**payload, "model": model.removeprefix("openrouter/")}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openrouter_key}",
                    "HTTP-Referer": os.getenv("APP_PUBLIC_URL", "https://alsamos.com"),
                    "X-Title": "Alsamos",
                },
                json=forwarded,
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

    if model.startswith("pollinations/"):
        forwarded = {**payload, "model": model.removeprefix("pollinations/")}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://text.pollinations.ai/openai",
                json=forwarded,
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

    raise HTTPException(status_code=400, detail="Only free OpenRouter or Pollinations models are allowed")


@app.post("/v1/chat/completions/stream")
async def chat_completions_stream(
    payload: dict[str, Any],
    x_api_key: str | None = Header(default=None),
) -> StreamingResponse:
    require_api_key(x_api_key)
    model = str(payload.get("model") or "")
    if not model.startswith("pollinations/"):
        raise HTTPException(status_code=400, detail="Streaming is currently enabled only for Pollinations")
    forwarded = {**payload, "model": model.removeprefix("pollinations/"), "stream": True}

    async def stream():
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", "https://text.pollinations.ai/openai", json=forwarded) as response:
                async for chunk in response.aiter_bytes():
                    yield chunk

    return StreamingResponse(stream(), media_type="text/event-stream")

