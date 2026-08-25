import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { PageLoader } from '@/components/common/PageLoader';
import { RecurringTransactionCard } from '@/components/recurring/RecurringTransactionCard';
import { RecurringTransactionModal } from '@/components/recurring/RecurringTransactionModal';
import type { RecurringTransaction } from '@/types/model.types';
import { getCurrencySymbol, formatNumber } from '@/utils/formatters';
import { accountsApi } from '@/api/endpoints/accounts.api';
import { recurringTransactionsApi } from '@/api/endpoints/recurringTransactions.api';

export const RecurringTransactionsPage = () => {
  const { t } = useTranslation('recurring');
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecurringTransactions = async () => {
    try {
      const data = await recurringTransactionsApi.getAll();
      setRecurringTransactions(data);
    } catch (error) {
      console.error('Failed to load recurring transactions:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [accountsResponse] = await Promise.all([
          accountsApi.getAll(),
          fetchRecurringTransactions(),
        ]);
        setAccounts(accountsResponse.accounts);
      } catch (error) {
        console.error('Failed to load recurring transactions data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

  const handleSave = async (transaction: RecurringTransaction) => {
    try {
      if (editingId) {
        await recurringTransactionsApi.update(editingId, {
          title: transaction.title,
          description: transaction.description,
          amount: transaction.amount,
          categoryId: transaction.category!.id,
          transactionTypeId: transaction.transactionType!.id,
          frequency: transaction.frequency,
          startDate: transaction.startDate,
          endDate: transaction.endDate || null,
          isActive: transaction.isActive,
        });
      } else {
        await recurringTransactionsApi.create({
          title: transaction.title,
          description: transaction.description,
          amount: transaction.amount,
          accountId: transaction.account!.id,
          categoryId: transaction.category!.id,
          transactionTypeId: transaction.transactionType!.id,
          frequency: transaction.frequency,
          startDate: transaction.startDate,
          endDate: transaction.endDate || null,
        });
      }
      await fetchRecurringTransactions();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save recurring transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await recurringTransactionsApi.delete(id);
      setRecurringTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete recurring transaction:', error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await recurringTransactionsApi.toggleActive(id);
      setRecurringTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, isActive: !t.isActive } : t))
      );
    } catch (error) {
      console.error('Failed to toggle recurring transaction:', error);
    }
  };

  const editingTransaction = editingId
    ? recurringTransactions.find(t => t.id === editingId)
    : undefined;

  const currencySymbol = getCurrencySymbol(currency);

  if (isLoading) return <PageLoader message={t('page.loading')} />;

  return (
    <div className="min-h-screen bg-[#0d1224]">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">
          {/* Page title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {t('page.title')}
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                {t('page.subtitle')}
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('page.addButton')}
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">{t('stats.active')}</p>
              <p className="text-2xl font-bold text-white">
                {recurringTransactions.filter(t => t.isActive).length}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">{t('stats.monthlyCommitment')}</p>
              <p className="text-2xl font-bold text-green-400">
                {currencySymbol}
                {formatNumber(
                  recurringTransactions
                    .filter(rt => rt.isActive && rt.frequency === 'Monthly')
                    .reduce((sum, rt) => sum + (rt.amount || 0), 0),
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">{t('stats.totalActive')}</p>
              <p className="text-2xl font-bold text-violet-400">
                {currencySymbol}
                {formatNumber(
                  recurringTransactions
                    .filter(rt => rt.isActive)
                    .reduce((sum, rt) => sum + (rt.amount || 0), 0),
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}
              </p>
            </div>
          </div>

          {/* Recurring transactions list */}
          {recurringTransactions.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-400 mb-4">{t('empty.message')}</p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t('empty.cta')}
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
