// src/shared/components/Movement/Community/MessageList.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  Plus, 
  User,
  Clock,
  Check,
  CheckCheck,
  Filter,
  Loader,
  MessageCircle
} from 'lucide-react';
import { MessageThread, MessageComposer } from '.';
import { useWebSocket } from '@/services/websocketService';
import Card from '@/shared/components/common/Card';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    stage?: string;
  }>;
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface MessageListProps {
  onCompose?: (recipientId: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ onCompose }) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { subscribe, isConnected } = useWebSocket(session?.user?.id || '');

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/messages/conversations');
        if (!response.ok) throw new Error('Failed to load conversations');
        const data = await response.json();
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to conversation updates
    const unsubscribeMessage = subscribe('message', (payload) => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === payload.threadId) {
          return {
            ...conv,
            lastMessage: {
              content: payload.content,
              timestamp: new Date(),
              senderId: payload.senderId,
              isRead: false
            },
            unreadCount: conv.unreadCount + 1
          };
        }
        return conv;
      }));
    });

    const unsubscribeRead = subscribe('read', (payload) => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === payload.threadId) {
          return {
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              isRead: true
            }
          };
        }
        return conv;
      }));
    });

    return () => {
      unsubscribeMessage();
      unsubscribeRead();
    };
  }, [session?.user?.id, subscribe]);

  // Filter conversations
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(p => p.id !== session?.user?.id);
    const matchesSearch = !searchQuery || 
      otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && conversation.unreadCount > 0);
    
    return matchesSearch && matchesFilter;
  });

  const handleReply = async (threadId: string, message: { content: string; attachments?: File[] }) => {
    try {
      // Replace with actual API call
      await fetch(`/api/messages/threads/${threadId}/reply`, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' }
      });

      // Update conversations list
      // In production, this would be handled by real-time updates
      setConversations(prev =>
        prev.map(conv =>
          conv.id === threadId
            ? {
                ...conv,
                lastMessage: {
                  content: message.content,
                  timestamp: new Date(),
                  senderId: session?.user?.id || '',
                  isRead: false
                }
              }
            : conv
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          {t('messages.title')}
        </h2>
        <button
          onClick={() => setShowComposer(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('messages.compose.new')}
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">{t('messages.filters.all')}</option>
            <option value="unread">{t('messages.filters.unread')}</option>
          </select>
        </div>
      </div>

      {/* Conversations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? t('messages.noResults')
            : t('messages.noConversations')}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredConversations.map(conversation => {
            const otherParticipant = conversation.participants.find(
              p => p.id !== session?.user?.id
            );
            const isOwn = conversation.lastMessage.senderId === session?.user?.id;

            return (
              <Card
                key={conversation.id}
                className={`p-4 cursor-pointer transition-colors ${
                  conversation.unreadCount > 0
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {otherParticipant?.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(conversation.lastMessage.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[70%]">
                        {isOwn && 'You: '}
                        {conversation.lastMessage.content}
                      </p>
                      <div className="flex items-center gap-2">
                        {isOwn && (
                          conversation.lastMessage.isRead 
                            ? <CheckCheck className="w-4 h-4 text-blue-500" />
                            : <Check className="w-4 h-4 text-gray-400" />
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Message Thread Modal */}
      {selectedConversation && (
        <MessageThread
          threadId={selectedConversation}
          onClose={() => setSelectedConversation(null)}
          onReply={(message) => handleReply(selectedConversation, message)}
        />
      )}

      {/* New Message Modal */}
      {showComposer && (
        <MessageComposer
          recipient={{ id: '', name: '' }} // This will be set once recipient is selected
          onClose={() => setShowComposer(false)}
          onSend={async (message) => {
            // Handle new message creation
            setShowComposer(false);
          }}
        />
      )}
    </div>
  );
};

export default MessageList;
