import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RecurringTransaction, RecurrenceFrequency } from '@/types/model.types';
import type { RootState } from '@/store/store';

interface Props {
  transaction?: RecurringTransaction;
  accounts: any[];
  onClose: () => void;
  onSave: (transaction: RecurringTransaction) => void;
}

const FREQUENCY_VALUES: RecurrenceFrequency[] = ['Weekly', 'BiWeekly', 'Monthly', 'Quarterly', 'SemiAnnually', 'Annually'];

export const RecurringTransactionModal = ({ transaction, accounts, onClose, onSave }: Props) => {
  const { t } = useTranslation('recurring');
  const { categories, transactionTypes } = useSelector((state: RootState) => state.appData);

  const [formData, setFormData] = useState<Partial<RecurringTransaction>>({
    title: '',
    description: '',
    amount: 0,
    frequency: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    account: undefined,
    category: undefined,
    transactionType: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        startDate: transaction.startDate?.split('T')[0] || '',
        endDate: transaction.endDate?.split('T')[0] || '',
      });
    }
  }, [transaction]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = t('modal.errors.titleRequired');
    if (!formData.amount || formData.amount <= 0) newErrors.amount = t('modal.errors.amountInvalid');
    if (!formData.startDate) newErrors.startDate = t('modal.errors.startDateRequired');
    if (!formData.account?.id) newErrors.account = t('modal.errors.accountRequired');
    if (!formData.category?.id) newErrors.category = t('modal.errors.categoryRequired');
    if (!formData.transactionType?.id) newErrors.transactionType = t('modal.errors.typeRequired');

    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = t('modal.errors.endDateInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(formData as RecurringTransaction);
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
          <h2 className="text-xl font-bold text-white">
            {transaction ? t('modal.editTitle') : t('modal.addTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.titleLabel')}
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => handleChange('title', e.target.value)}
              placeholder={t('modal.titlePlaceholder')}
              className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-violet-500'
              }`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.descriptionLabel')}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={e => handleChange('description', e.target.value)}
              placeholder={t('modal.descriptionPlaceholder')}
              rows={2}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.amountLabel')}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={e => handleChange('amount', parseFloat(e.target.value))}
              placeholder="0.00"
              className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-violet-500'
              }`}
            />
            {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.accountLabel')}
            </label>
            <select
              value={formData.account?.id || ''}
              onChange={e => {
                const account = accounts.find(a => a.id === e.target.value);
                handleChange('account', account);
              }}
              className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 cursor-pointer ${
                errors.account ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-violet-500'
              }`}
            >
              <option value="">{t('modal.selectAccount')}</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            {errors.account && <p className="text-xs text-red-400 mt-1">{errors.account}</p>}
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.typeLabel')}
            </label>
            <select
              value={formData.transactionType?.id || ''}
              onChange={e => {
                const transactionType = transactionTypes.find(t => t.id === e.target.value);
                handleChange('transactionType', transactionType);
              }}
              className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 cursor-pointer ${
                errors.transactionType ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-violet-500'
              }`}
            >
              <option value="">{t('modal.selectType')}</option>
              {transactionTypes.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.transactionType && <p className="text-xs text-red-400 mt-1">{errors.transactionType}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.categoryLabel')}
            </label>
            <select
              value={formData.category?.id || ''}
              onChange={e => {
                const category = categories.find(c => c.id === e.target.value);
                handleChange('category', category);
              }}
              className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 cursor-pointer ${
                errors.category ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-violet-500'
              }`}
            >
              <option value="">{t('modal.selectCategory')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.frequencyLabel')}
            </label>
            <select
              value={formData.frequency || 'Monthly'}
              onChange={e => handleChange('frequency', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            >
              {FREQUENCY_VALUES.map(value => (
                <option key={value} value={value}>
                  {t(`modal.frequencyOptions.${value.charAt(0).toLowerCase() + value.slice(1)}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.startDateLabel')}
            </label>
            <input
              type="date"
              value={formData.startDate || ''}
              onChange={e => handleChange('startDate', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-violet-500'
              }`}
            />
            {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('modal.endDateLabel')}
            </label>
            <input
              type="date"
              value={formData.endDate || ''}
              onChange={e => handleChange('endDate', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-violet-500'
              }`}
            />
            {errors.endDate && <p className="text-xs text-red-400 mt-1">{errors.endDate}</p>}
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive || false}
              onChange={e => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer"
            />
            <label className="text-sm font-medium text-slate-300 cursor-pointer">
              {t('modal.activeLabel')}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('modal.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-violet-500 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
            >
              {transaction ? t('modal.update') : t('modal.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
