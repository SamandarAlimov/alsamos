import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Bot, User, Sparkles, 
  Package, Building2, Briefcase, ChevronRight, Loader2, Mic, MicOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  message: string;
  icon: React.ReactNode;
}

const quickReplies: QuickReply[] = [
  { label: "Products", message: "What products does ALSAMOS offer?", icon: <Package className="w-4 h-4" /> },
  { label: "Industries", message: "Tell me about ALSAMOS industries", icon: <Building2 className="w-4 h-4" /> },
  { label: "Careers", message: "Are there job openings at ALSAMOS?", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Investment", message: "How can I invest in ALSAMOS?", icon: <Sparkles className="w-4 h-4" /> },
];

const extractLinks = (content: string): { label: string; href: string }[] => {
  const links: { label: string; href: string }[] = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes("product") || lowerContent.includes("phone") || lowerContent.includes("laptop") || lowerContent.includes("watch")) {
    links.push({ label: "View Products", href: "/products" });
  }
  if (lowerContent.includes("industr") || lowerContent.includes("sector")) {
    links.push({ label: "Explore Industries", href: "/industries" });
  }
  if (lowerContent.includes("career") || lowerContent.includes("job") || lowerContent.includes("hiring")) {
    links.push({ label: "View Careers", href: "/careers" });
  }
  if (lowerContent.includes("invest")) {
    links.push({ label: "Investor Relations", href: "/investors" });
  }
  if (lowerContent.includes("contact") || lowerContent.includes("email") || lowerContent.includes("phone")) {
    links.push({ label: "Contact Us", href: "/contact" });
  }
  
  return links.slice(0, 2);
};

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm the ALSAMOS AI Assistant. How can I help you today? 🚀",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started. Speak now...");
    } catch (error) {
      toast.error("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Processing voice input...");
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        if (!base64Audio) {
          toast.error("Failed to process audio");
          return;
        }

        // For now, just set a placeholder text
        // In a real implementation, you'd send this to a speech-to-text service
        setInput("Voice input detected - speech-to-text coming soon!");
        toast.success("Voice captured! Type to edit or send.");
      };
    } catch (error: any) {
      toast.error(error.message || "Failed to process voice input");
    }
  };

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Create placeholder assistant message
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, {
      id: assistantMessageId,
      type: "assistant",
      content: "",
      timestamp: new Date(),
    }]);

    try {
      // Build conversation history
      const conversationHistory = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
        }));
      
      conversationHistory.push({ role: "user", content: messageText });

      // Call the edge function with streaming
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: conversationHistory }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => 
                prev.map((m) => 
                  m.id === assistantMessageId 
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch {
            // Incomplete JSON, put back and continue
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        const lines = buffer.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]" || !jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
            }
          } catch {
            // Ignore parse errors on final buffer
          }
        }
      }

      // Final update
      setMessages((prev) => 
        prev.map((m) => 
          m.id === assistantMessageId 
            ? { ...m, content: assistantContent || "I apologize, but I couldn't generate a response. Please try again." }
            : m
        )
      );

      // Add relevant links
      const links = extractLinks(assistantContent);
      if (links.length > 0) {
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 2).toString(),
            type: "assistant",
            content: `__LINKS__${JSON.stringify(links)}`,
            timestamp: new Date(),
          }]);
        }, 300);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => 
        prev.map((m) => 
          m.id === assistantMessageId 
            ? { ...m, content: "I'm sorry, I encountered an error. Please try again in a moment." }
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (message: Message) => {
    if (message.content.startsWith("__LINKS__")) {
      try {
        const links = JSON.parse(message.content.replace("__LINKS__", ""));
        return (
          <div className="flex flex-wrap gap-2 mt-2">
            {links.map((link: { label: string; href: string }) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {link.label}
                <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        );
      } catch {
        return null;
      }
    }
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center glow-primary transition-transform hover:scale-110",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">ALSAMOS Assistant</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Online • AI Powered
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.type === "user" && "flex-row-reverse"
                  )}
                >
                  {!message.content.startsWith("__LINKS__") && (
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        message.type === "assistant" ? "bg-primary/10" : "bg-muted"
                      )}
                    >
                      {message.type === "assistant" ? (
                        <Bot className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      message.content.startsWith("__LINKS__") 
                        ? "bg-transparent px-0"
                        : message.type === "assistant"
                          ? "bg-muted text-foreground rounded-tl-none"
                          : "bg-primary text-primary-foreground rounded-tr-none"
                    )}
                  >
                    {renderMessage(message)}
                  </div>
                </motion.div>
              ))}

              {isTyping && messages[messages.length - 1]?.content === "" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.label}
                      onClick={() => handleSend(reply.message)}
                      disabled={isTyping}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50 text-foreground text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      {reply.icon}
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={isRecording ? "Recording..." : "Type your message..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping || isRecording}
                  className="flex-1 h-10 px-4 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
                <Button
                  size="icon"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTyping}
                  variant={isRecording ? "destructive" : "outline"}
                  className={cn(
                    "h-10 w-10 rounded-xl",
                    isRecording && "animate-pulse"
                  )}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping || isRecording}
                  className="h-10 w-10 rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Powered by ALSAMOS AI • Voice enabled
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
