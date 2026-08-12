import PostalMime from "postal-mime";

export default {
  async email(message, env) {
    const raw = await new Response(message.raw).arrayBuffer();
    const parsed = await PostalMime.parse(raw);
    const htmlWithInlineImages = inlineCidImages(parsed.html || "", parsed.attachments || []);
    const text = parsed.text || "";
    const html = htmlWithInlineImages || textToHtml(text);
    const from = parsed.from || {};

    const payload = {
      to: firstAddress(parsed.to) || message.to,
      cc: addresses(parsed.cc),
      from_name: from.name || "",
      from_email: from.address || "",
      subject: parsed.subject || "",
      html,
      text,
      message_id: cleanMessageId(parsed.messageId || message.headers.get("message-id")) || crypto.randomUUID(),
      attachments: attachmentMetadata(parsed.attachments || []),
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

function firstAddress(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list[0]?.address || "";
}

function addresses(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
    .filter((item) => item?.address)
    .map((item) => ({ name: item.name || "", email: item.address }));
}

function cleanMessageId(value) {
  return (value || "").replace(/^<|>$/g, "").trim();
}

function inlineCidImages(html, attachments) {
  let output = html || "";
  for (const attachment of attachments) {
    const cid = cleanMessageId(attachment.contentId || attachment.cid);
    const mimeType = attachment.mimeType || attachment.contentType || "";
    if (!cid || !mimeType.startsWith("image/") || !attachment.content) continue;
    const dataUri = `data:${mimeType};base64,${toBase64(attachment.content)}`;
    output = output.replace(new RegExp(`cid:${escapeRegExp(cid)}`, "gi"), dataUri);
  }
  return output;
}

function attachmentMetadata(attachments) {
  return attachments
    .filter((attachment) => !attachment.contentId && attachment.disposition !== "inline")
    .map((attachment) => ({
      name: attachment.filename || "attachment",
      size: byteLength(attachment.content),
      type: attachment.mimeType || attachment.contentType || "application/octet-stream",
      content_id: cleanMessageId(attachment.contentId || attachment.cid),
    }));
}

function byteLength(content) {
  if (!content) return 0;
  if (content instanceof ArrayBuffer) return content.byteLength;
  if (ArrayBuffer.isView(content)) return content.byteLength;
  return String(content).length;
}

function toBase64(content) {
  const bytes = content instanceof ArrayBuffer ? new Uint8Array(content) : new Uint8Array(content.buffer || content);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function textToHtml(text) {
  return escapeHtml(text || "")
    .replace(/\b((?:https?:\/\/|mailto:)[^\s<>"']+)/gi, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\r?\n/g, "<br>");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
