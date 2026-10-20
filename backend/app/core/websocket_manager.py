import json
import logging
from typing import Dict, List, Any
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages active WebSocket connections grouped by room / branch / channel."""

    def __init__(self):
        # room_name -> list of WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str = "general"):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)
        logger.info(f"WebSocket client connected to room: {room}. Active in room: {len(self.active_connections[room])}")

    def disconnect(self, websocket: WebSocket, room: str = "general"):
        if room in self.active_connections and websocket in self.active_connections[room]:
            self.active_connections[room].remove(websocket)
            logger.info(f"WebSocket client disconnected from room: {room}. Remaining: {len(self.active_connections[room])}")

    async def broadcast_to_room(self, room: str, message: Any):
        """Broadcast JSON message to all clients in the specified room."""
        if room not in self.active_connections:
            return
        dead_connections = []
        payload = json.dumps(message) if not isinstance(message, str) else message
        for connection in self.active_connections[room]:
            try:
                await connection.send_text(payload)
            except Exception as e:
                logger.warning(f"Error sending message to client: {e}")
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect(dead, room)

    async def broadcast(self, message: Any):
        """Broadcast message to all connected rooms."""
        for room in list(self.active_connections.keys()):
            await self.broadcast_to_room(room, message)


ws_manager = ConnectionManager()
