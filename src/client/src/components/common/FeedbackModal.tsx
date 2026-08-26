import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { feedbackApi } from '@/api/endpoints/feedback.api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export const FeedbackModal = ({ isOpen, onClose, onShowToast }: FeedbackModalProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      onShowToast?.(t('feedbackModal.emptyMessage'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await feedbackApi.create(message.trim());
      if (result.isSuccess) {
        onShowToast?.(t('feedbackModal.success'), 'success');
        handleClose();
      } else {
        onShowToast?.(t('feedbackModal.failed'), 'error');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      onShowToast?.(t('feedbackModal.failed'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">{t('feedbackModal.title')}</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-6">{t('feedbackModal.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('feedbackModal.placeholder')}
                rows={6}
                maxLength={2000}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{message.length}/2000</p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                {t('feedbackModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('feedbackModal.submitting') : t('feedbackModal.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
