import React, { useEffect } from 'react';
import { useToasts, ToastMessage } from '../context/ToastContext';
import { CheckCircleIcon, XCircleIcon, InfoCircleIcon, ExclamationIcon } from './icons';

// Fix: Explicitly type `toastConfig` to allow for an optional `text` property. This resolves the TypeScript error.
const toastConfig: Record<string, { icon: React.FC<{className?: string}>, bg: string, text?: string }> = {
  success: {
    icon: CheckCircleIcon,
    bg: 'bg-[#035865]',
  },
  error: {
    icon: XCircleIcon,
    bg: 'bg-red-500',
  },
  info: {
    icon: InfoCircleIcon,
    bg: 'bg-[#035865]',
  },
  warning: {
    icon: ExclamationIcon,
    bg: 'bg-[#F5B942]',
    text: 'text-[#035865]'
  },
};

const Toast: React.FC<{ toast: ToastMessage; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div className={`flex items-center w-full max-w-xs p-4 mb-4 text-white ${config.bg} rounded-lg shadow-lg`}>
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${config.text || 'text-white'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 text-sm font-medium">
        {toast.message}
      </div>
      <button onClick={() => onRemove(toast.id)} className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-white hover:text-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8">
        &times;
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToasts();

  return (
    <div className="fixed top-5 right-5 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};