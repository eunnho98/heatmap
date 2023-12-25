import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from typing import List
import argparse

from util import getDots, getPoint

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


@app.websocket("/ws/{clientid}")
async def websocket_endpoint(websocket: WebSocket, clientid):
    print("websocket is comming")
    await manager.connect(websocket)
    isInterval = False
    x_interval = y_interval = z_interval = df = None
    print("websocket", websocket)
    try:
        while True:
            data = await websocket.receive_text()
            dict_data = json.loads(data)
            if "xinter" in dict_data:  # 설정값이 들어오면
                print("setting is comming")
                isInterval = True
                x_interval = dict_data["xinter"]
                y_interval = dict_data["yinter"]
                z_interval = dict_data["zinter"]
                df = getPoint(x_interval, y_interval, z_interval)
                if type(df) == str:
                    message = {"message": df}
                    await manager.send_message(json.dumps(message), websocket)
                    return
            if isInterval and "x_rad" in dict_data:
                x_rad = dict_data["x_rad"]
                y_rad = dict_data["y_rad"]
                z_rad = dict_data["z_rad"]
                message = getDots(df, x_rad, y_rad, z_rad)
                if message == -1:
                    message = {"message": -1}
                print(message)
                await manager.send_message(json.dumps(message), websocket)
    except WebSocketDisconnect:
        print("Websocket Disconnected")

@app.websocket("/ws2/{clientid}")
async def web_2(websocket: WebSocket, clientid):



def argparser():
    parser = argparse.ArgumentParser()
    parser.add_argument("--https", required=True)
    config = parser.parse_args()
    return config


if __name__ == "__main__":
    import uvicorn

    config = argparser()
    if config.https == "True":
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            ssl_keyfile="./localhost+3-key.pem",
            ssl_certfile="./localhost+3.pem",
            port=8000,
            reload=True,
        )

    else:
        uvicorn.run(app=app, host="0.0.0.0", port=8001, reload=True)
