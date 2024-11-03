import React, { useState } from 'react';
import { AlertCircle, X, ExternalLink, CheckCircle } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface Alert {
  id: number;
  type: 'info' | 'warning' | 'action' | 'success';
  message: string;
  link?: {
    text: string;
    url: string;
  };
  createdAt: string;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'action',
    message: "Ny omröstning kräver din uppmärksamhet",
    link: {
      text: "Gå till omröstning",
      url: "/votes/123"
    },
    createdAt: "2024-03-20T10:00:00",
    isRead: false
  },
  {
    id: 2,
    type: 'info',
    message: "Medlemsmöte på torsdag",
    link: {
      text: "Lägg till i kalender",
      url: "/events/456"
    },
    createdAt: "2024-03-19T15:30:00",
    isRead: false
  },
  {
    id: 3,
    type: 'success',
    message: "Ditt förslag har godkänts för omröstning",
    createdAt: "2024-03-18T09:15:00",
    isRead: true
  }
];

const alertStyles = {
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
  action: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
};

const AlertsPanel = () => {
  const { t } = useTranslation('common');
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const handleDismiss = (alertId: number) => {
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== alertId));
  };

  const markAsRead = (alertId: number) => {
    setAlerts(currentAlerts =>
      currentAlerts.map(alert => {
        if (alert.id === alertId) {
          return { ...alert, isRead: true };
        }
        return alert;
      })
    );
  };

return (
    <Panel 
      title={t('party.dashboard.alerts.title')} 
      icon={AlertCircle}
    >
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            Inga nya meddelanden
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`relative p-4 rounded-lg border ${alertStyles[alert.type]} ${
                !alert.isRead ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {alert.type === 'action' && <AlertCircle className="w-4 h-4 text-purple-500" />}
                    {alert.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    {alert.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-500" />}
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                  {alert.link && (
                    <a
                      href={alert.link.url}
                      className="inline-flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      onClick={() => markAsRead(alert.id)}
                    >
                      {alert.link.text}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(alert.createdAt).toLocaleString('sv-SE')}
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="ml-4 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
};

export default AlertsPanel;
