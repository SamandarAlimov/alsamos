from app.main import build_messages, classify


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
