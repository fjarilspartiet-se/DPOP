// src/services/websocketService.ts

import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'presence';
  payload: any;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 2000;
  private messageQueue: WebSocketMessage[] = [];
  private listeners: Map<string, Set<(message: any) => void>> = new Map();

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(userId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws?userId=${userId}`;
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
    this.messageQueue = [];
  }

  public send(message: WebSocketMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  public subscribe(type: string, callback: (message: any) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(callback);

    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  private handleOpen(): void {
    this.reconnectAttempts = 0;
    // Send queued messages
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) this.send(message);
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const listeners = this.listeners.get(message.type);
      listeners?.forEach(callback => callback(message.payload));
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(this.getUserId());
      }, this.reconnectTimeout * Math.pow(2, this.reconnectAttempts));
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
  }

  private getUserId(): string {
    // Get userId from session or local storage
    return localStorage.getItem('userId') || '';
  }
}

// Hook for using WebSocket in components
export function useWebSocket(userId: string) {
  const ws = useRef<WebSocketService>(WebSocketService.getInstance());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ws.current.connect(userId);
    return () => ws.current.disconnect();
  }, [userId]);

  const subscribe = useCallback((type: string, callback: (message: any) => void) => {
    return ws.current.subscribe(type, callback);
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    ws.current.send(message);
  }, []);

  return {
    isConnected,
    error,
    subscribe,
    send
  };
}
