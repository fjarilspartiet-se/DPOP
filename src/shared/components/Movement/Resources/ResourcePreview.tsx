// src/shared/components/Movement/Resources/ResourcePreview.tsx
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { 
  X, 
  ExternalLink, 
  Download, 
  Eye, 
  Share2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  File
} from 'lucide-react';
import { ResourceType } from '@prisma/client';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';

interface ResourcePreviewProps {
  resource: {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    content: Record<string, any>;
    author: {
      name: string;
    };
    createdAt: Date;
    views: number;
    categories: string[];
  };
  onClose: () => void;
  onShare?: (resourceId: string) => void;
}

const ResourcePreview: React.FC<ResourcePreviewProps> = ({
  resource,
  onClose,
  onShare
}) => {
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderContent = () => {
    switch (resource.type) {
      case 'DOCUMENT':
        return (
          <div className="prose dark:prose-invert max-w-none">
            {resource.content.text && (
              <div className="whitespace-pre-wrap">
                {resource.content.text}
              </div>
            )}
            {resource.content.files?.map((file: any, index: number) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"
              >
                <div className="flex items-center gap-2">
                  <File className="w-5 h-5 text-gray-400" />
                  <span>{file.name}</span>
                </div>
                <button
                  onClick={() => window.open(file.url, '_blank')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        );

      case 'LINK':
        return (
          <div>
            <a 
              href={resource.content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              {resource.content.url}
            </a>
            {resource.content.preview && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">{t('resources.preview.linkPreview')}</h3>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: resource.content.preview }}
                />
              </div>
            )}
          </div>
        );

      case 'MEDIA':
        return (
          <div className="space-y-4">
            {resource.content.files?.map((file: any, index: number) => {
              if (file.type.startsWith('image/')) {
                return (
                  <div key={index} className="relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="max-w-full h-auto rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2">
                      <a
                        href={file.url}
                        download={file.name}
                        className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              }
              
              if (file.type.startsWith('video/')) {
                return (
                  <div key={index} className="relative">
                    <video
                      controls
                      className="max-w-full rounded-lg"
                    >
                      <source src={file.url} type={file.type} />
                      {t('resources.preview.videoNotSupported')}
                    </video>
                  </div>
                );
              }

              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <File className="w-5 h-5 text-gray-400" />
                    <span>{file.name}</span>
                  </div>
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <div className="text-gray-500 dark:text-gray-400">
            {t('resources.preview.noPreview')}
          </div>
        );
    }
  };

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'DOCUMENT':
        return <FileText className="w-5 h-5" />;
      case 'MEDIA':
        return <ImageIcon className="w-5 h-5" />;
      case 'LINK':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon()}
              <h2 className="text-xl font-semibold">{resource.title}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {resource.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                {t('common.loading')}
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>{t('resources.preview.by')} {resource.author.name}</span>
            <span>•</span>
            <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {resource.views}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={() => onShare(resource.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {t('common.share')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreview;
