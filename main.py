from fastapi import FastAPI, WebSocket
from starlette.middleware.cors import CORSMiddleware
from typing import List
import argparse

app = FastAPI()

origins = ["*"]
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self):
        self.active_connection: List[WebSocket] = []

    async def connect(self, websocket):
        await websocket.accept()
        self.active_connection.append(websocket)

    def disconnect(self, websocket):
        self.active_connection.remove(websocket)

    async def send_message(self, message, websocket):
        await websocket.send_text(message)


manager = ConnectionManager()


@app.get("/")
async def main():
    return "Hello, World!"


def argparser():
    parser = argparse.ArgumentParser()
    parser.add_argument("--https", required=True)
    config = parser.parse_args()
    return config


if __name__ == "__main__":
    import uvicorn

    config = argparser()
    if config.https == "True":
        uvicorn.run(app=app, host="0.0.0.0", port=8000, reload=True)

    else:
        uvicorn.run(app=app, host="0.0.0.0", port=8001, reload=True)
