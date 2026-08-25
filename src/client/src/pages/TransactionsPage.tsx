import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store/store';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { PageLoader } from '@/components/common/PageLoader';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { Pagination } from '@/components/common/Pagination';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { EditTransactionModal } from '@/components/transactions/EditTransactionModal';
import { AIInsightsSection } from '@/components/common/AIInsightsSection';
import { useAIInsights } from '@/hooks/useAIInsights';
import { transactionsApi } from '@/api/endpoints/transactions.api';
import { accountsApi } from '@/api/endpoints/accounts.api';
import { exportTransactionsToCSV } from '@/utils/exportToCSV';
import type { Transaction, Account } from '@/types/model.types';

const PAGE_SIZE = 20;

export const TransactionsPage = () => {
  const { t } = useTranslation('transactions');
  const { categories, transactionTypes } = useSelector((state: RootState) => state.appData);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);


  const { insights, loading: insightsLoading } = useAIInsights({
    pageType: 'transactions',
    taskName: 'financial_advice'
  });

  const buildFilters = useCallback(() => {
    const filters: {
      categoryId?: string;
      transactionTypeId?: string;
      accountId?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      pageSize?: number;
    } = { page, pageSize: PAGE_SIZE };

    if (filterCategory !== 'all') {
      filters.categoryId = filterCategory;
    }

    if (filterType !== 'all') {
      const typeObj = transactionTypes.find(t => t.name?.toLowerCase() === filterType.toLowerCase());
      if (typeObj?.id) {
        filters.transactionTypeId = typeObj.id;
      }
    }

    if (filterAccount !== 'all') {
      filters.accountId = filterAccount;
    }

    if (filterPeriod !== 'all') {
      const now = new Date();
      let startDate: Date;

      if (filterPeriod === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (filterPeriod === 'month') {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
      } else {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      }

      filters.startDate = startDate.toISOString();
      filters.endDate = now.toISOString();
    }

    return filters;
  }, [page, filterCategory, filterType, filterAccount, filterPeriod, transactionTypes]);

  const fetchTransactions = useCallback(async () => {
    const result = await transactionsApi.getAll(buildFilters());
    setTransactions(result.items);
    setTotalPages(result.totalPages);
    setTotalCount(result.totalCount);
  }, [buildFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [transactionsResult, accountsData] = await Promise.all([
          transactionsApi.getAll(buildFilters()),
          accountsApi.getAll(),
        ]);

        setTransactions(transactionsResult.items);
        setTotalPages(transactionsResult.totalPages);
        setTotalCount(transactionsResult.totalCount);
        setAccounts(accountsData.accounts);
      } catch (error) {
        console.error('Request failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [buildFilters]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [filterType, filterAccount, filterCategory, filterPeriod]);


  const exportToCSV = async () => {
    if (totalCount === 0) {
      setToast({ message: t('page.noTransactionsToExport'), type: 'error' });
      return;
    }

    try {
      const all = await transactionsApi.getAll({ ...buildFilters(), page: 1, pageSize: totalCount });
      exportTransactionsToCSV(all.items, accounts);
      setToast({ message: t('page.exportedSuccess'), type: 'success' });
    } catch (error) {
      console.error('Failed to export transactions:', error);
    }
  };

  if (isLoading) {
    return <PageLoader message={t('page.loading')} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1224]">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{t('page.title')}</h1>
              <p className="text-sm sm:text-base text-gray-400">{t('page.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={exportToCSV}
                className="px-3 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base font-semibold rounded-xl transition-all border border-white/10 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0111.25 19.5H6.75z"
                  />
                </svg>
                <span className="hidden sm:inline">{t('page.exportCsv')}</span>
                <span className="sm:hidden">{t('page.export')}</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 sm:px-6 py-2.5 sm:py-3 bg-violet-500 hover:bg-violet-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t('page.addTransaction')}
              </button>
            </div>
          </div>


          <TransactionFilters
            filterPeriod={filterPeriod}
            setFilterPeriod={setFilterPeriod}
            filterType={filterType}
            setFilterType={setFilterType}
            filterAccount={filterAccount}
            setFilterAccount={setFilterAccount}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            accounts={accounts}
            categories={categories}
            onClearFilters={() => {
              setFilterType('all');
              setFilterAccount('all');
              setFilterCategory('all');
              setFilterPeriod('all');
            }}
          />

          <div className="mb-8">
            <AIInsightsSection insights={insights} loading={insightsLoading} />
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <TransactionTable
              transactions={transactions}
              isLoading={isLoading}
              accounts={accounts}
              hasFilters={
                filterType !== 'all' ||
                filterAccount !== 'all' ||
                filterCategory !== 'all' ||
                filterPeriod !== 'all'
              }
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
                setShowEditModal(true);
              }}
              onDelete={async (transactionId) => {
                await transactionsApi.delete(transactionId);
                await fetchTransactions();
              }}
              onShowToast={(message, type) => setToast({ message, type })}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </div>

        <Footer />
      </main>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        accounts={accounts}
        categories={categories}
        onSuccess={async () => {
          try {
            setPage(1);
            await fetchTransactions();
          } catch (error) {
            console.error('Failed to reload transactions:', error);
          }
        }}
        onShowToast={(message, type) => setToast({ message, type })}
      />

      <EditTransactionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction as any}
        categories={categories}
        onSuccess={async () => {
          try {
            await fetchTransactions();
          } catch (error) {
            console.error('Failed to reload transactions:', error);
          }
        }}
        onShowToast={(message, type) => setToast({ message, type })}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
