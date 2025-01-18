// src/pages/api/ws.ts

import { Server } from 'http';
import { NextApiRequest } from 'next';
import { WebSocket, WebSocketServer } from 'ws';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/db';

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

interface WebSocketMessage {
  type: string;
  payload: any;
}

// Store active connections
const clients = new Map<string, ExtendedWebSocket>();

// Keep-alive interval (30 seconds)
const PING_INTERVAL = 30000;

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.ws) {
    const wss = new WebSocketServer({ noServer: true });

    // Connection handling
    wss.on('connection', handleConnection);

    // Set up keep-alive mechanism
    setInterval(() => {
      wss.clients.forEach((ws: ExtendedWebSocket) => {
        if (ws.isAlive === false) {
          clients.delete(ws.userId!);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, PING_INTERVAL);

    // Upgrade HTTP connection to WebSocket
    res.socket.server.on('upgrade', async (request: any, socket: any, head: any) => {
      const session = await getSession({ req: request });
      if (!session?.user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    res.socket.server.ws = wss;
  }

  res.end();
}

async function handleConnection(ws: ExtendedWebSocket, req: any) {
  // Extract userId from query parameters
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    ws.close(1008, 'User ID required');
    return;
  }

  // Set up connection properties
  ws.userId = userId;
  ws.isAlive = true;
  clients.set(userId, ws);

  // Handle pong messages for keep-alive
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Handle incoming messages
  ws.on('message', async (data: string) => {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      
      switch (message.type) {
        case 'message':
          await handleChatMessage(userId, message.payload);
          break;
        case 'typing':
          await handleTypingStatus(userId, message.payload);
          break;
        case 'read':
          await handleReadStatus(userId, message.payload);
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    clients.delete(userId);
    broadcastPresenceUpdate(userId, false);
  });

  // Broadcast presence update
  broadcastPresenceUpdate(userId, true);
}

async function handleChatMessage(senderId: string, payload: any) {
  try {
    // Save message to database
    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId: payload.recipientId,
        threadId: payload.threadId,
        content: payload.content,
      }
    });

    // Send to recipient if online
    const recipientWs = clients.get(payload.recipientId);
    if (recipientWs?.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify({
        type: 'message',
        payload: {
          ...message,
          senderName: payload.senderName
        }
      }));
    }
  } catch (error) {
    console.error('Error handling chat message:', error);
  }
}

async function handleTypingStatus(userId: string, payload: any) {
  const recipientWs = clients.get(payload.recipientId);
  if (recipientWs?.readyState === WebSocket.OPEN) {
    recipientWs.send(JSON.stringify({
      type: 'typing',
      payload: {
        userId,
        threadId: payload.threadId,
        isTyping: payload.isTyping
      }
    }));
  }
}

async function handleReadStatus(userId: string, payload: any) {
  try {
    // Update message read status in database
    await prisma.message.updateMany({
      where: {
        threadId: payload.threadId,
        recipientId: userId,
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    // Notify sender if online
    const senderWs = clients.get(payload.senderId);
    if (senderWs?.readyState === WebSocket.OPEN) {
      senderWs.send(JSON.stringify({
        type: 'read',
        payload: {
          threadId: payload.threadId,
          readBy: userId
        }
      }));
    }
  } catch (error) {
    console.error('Error handling read status:', error);
  }
}

function broadcastPresenceUpdate(userId: string, isOnline: boolean) {
  const message = JSON.stringify({
    type: 'presence',
    payload: {
      userId,
      isOnline
    }
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userId !== userId) {
      client.send(message);
    }
  });
}
