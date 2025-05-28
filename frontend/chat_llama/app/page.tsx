"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Paperclip, Mic, Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import style from "styled-jsx/style";

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
}

type ChatInterfaceProps = {
  selectedUser?: string | null
}
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "assistant",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate assistant typing
    setIsTyping(true)
    const response = await fetch(`http://127.0.0.1:8000/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputValue }),
    });
    const data = await response.json();
    // Simulate assistant response after a delay
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: data.message,
      sender: "assistant",
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  return (
    <div className="flex min-h-screen flex-col py-8 px-80">
      <div className="text-5xl font-bold text-left">Chat Llama</div>
      <div className="flex flex-col gap-4 p-8 bg-accent rounded-md mt-6 flex-1 justify-between">
        <div className="flex flex-col justify-around">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-black rounded-bl-none"
                      }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-black rounded-2xl rounded-bl-none px-4 py-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="pr-10 rounded-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
            </div>
            <Button onClick={handleSendMessage} size="icon" className="rounded-full" disabled={inputValue.trim() === ""}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
