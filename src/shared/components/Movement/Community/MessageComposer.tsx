// src/shared/components/Movement/Community/MessageComposer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { 
  X, 
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  User,
  Loader
} from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';

interface MessageComposerProps {
  recipient: {
    id: string;
    name: string;
    stage?: string;
  };
  threadId?: string; // For replies in a conversation
  onClose: () => void;
  onSend: (message: MessageData) => Promise<void>;
  initialMessage?: string;
}

interface MessageData {
  recipientId: string;
  content: string;
  attachments?: File[];
  threadId?: string;
}

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain'
];

const MessageComposer: React.FC<MessageComposerProps> = ({
  recipient,
  threadId,
  onClose,
  onSend,
  initialMessage = ''
}) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [message, setMessage] = useState(initialMessage);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus textarea and adjust height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  }, []);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const invalidFiles = files.filter(file => 
      file.size > MAX_ATTACHMENT_SIZE || !ALLOWED_ATTACHMENT_TYPES.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError(t('messages.errors.invalidAttachments'));
      return;
    }

    setAttachments(prev => [...prev, ...files]);
    setError(null);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!message.trim() && attachments.length === 0) {
      setError(t('messages.errors.emptyMessage'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSend({
        recipientId: recipient.id,
        content: message.trim(),
        attachments,
        threadId
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('messages.errors.sendFailed'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium">{recipient.name}</h3>
              {recipient.stage && (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {t(`lifestages.${recipient.stage.toLowerCase()}`)}
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

        {/* Message Input */}
        <div className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            placeholder={t('messages.compose.placeholder')}
            className="w-full min-h-[100px] p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 resize-none"
            disabled={isSubmitting}
          />

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALLOWED_ATTACHMENT_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleAttachmentClick}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {t('messages.compose.send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
