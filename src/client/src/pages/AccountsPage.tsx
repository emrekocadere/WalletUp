import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { PageLoader } from '@/components/common/PageLoader';
import { accountsApi } from '@/api/endpoints/accounts.api';
import { AccountsHeroStats } from '@/components/accounts/AccountsHeroStats';
import { AccountListSection } from '@/components/accounts/AccountListSection';
import { AddAccountModal } from '@/components/accounts/AddAccountModal';
import { AIInsightsSection } from '@/components/common/AIInsightsSection';
import { useAIInsights } from '@/hooks/useAIInsights';
import type { Account } from '@/types/model.types';

export const AccountsPage = () => {
  const { t } = useTranslation('accounts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [preferredCurrency, setPreferredCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const { insights, loading: insightsLoading } = useAIInsights({ pageType: 'accounts' });

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);

      try {
        const result = await accountsApi.getAll();
        setAccounts(result.accounts);
        setTotalBalance(result.totalBalanceBasedOnPreferredCurrency);
        setPreferredCurrency(result.preferredCurrency);
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (isLoading) {
    return <PageLoader message={t('accountsPage.loading')} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1224]">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12 space-y-6 lg:space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{t('accountsPage.title')}</h1>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                {t('accountsPage.subtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-colors"
            >
              {t('accountsPage.addAccount')}
            </button>
          </div>

          <AccountsHeroStats
            totalBalance={totalBalance}
            totalAccounts={accounts.length}
            preferredCurrency={preferredCurrency}
          />

          {/* AI Insights Section */}
          <div className="mb-6 lg:mb-8">
            <AIInsightsSection insights={insights} loading={insightsLoading} />
          </div>

          <AccountListSection accounts={accounts} isLoading={isLoading} currencies={{}} />
        </div>

        <Footer />
      </main>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (accountData) => {
          try {
            const result = await accountsApi.create(accountData);

            if (result.isSuccess) {

              const updatedAccounts = await accountsApi.getAll();
              setAccounts(updatedAccounts.accounts);
              setTotalBalance(updatedAccounts.totalBalanceBasedOnPreferredCurrency);
              setPreferredCurrency(updatedAccounts.preferredCurrency);
              return true;
            }
            return false;
          } catch (err) {
            console.error('Failed to create account:', err);
            return false;
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