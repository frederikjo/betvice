import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  X,
  Minimize,
  Maximize,
  Copy,
  Check,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useBettingAssistant } from "@/context/BettingAssistantContext";
import {
  detectIntent,
  botResponseHandlers,
} from "@/lib/chatBotLogic";

const BettingAssistant = () => {
  const { isOpen, toggleChatbot, savedMessages, clearSavedMessages } =
    useBettingAssistant();

  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hi! I'm your betting assistant. Ask me anything about today's matches or BTTS predictions!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current)
      inputRef.current.focus();
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (savedMessages.length > 0) {
      savedMessages.forEach((msg) => handleSendMessage(msg));
      clearSavedMessages();
    }
  }, [savedMessages]);

  const handleSendMessage = async (
    messageText: string | null = null
  ) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      content: text,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add "Bot is typing..." message
    const botTypingMessage = {
      id: messages.length + 2,
      content: "Bot is typing...",
      sender: "bot" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botTypingMessage]);

    try {
      // Detect intent and run handler
      const intent = detectIntent(text);
      const response = await botResponseHandlers[intent]();

      // Replace typing message with real bot response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botTypingMessage.id
            ? { ...m, content: response }
            : m
        )
      );
    } catch (error) {
      console.error("Error processing message:", error);

      // Replace typing message with error message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botTypingMessage.id
            ? {
                ...m,
                content:
                  "Sorry, I encountered an error. Please try again later.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard
      .writeText(content)
      .then(() => setCopiedMessageId(content));
  };

  const formatTimestamp = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!isOpen) return null;

  return (
    <Card
      className={`fixed bottom-4 overflow-scroll right-4 shadow-lg z-50 ${
        isMinimized ? "w-48 h-12" : "w-80 h-96 md:w-96 md:h-[450px]"
      }`}
    >
      <CardHeader className="bg-primary/5 flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src="/bot-avatar.png" />
            <AvatarFallback>
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-sm">Betting Assistant</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize className="w-4 h-4" />
            </Button>
          )}
          {isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleChatbot}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex flex-col flex-1 p-3 overflow-hidden">
            <ScrollArea className="flex-1 pr-3 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "bot"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg text-sm ${
                      msg.sender === "bot"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div className="text-muted-foreground flex items-center justify-between mt-1 text-xs">
                      <span>{formatTimestamp(msg.timestamp)}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleCopyMessage(msg.content)
                              }
                            >
                              {copiedMessageId === msg.content ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {copiedMessageId === msg.content
                                ? "Copied!"
                                : "Copy"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter className="bg-muted/50 fixed sticky bottom-0 z-10 p-3 space-x-2 bg-white border-t">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isLoading && handleSendMessage()
              }
              ref={inputRef}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default BettingAssistant;
