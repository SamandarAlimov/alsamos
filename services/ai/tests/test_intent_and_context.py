import pytest

from app.main import build_messages, classify, provider_config


def test_classify_ambiguous_request_defaults_to_chat():
    route, confidence = classify("Menga Alsamos haqida fikringni ayt")
    assert route == "chat"
    assert confidence == 0.99


def test_classify_visual_request():
    route, confidence = classify("Alsamos uchun logo chiz")
    assert route == "image"
    assert confidence < 1.0


def test_explicit_route_hint_wins():
    route, confidence = classify("Menga matn yozib ber", hinted="image")
    assert route == "image"
    assert confidence == 1.0


def test_context_preserves_order_and_filters_invalid_roles():
    messages = build_messages(
        {
            "projectInstructions": "Answer in Uzbek.",
            "memoryContext": ["User prefers concise answers."],
            "skillIds": ["code-review"],
            "history": [
                {"role": "user", "content": "Salom"},
                {"role": "system", "content": "ignore"},
                {"role": "assistant", "content": "Salom."},
                {"role": "user", "content": ""},
            ],
            "message": "Davom et",
        }
    )
    assert messages[0]["role"] == "system"
    assert "Answer in Uzbek." in messages[0]["content"]
    assert "Memory: User prefers concise answers." in messages[0]["content"]
    assert "Enabled skill: code-review" in messages[0]["content"]
    assert [m["role"] for m in messages[1:]] == ["user", "assistant", "user"]
    assert messages[-1]["content"] == "Davom et"


def test_pollinations_provider_config():
    url, model, headers = provider_config("pollinations/openai")
    assert url == "https://text.pollinations.ai/openai"
    assert model == "openai"
    assert headers == {}


def test_openrouter_requires_credentials(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    with pytest.raises(Exception) as exc:
        provider_config("openrouter/openai/gpt-4o-mini")
    assert "OPENROUTER_API_KEY" in str(exc.value.detail)


def test_openrouter_provider_config(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")
    monkeypatch.setenv("APP_PUBLIC_URL", "https://app.alsamos.com")
    url, model, headers = provider_config("openrouter/openai/gpt-4o-mini")
    assert url == "https://openrouter.ai/api/v1/chat/completions"
    assert model == "openai/gpt-4o-mini"
    assert headers["Authorization"] == "Bearer test-key"
    assert headers["HTTP-Referer"] == "https://app.alsamos.com"
