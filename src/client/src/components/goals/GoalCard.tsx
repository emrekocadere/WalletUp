import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Goal } from '@/types/model.types';
import { DropdownMenu } from '@/components/common/DropdownMenu';
import { getCurrencySymbol, formatNumber } from '@/utils/formatters';

interface GoalCardProps {
  goal: Goal;
  onAddMoney?: (goalId: string) => void;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => Promise<void>;
}

export const GoalCard = ({ goal, onAddMoney, onEdit, onDelete }: GoalCardProps) => {
  const { t } = useTranslation('goals');
  const [isDeleting, setIsDeleting] = useState(false);
  const currentAmount = goal.currentAmount || 0;
  const targetAmount = goal.target || 0;
  const progress = goal.targetPercent || 0;
  const currencySymbol = getCurrencySymbol(goal.currency?.iso4217Code);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(goal.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems = [
    {
      label: t('goalCard.edit'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: () => onEdit?.(goal.id),
    },
    {
      label: t('goalCard.delete'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: handleDelete,
      variant: 'danger' as const,
      disabled: isDeleting,
    },
  ];

  return (
    <div className={`bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-primary-400/30 transition-colors ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
          )}
        </div>
        <div className="relative">
          {isDeleting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8h-4m0 6a8 8 0 01-8 8v-4c4.418 0 8-3.582 8-8h-4z" />
                </svg>
              </div>
            </div>
          ) : (
            <DropdownMenu items={menuItems} />
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{t('goalCard.progress')}</span>
          <span className="text-sm font-bold text-white">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full bg-green-500 transition-all duration-500`}
            style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{t('goalCard.current')}</span>
          <span className="text-sm font-bold text-white">
            {currencySymbol}{formatNumber(currentAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{t('goalCard.target')}</span>
          <span className="text-sm font-bold text-white">
            {currencySymbol}{formatNumber(targetAmount)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onAddMoney?.(goal.id)}
          className="flex-1 px-4 py-2 bg-purple-500/15 border border-purple-500/40 hover:bg-purple-500/25 text-purple-300 text-sm font-semibold rounded-lg transition-colors"
        >
          {t('goalCard.addMoney')}
        </button>
      </div>
    </div>
  );
};
