import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { transactionsApi } from '@/api/endpoints/transactions.api';

interface EditTransaction {
  id: string;
  transactionTypeId?: string;
  transactionType?: { id: string; name: string };
  amount: number;
  title: string;
  description: string;
  categoryId?: string;
  category?: { id: string; name: string };
  date: string;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: EditTransaction | null;
  categories?: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const inputClass = "w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500";
const selectClass = "w-full px-4 py-2.5 bg-slate-800/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500";

export const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  categories = [],
  onSuccess,
  onShowToast,
}: EditTransactionModalProps) => {
  const { transactionTypes } = useSelector((state: RootState) => state.appData);
  const [transactionTypeId, setTransactionTypeId] = useState('');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setTransactionTypeId(transaction.transactionTypeId || transaction.transactionType?.id || '');
      setAmount(transaction.amount.toString());
      setTitle(transaction.title);
      setDescription(transaction.description || '');
      setCategoryId(transaction.categoryId || transaction.category?.id || '');
      setDate(transaction.date.split('T')[0]);
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !categoryId || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      const result = await transactionsApi.update(transaction.id, {
        amount: parseFloat(amount),
        title,
        description,
        transactionTypeId,
        categoryId,
        accountId: '',
        date: date + 'T00:00:00Z',
      });

      if (result.isSuccess) {
        onShowToast?.('Updated successfully', 'success');
        onSuccess?.();
        onClose();
      } else {
        onShowToast?.(String(result.error || 'Failed to update'), 'error');
      }
    } catch (err) {
      onShowToast?.('Failed to update', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Type</label>
              <select value={transactionTypeId} onChange={(e) => setTransactionTypeId(e.target.value)} required className={selectClass}>
                {transactionTypes.map((type: { id: string; name: string }) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Amount</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass + " resize-none"} />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={selectClass}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl disabled:opacity-50">
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
