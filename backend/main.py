from fastapi import FastAPI
from langchain_ollama import ChatOllama
import urllib.parse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


llm = ChatOllama(model="llama3.2")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for safety
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
async def root():
    mesage = llm.invoke("hii what are you?")
    return {"message": mesage.content}

class MessageInput(BaseModel):
    message: str

@app.post("/chat/")
async def chat(input: MessageInput):
    decoded_msg = urllib.parse.unquote(input.message)
    mesage = llm.invoke(decoded_msg)
    print(decoded_msg)
    return {"message": mesage.content}