import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { EditTransactionModal } from '@/components/transactions/EditTransactionModal';
import { AIInsightsSection } from '@/components/common/AIInsightsSection';
import { useAIInsights } from '@/hooks/useAIInsights';
import { transactionsApi } from '@/api/endpoints/transactions.api';
import { accountsApi } from '@/api/endpoints/accounts.api';
import { exportTransactionsToCSV } from '@/utils/exportToCSV';
import type { Transaction, Account } from '@/types/model.types';


export const TransactionsPage = () => {

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


  const { insights, loading: insightsLoading } = useAIInsights({
    pageType: 'transactions',
    taskName: 'financial_advice'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const filters: Record<string, string> = {};
        
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
          if (filterPeriod === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            filters.startDate = weekAgo.toISOString().split('T')[0];
          } else if (filterPeriod === 'month') {
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            filters.startDate = monthAgo.toISOString().split('T')[0];
          }
          filters.endDate = now.toISOString().split('T')[0];
        }

        console.log('Aktif Filtreler:', {
          category: filterCategory !== 'all' ? filterCategory : 'Yok',
          account: filterAccount !== 'all' ? filterAccount : 'Yok',
          type: filterType !== 'all' ? filterType : 'Yok',
          period: filterPeriod !== 'all' ? filterPeriod : 'Yok'
        });
        console.log('API Parametreleri:', filters);
        
        const [transactionsData, accountsData] = await Promise.all([
          transactionsApi.getAll(Object.keys(filters).length > 0 ? filters : undefined),
          accountsApi.getAll(),
        ]);
        
        console.log('İstek başarılı. Gelen işlem sayısı:', transactionsData.length);
        
        setTransactions(transactionsData);
        setAccounts(accountsData);
      } catch (error) {
        console.error('stek başarısız:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filterType, filterAccount, filterCategory, filterPeriod, transactionTypes]);


  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      setToast({ message: 'No transactions to export', type: 'error' });
      return;
    }

    exportTransactionsToCSV(filteredTransactions, accounts);
    setToast({ message: 'Transactions exported as CSV', type: 'success' });
  };

  const filteredTransactions = transactions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Transactions</h1>
              <p className="text-sm sm:text-base text-gray-400">Manage and track your transactions</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={exportToCSV}
                className="px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-800/50 hover:bg-slate-800 text-white text-sm sm:text-base font-semibold rounded-xl transition-all border border-white/10 flex items-center gap-2"
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
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
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
                Add Transaction
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

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <TransactionTable
              transactions={filteredTransactions}
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
                const updatedTransactions = await transactionsApi.getAll();
                setTransactions(updatedTransactions);
              }}
              onShowToast={(message, type) => setToast({ message, type })}
            />
          </div>
        </div>
      </main>

      <Footer />

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        accounts={accounts}
        categories={categories}
        onSuccess={async () => {

          try {
            const updatedTransactions = await transactionsApi.getAll();
            setTransactions(updatedTransactions);
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
        transaction={editingTransaction}
        categories={categories}
        onSuccess={async () => {
          try {
            const updatedTransactions = await transactionsApi.getAll();
            setTransactions(updatedTransactions);
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
