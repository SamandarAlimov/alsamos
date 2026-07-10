export default {
  async email(message, env, ctx) {
    const raw = await new Response(message.raw).text();
    const parsed = parseRawEmail(raw, message.headers);
    const payload = {
      to: message.to,
      from_name: parsed.fromName,
      from_email: parsed.fromEmail,
      subject: parsed.subject || message.headers.get("subject") || "",
      html: parsed.html,
      text: parsed.text,
      message_id: parsed.messageId || message.headers.get("message-id") || crypto.randomUUID(),
    };

    const res = await fetch(env.INBOUND_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-alsamos-inbound-secret": env.INBOUND_SHARED_SECRET,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Inbound webhook failed: ${res.status}`);
    }
  },
};

function parseRawEmail(raw, headers) {
  const from = headers.get("from") || "";
  const match = from.match(/^(?:"?([^"<]*)"?\s*)?<([^>]+)>$/);
  const fromName = match ? match[1].trim() : "";
  const fromEmail = match ? match[2].trim() : from.trim();
  const subject = decodeHeader(headers.get("subject") || "");
  const messageId = (headers.get("message-id") || "").replace(/^<|>$/g, "");
  return {
    fromName,
    fromEmail,
    subject,
    messageId,
    html: extractPart(raw, "text/html"),
    text: extractPart(raw, "text/plain") || raw.slice(0, 120000),
  };
}

function extractPart(raw, contentType) {
  const lower = raw.toLowerCase();
  const marker = `content-type: ${contentType}`;
  const start = lower.indexOf(marker);
  if (start === -1) {
    return "";
  }
  const bodyStart = raw.indexOf("\r\n\r\n", start);
  if (bodyStart === -1) {
    return "";
  }
  let body = raw.slice(bodyStart + 4);
  const boundary = body.match(/\r\n--[^\r\n-]+/);
  if (boundary) {
    body = body.slice(0, boundary.index);
  }
  return body.trim().slice(0, 120000);
}

function decodeHeader(value) {
  return value.replace(/=\?utf-8\?b\?([^?]+)\?=/gi, (_, b64) => {
    try {
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return value;
    }
  });
}
