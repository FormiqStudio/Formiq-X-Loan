# WebSocket Implementation with Next.js Pages API

This guide shows how to implement real-time WebSocket functionality using Socket.IO with Next.js pages API routes, based on the implementation in this loan management system.

## Prerequisites

```bash
npm install socket.io socket.io-client
```

## 1. Server-Side WebSocket Setup

### Create the Socket.IO API Route

Create `pages/api/socket.ts` (Note: Must be in `pages/api/`, not `src/app/api/`):

```typescript
// pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Extend the default server interface to include Socket.IO
interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

// Extend the response interface to include our socket server
interface SocketApiResponse extends NextApiResponse {
  socket: {
    server: SocketServer;
  } & NextApiResponse['socket'];
}

export default function handler(req: NextApiRequest, res: SocketApiResponse) {
  // Check if Socket.IO server is already initialized
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...');

    // Create new Socket.IO server instance
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: '*', // Configure based on your needs
        methods: ['GET', 'POST'],
      },
    });

    // Handle client connections
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join a specific room (e.g., chat room)
      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.emit('joined-room', roomId);
      });

      // Leave a room
      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
      });

      // Handle message broadcasting
      socket.on('send-message', (data: {
        roomId: string;
        message: any;
        senderId: string;
        senderName: string;
      }) => {
        console.log('Broadcasting message to room:', data.roomId);

        // Broadcast to all users in the room
        io.to(data.roomId).emit('new-message', {
          ...data.message,
          timestamp: new Date().toISOString(),
        });
      });

      // Handle typing indicators
      socket.on('typing-start', (data: { roomId: string; userName: string }) => {
        // Broadcast to others in the room (excluding sender)
        socket.to(data.roomId).emit('user-typing', {
          userName: data.userName,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on('typing-stop', (data: { roomId: string; userName: string }) => {
        socket.to(data.roomId).emit('user-stopped-typing', {
          userName: data.userName,
        });
      });

      // Handle custom events (add as needed)
      socket.on('user-status-change', (data: {
        roomId: string;
        userId: string;
        status: 'online' | 'offline' | 'away';
      }) => {
        socket.to(data.roomId).emit('user-status-updated', data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // Attach the Socket.IO server to the HTTP server
    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already running');
  }

  // End the HTTP response
  res.end();
}

// Disable body parsing for this API route
export const config = {
  api: {
    bodyParser: false,
  },
};
```

## 2. Client-Side Hook Implementation

### Create a Custom React Hook

Create `hooks/useSocket.ts`:

```typescript
// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketProps {
  roomId?: string;
  onNewMessage?: (message: any) => void;
  onUserTyping?: (data: { userName: string }) => void;
  onUserStoppedTyping?: (data: { userName: string }) => void;
  onUserStatusUpdated?: (data: { userId: string; status: string }) => void;
}

export const useSocket = ({
  roomId,
  onNewMessage,
  onUserTyping,
  onUserStoppedTyping,
  onUserStatusUpdated
}: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(
      process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
      {
        path: '/api/socket', // Must match the path in server setup
      }
    );

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    // Join room if roomId is provided
    if (roomId) {
      newSocket.emit('join-room', roomId);

      newSocket.on('joined-room', (joinedRoomId: string) => {
        console.log('Successfully joined room:', joinedRoomId);
      });
    }

    // Register event listeners
    if (onNewMessage) {
      newSocket.on('new-message', onNewMessage);
    }

    if (onUserTyping) {
      newSocket.on('user-typing', onUserTyping);
    }

    if (onUserStoppedTyping) {
      newSocket.on('user-stopped-typing', onUserStoppedTyping);
    }

    if (onUserStatusUpdated) {
      newSocket.on('user-status-updated', onUserStatusUpdated);
    }

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (roomId) {
        newSocket.emit('leave-room', roomId);
      }
      newSocket.disconnect();
    };
  }, [roomId, onNewMessage, onUserTyping, onUserStoppedTyping, onUserStatusUpdated]);

  // Helper functions for emitting events
  const sendMessage = (message: any, senderId: string, senderName: string) => {
    if (socket && roomId) {
      socket.emit('send-message', {
        roomId,
        message,
        senderId,
        senderName,
      });
    }
  };

  const startTyping = (userName: string) => {
    if (socket && roomId) {
      socket.emit('typing-start', { roomId, userName });
    }
  };

  const stopTyping = (userName: string) => {
    if (socket && roomId) {
      socket.emit('typing-stop', { roomId, userName });
    }
  };

  const updateUserStatus = (userId: string, status: 'online' | 'offline' | 'away') => {
    if (socket && roomId) {
      socket.emit('user-status-change', { roomId, userId, status });
    }
  };

  return {
    socket,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    updateUserStatus,
  };
};
```

## 3. React Component Integration

### Example Chat Component

```typescript
// components/ChatRoom.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface ChatRoomProps {
  roomId: string;
  userId: string;
  userName: string;
}

export default function ChatRoom({ roomId, userId, userName }: ChatRoomProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Socket event handlers
  const handleNewMessage = useCallback((message: any) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleUserTyping = useCallback((data: { userName: string }) => {
    setTypingUsers(prev => {
      if (!prev.includes(data.userName)) {
        return [...prev, data.userName];
      }
      return prev;
    });

    // Remove typing indicator after 3 seconds
    setTimeout(() => {
      setTypingUsers(prev => prev.filter(user => user !== data.userName));
    }, 3000);
  }, []);

  const handleUserStoppedTyping = useCallback((data: { userName: string }) => {
    setTypingUsers(prev => prev.filter(user => user !== data.userName));
  }, []);

  // Initialize socket
  const { isConnected, sendMessage, startTyping, stopTyping } = useSocket({
    roomId,
    onNewMessage: handleNewMessage,
    onUserTyping: handleUserTyping,
    onUserStoppedTyping: handleUserStoppedTyping,
  });

  // Handle message sending
  const handleSendMessage = () => {
    if (newMessage.trim() && isConnected) {
      const messageData = {
        id: Date.now().toString(),
        text: newMessage,
        senderId: userId,
        senderName: userName,
        timestamp: new Date().toISOString(),
      };

      sendMessage(messageData, userId, userName);
      setNewMessage('');
      stopTyping(userName);
    }
  };

  // Handle typing
  const handleTyping = () => {
    startTyping(userName);

    // Stop typing after 1 second of no input
    setTimeout(() => {
      stopTyping(userName);
    }, 1000);
  };

  return (
    <div className="chat-room">
      {/* Connection Status */}
      <div className="status">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.senderName}:</strong> {msg.text}
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="typing-indicators">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button onClick={handleSendMessage} disabled={!isConnected || !newMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
```

## 4. Advanced Socket.IO Features

### Server-Side Room Management

```typescript
// Enhanced server-side handler with room management
io.on('connection', (socket) => {
  // Store user information
  socket.data = {
    userId: null,
    userName: null,
    rooms: new Set()
  };

  // User authentication/identification
  socket.on('identify-user', (data: { userId: string; userName: string }) => {
    socket.data.userId = data.userId;
    socket.data.userName = data.userName;
    console.log(`User identified: ${data.userName} (${data.userId})`);
  });

  // Enhanced room joining with user tracking
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    socket.data.rooms.add(roomId);

    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.data.userId,
      userName: socket.data.userName,
      timestamp: new Date().toISOString()
    });

    console.log(`${socket.data.userName} joined room ${roomId}`);
  });

  // Enhanced room leaving
  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
    socket.data.rooms.delete(roomId);

    // Notify others in the room
    socket.to(roomId).emit('user-left', {
      userId: socket.data.userId,
      userName: socket.data.userName,
      timestamp: new Date().toISOString()
    });

    console.log(`${socket.data.userName} left room ${roomId}`);
  });

  // Get room information
  socket.on('get-room-info', async (roomId: string) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const socketIds = room ? Array.from(room) : [];

    // Get user information for each socket in the room
    const users = [];
    for (const socketId of socketIds) {
      const roomSocket = io.sockets.sockets.get(socketId);
      if (roomSocket?.data?.userId) {
        users.push({
          userId: roomSocket.data.userId,
          userName: roomSocket.data.userName
        });
      }
    }

    socket.emit('room-info', {
      roomId,
      userCount: users.length,
      users
    });
  });

  // Handle disconnection with cleanup
  socket.on('disconnect', () => {
    // Notify all rooms the user was in
    socket.data.rooms.forEach((roomId: string) => {
      socket.to(roomId).emit('user-left', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        timestamp: new Date().toISOString()
      });
    });

    console.log(`User disconnected: ${socket.data.userName}`);
  });
});
```

### Error Handling and Reconnection

```typescript
// Enhanced client-side with error handling
export const useSocket = (props: UseSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const newSocket = io(
      process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
      {
        path: '/api/socket',
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
      setReconnectAttempts(0);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
      setIsConnected(false);
    });

    // Reconnection events
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      setReconnectAttempts(0);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnection attempt:', attemptNumber);
      setReconnectAttempts(attemptNumber);
    });

    newSocket.on('reconnect_failed', () => {
      console.log('Failed to reconnect');
    });

    // Error handling
    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
    reconnectAttempts,
    // ... other methods
  };
};
```

## 5. Production Considerations

### Environment Configuration

```typescript
// Production-ready socket configuration
const socketConfig = {
  path: '/api/socket',
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com', 'https://www.yourdomain.com']
      : ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
};
```

### Deployment with Vercel

Since Vercel doesn't support WebSockets in serverless functions, you'll need:

1. **Use a separate WebSocket server** (e.g., Railway, Render, or your own VPS)
2. **Or use Vercel with a custom server** (not recommended for production)

### Alternative: Using Pusher or Ably

For production on Vercel, consider managed WebSocket services:

```typescript
// Example with Pusher
import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

const channel = pusher.subscribe('chat-room');
channel.bind('new-message', (data: any) => {
  // Handle new message
});
```

This guide provides a complete foundation for implementing WebSocket functionality with Next.js using the pages API approach, ensuring real-time communication capabilities in your application.