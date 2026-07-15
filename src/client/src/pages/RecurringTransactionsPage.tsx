import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { RecurringTransactionCard } from '@/components/recurring/RecurringTransactionCard';
import { RecurringTransactionModal } from '@/components/recurring/RecurringTransactionModal';
import type { RecurringTransaction } from '@/types/model.types';
import { getCurrencySymbol } from '@/utils/formatters';
import { accountsApi } from '@/api/endpoints/accounts.api';

// Mock data — Backend hazırlanınca API endpoint'ten gelecek
const mockRecurringTransactions: RecurringTransaction[] = [
  {
    id: '1',
    title: 'Monthly Rent',
    description: 'Apartment rent payment',
    amount: 1200,
    frequency: 'Monthly',
    startDate: '2026-01-01',
    nextOccurrence: '2026-08-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Salary',
    description: 'Monthly salary',
    amount: 3500,
    frequency: 'Monthly',
    startDate: '2026-01-15',
    nextOccurrence: '2026-08-15',
    isActive: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Gym Membership',
    description: 'Monthly gym subscription',
    amount: 45,
    frequency: 'Monthly',
    startDate: '2026-02-01',
    endDate: '2027-02-01',
    nextOccurrence: '2026-08-01',
    isActive: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
];

export const RecurringTransactionsPage = () => {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(mockRecurringTransactions);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currency] = useState('USD');
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountsApi.getAll();
        setAccounts(response.accounts);
      } catch (error) {
        console.error('Failed to load accounts:', error);
      } finally {
        setIsLoadingAccounts(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleOpenModal = (id?: string) => {
    if (id) {
      setEditingId(id);
    } else {
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = (transaction: RecurringTransaction) => {
    if (editingId) {
      // Edit mode
      setRecurringTransactions(prev =>
        prev.map(t => (t.id === editingId ? { ...transaction, id: editingId } : t))
      );
    } else {
      // Add mode
      setRecurringTransactions(prev => [
        ...prev,
        { ...transaction, id: Date.now().toString() }
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setRecurringTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setRecurringTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };

  const editingTransaction = editingId
    ? recurringTransactions.find(t => t.id === editingId)
    : undefined;

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="min-h-screen bg-[#0d1224]">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">
          {/* Page title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                Recurring Transactions
              </h1>
              <p className="text-sm sm:text-base text-slate-400">
                Manage your recurring expenses and income
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Recurring
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Active Recurring</p>
              <p className="text-2xl font-bold text-white">
                {recurringTransactions.filter(t => t.isActive).length}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Monthly Commitment</p>
              <p className="text-2xl font-bold text-green-400">
                {currencySymbol}
                {recurringTransactions
                  .filter(t => t.isActive && t.frequency === 'Monthly')
                  .reduce((sum, t) => sum + (t.amount || 0), 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Total Active Amount</p>
              <p className="text-2xl font-bold text-indigo-400">
                {currencySymbol}
                {recurringTransactions
                  .filter(t => t.isActive)
                  .reduce((sum, t) => sum + (t.amount || 0), 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Recurring transactions list */}
          {recurringTransactions.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-400 mb-4">No recurring transactions yet</p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Create your first recurring transaction
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recurringTransactions.map(transaction => (
                <RecurringTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  currencySymbol={currencySymbol}
                  onEdit={() => handleOpenModal(transaction.id)}
                  onDelete={() => handleDelete(transaction.id!)}
                  onToggleActive={() => handleToggleActive(transaction.id!)}
                />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </main>

      {/* Modal */}
      {isModalOpen && (
        <RecurringTransactionModal
          transaction={editingTransaction}
          accounts={accounts}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
