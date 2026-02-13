import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { EditAccountModal } from '@/components/accounts/EditAccountModal';
import { EditTransactionModal } from '@/components/transactions/EditTransactionModal';
import { AIInsightsSection } from '@/components/common/AIInsightsSection';
import { useAIInsights } from '@/hooks/useAIInsights';
import { accountsApi } from '@/api/endpoints/accounts.api';
import { transactionsApi } from '@/api/endpoints/transactions.api';
import { AccountSummarySection } from '@/components/account-detail/AccountSummarySection';
import type {
  Transaction,
  Account,
} from '@/types/model.types';


export const AccountDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { categories, transactionTypes } = useSelector((state: RootState) => state.appData);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');


  const { insights, loading: insightsLoading } = useAIInsights({ pageType: 'accounts' });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      setIsError(false);
      try {
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
          type: filterType !== 'all' ? filterType : 'Yok',
          period: filterPeriod !== 'all' ? filterPeriod : 'Yok'
        });
        console.log('API Parametreleri:', filters);

        const [accountData, transactionsData, allAccountsData] = await Promise.all([
          accountsApi.getById(id),
          transactionsApi.getByAccountId(id, Object.keys(filters).length > 0 ? filters : undefined),
          accountsApi.getAll()
        ]);

        console.log('Request successful. Number of transactions received:', transactionsData.length);

        setAccount(accountData);
        setTransactions(transactionsData);
        setAccounts(allAccountsData.accounts);
      } catch (err) {
        console.error('Request failed:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, filterCategory, filterType, filterPeriod]);


  const filteredTransactions = transactions;

  if (!account && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="lg:ml-64">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16 lg:pt-12">
            <div className="text-center text-white text-xl">Loading account details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!account || isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="lg:ml-64">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16 lg:pt-12">
            <div className="text-center">
              <p className="text-red-400 text-xl mb-4">Failed to load account</p>
              <Link to="/accounts" className="text-primary-400 hover:text-primary-300">
                ← Back to Accounts
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const typeLabel = account.accountType.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                to="/accounts"
                className="text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors"
              >
                ← Back to Accounts
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">{account.name}</h1>
              <p className="text-sm sm:text-base text-gray-400">View your account balance and all transactions.</p>
            </div>
          </div>

          <AccountSummarySection
            account={account}
            typeLabel={typeLabel}
            transactionCount={transactions.length}
            isLoading={isLoading}
            isError={isError}
            showDemoNotice={false}
            onAddTransaction={() => setShowAddModal(true)}
            onEditAccount={() => setShowEditModal(true)}
            onDeleteAccount={async () => {
              try {
                const result = await accountsApi.delete(account.id);
                if (result.isSuccess) {
                  setToast({ message: 'Account deleted successfully', type: 'success' });
                  setTimeout(() => window.location.href = '/accounts', 1500);
                } else {
                  setToast({ message: 'Failed to delete account', type: 'error' });
                }
              } catch (error) {
                console.error('Delete error:', error);
                setToast({ message: 'Failed to delete account', type: 'error' });
              }
            }}
            transactions={transactions}
            accounts={accounts}
            onShowToast={(message, type) => setToast({ message, type })}
          />


          <div className="mb-8">
            <AIInsightsSection insights={insights} loading={insightsLoading} />
          </div>

          <TransactionFilters
            filterPeriod={filterPeriod}
            setFilterPeriod={setFilterPeriod}
            filterType={filterType}
            setFilterType={setFilterType}
            filterAccount="all"
            setFilterAccount={() => { }}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            accounts={accounts}
            categories={categories}
            hideAccountFilter={true}
            onClearFilters={() => {
              setFilterType('all');
              setFilterCategory('all');
              setFilterPeriod('all');
            }}
          />




          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <TransactionTable
              transactions={filteredTransactions}
              isLoading={isLoading}
              accounts={accounts}
              hasFilters={
                filterType !== 'all' ||
                filterCategory !== 'all' ||
                filterPeriod !== 'all'
              }
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
                setShowEditTransactionModal(true);
              }}
              onDelete={async (transactionId) => {
                try {
                  const result = await transactionsApi.delete(transactionId);
                  console.log('Delete result:', result);
                  if (result.isSuccess) {
                    const updatedTransactions = await transactionsApi.getByAccountId(id!);
                    setTransactions(updatedTransactions);
                  }
                } catch (error) {
                  console.error('Delete error:', error);
                  throw error;
                }
              }}
              onShowToast={(message, type) => setToast({ message, type })}
            />
          </div>


        </div>

        <Footer />
      </main>


      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        accounts={[{ id: account.id, name: account.name }]}
        categories={categories}
        defaultAccountId={account.id}
        onSuccess={async () => {

          try {
            const updatedTransactions = await transactionsApi.getByAccountId(id!);
            setTransactions(updatedTransactions);
          } catch (error) {
            console.error('Failed to reload transactions:', error);
          }
        }}
        onShowToast={(message, type) => setToast({ message, type })}
      />

      <EditAccountModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        account={account}
        onSubmit={async (updateData) => {
          try {
            const result = await accountsApi.update(account.id, updateData);
            if (result.isSuccess) {
              // Hesap bilgilerini yenile
              const updatedAccount = await accountsApi.getById(account.id);
              setAccount(updatedAccount);
              return true;
            }
            return false;
          } catch (error) {
            console.error('Failed to update account:', error);
            return false;
          }
        }}
        onShowToast={(message, type) => setToast({ message, type })}
      />

      <EditTransactionModal
        isOpen={showEditTransactionModal}
        onClose={() => {
          setShowEditTransactionModal(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction as any}
        categories={categories}
        onSuccess={async () => {
          try {
            const updatedTransactions = await transactionsApi.getByAccountId(id!);
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
