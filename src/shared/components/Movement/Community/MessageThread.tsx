// src/shared/components/Movement/Community/MessageThread.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useWebSocket } from '@/services/websocketService';
import { 
  X, 
  Reply, 
  MoreVertical, 
  Download,
  ExternalLink,
  User,
  ChevronLeft,
  Loader
} from 'lucide-react';
import { MessageComposer } from '.';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderStage?: string;
  content: string;
  timestamp: Date;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
  isRead: boolean;
}

interface Thread {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    stage?: string;
  }>;
  messages: Message[];
  lastActivity: Date;
}

interface MessageThreadProps {
  threadId: string;
  onClose: () => void;
  onReply: (message: { content: string; attachments?: File[] }) => Promise<void>;
  onBack?: () => void; // For mobile navigation
}

const MessageThread: React.FC<MessageThreadProps> = ({
  threadId,
  onClose,
  onReply,
  onBack
}) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { subscribe, send, isConnected } = useWebSocket(session?.user?.id || '');

  // Fetch thread data
  useEffect(() => {
    const fetchThread = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/messages/threads/${threadId}`);
        if (!response.ok) throw new Error('Failed to load conversation');
        const data = await response.json();
        setThread(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [threadId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Subscribe to thread-specific messages
    const unsubscribeMessage = subscribe('message', (payload) => {
      if (payload.threadId === threadId) {
        setThread(prev => prev ? {
          ...prev,
          messages: [...prev.messages, payload]
        } : null);
      }
    });

    // Subscribe to typing indicators
    const unsubscribeTyping = subscribe('typing', (payload) => {
      if (payload.threadId === threadId && payload.userId !== session.user.id) {
        setIsTyping(payload.isTyping);
      }
    });

    // Subscribe to read receipts 
    const unsubscribeRead = subscribe('read', (payload) => {
      if (payload.threadId === threadId) {
        setThread(prev => prev ? {
          ...prev,
          messages: prev.messages.map(msg => 
            msg.senderId === session.user.id ? { ...msg, isRead: true } : msg
          )
        } : null);
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeRead();
    };
  }, [session?.user?.id, threadId, subscribe]);

  const handleReply = async (messageData: { content: string; attachments?: File[] }) => {
    try {
      await onReply(messageData);
      
      // Send message via WebSocket for real-time update
      send({
        type: 'message',
        payload: {
          threadId,
          content: messageData.content,
          recipientId: otherParticipant?.id,
          senderName: session?.user?.name,
          attachments: messageData.attachments
        }
      });
      
      setShowReply(false);
      setReplyToMessage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    send({
      type: 'typing',
      payload: {
        threadId,
        recipientId: otherParticipant?.id,
        isTyping: true
      }
    });

    typingTimeoutRef.current = setTimeout(() => {
      send({
        type: 'typing',
        payload: {
          threadId,
          recipientId: otherParticipant?.id,
          isTyping: false
        }
      });
    }, 2000);
  }, [send, threadId, otherParticipant?.id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Thread not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const otherParticipant = thread.participants.find(p => p.id !== session?.user?.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full lg:hidden"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium">{otherParticipant?.name}</h3>
              {otherParticipant?.stage && (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {t(`lifestages.${otherParticipant.stage.toLowerCase()}`)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {thread.messages.map((message) => {
            const isOwnMessage = message.senderId === session?.user?.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] space-y-2 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {/* Message bubble */}
                  <div
                    className={`rounded-lg p-3 ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className={`flex items-center justify-between p-2 rounded ${
                              isOwnMessage
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="truncate">{attachment.name}</span>
                              <span className="text-sm opacity-75">
                                ({(attachment.size / 1024 / 1024).toFixed(1)} MB)
                              </span>
                            </div>
                            <a
                              href={attachment.url}
                              download={attachment.name}
                              className="p-1 hover:bg-black/10 rounded"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message metadata */}
                  <div className={`flex items-center gap-2 text-xs text-gray-500 ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                    {!isOwnMessage && (
                      <button
                        onClick={() => {
                          setReplyToMessage(message);
                          setShowReply(true);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply button */}
        {!showReply && (
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={() => setShowReply(true)}
              className="w-full px-4 py-2 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t('messages.thread.writeReply')}
            </button>
          </div>
        )}

        {/* Message composer */}
        {showReply && (
          <MessageComposer
            recipient={otherParticipant!}
            threadId={threadId}
            onClose={() => {
              setShowReply(false);
              setReplyToMessage(null);
            }}
            onSend={handleReply}
            initialMessage={replyToMessage ? `> ${replyToMessage.content}\n\n` : ''}
          />
        )}
      </div>
    </div>
  );
};

export default MessageThread;
