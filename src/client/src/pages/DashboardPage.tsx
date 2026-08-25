import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store/store';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { transactionsApi } from '@/api/endpoints/transactions.api';
import { RecentTransactionsPanel } from '@/components/dashboard/RecentTransactionsPanel';
import { StatCard } from '@/components/dashboard/StatCard';
import { SpendingByCategoryPanel } from '@/components/dashboard/SpendingByCategoryPanel';
import { authService } from '@/services/auth.service';
import { AIInsightsSection } from '@/components/common/AIInsightsSection';
import { useAIInsights } from '@/hooks/useAIInsights';
import { getCurrencySymbol, formatNumber } from '@/utils/formatters';
import type { Transaction, CategoryExpense } from '@/types/model.types';
import { PageLoader } from '@/components/common/PageLoader';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [goalQuantity, setGoalQuantity] = useState(0);
  const [currentTotalBalance, setCurrentTotalBalance] = useState(0);
  const [preferredCurrency, setPreferredCurrency] = useState('USD');


  const { insights, loading: insightsLoading, error: insightsError } = useAIInsights({
    pageType: 'dashboard',
    taskName: 'monthly_report'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const currentMonth = new Date().getMonth() + 1;


        if (accessToken) {

          const name = authService.getUserNameFromToken(accessToken);

          setUserName(name);
        }


        const [transactionsResult, dashboardResult] = await Promise.all([
          transactionsApi.getAll(),
          transactionsApi.getDashboard(currentMonth),
        ]);

        setTransactions(transactionsResult);
        setMonthlySpending(dashboardResult.expense);
        setMonthlyIncome(dashboardResult.income);
        setTransactionCount(dashboardResult.quantity);
        setCategoryExpenses(dashboardResult.categoryExpenses || []);
        setGoalQuantity(dashboardResult.goalQuantity);
        setCurrentTotalBalance(dashboardResult.currentTotalBalance);
        setPreferredCurrency(dashboardResult.preferredCurrency);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [accessToken]);


  const categoryData = categoryExpenses.map((cat, index) => {
    const gradients = [
      'from-orange-500 to-orange-400',
      'from-blue-500 to-blue-400',
      'from-cyan-500 to-cyan-400',
      'from-yellow-500 to-yellow-400',
      'from-primary-500 to-primary-400',
      'from-primary-500 to-primary-400',
      'from-green-500 to-green-400',
      'from-red-500 to-red-400',
    ];
    return {
      name: cat.categoryName,
      percentage: cat.percentage,
      gradient: gradients[index % gradients.length],
    };
  });
  
  if (isLoading) {
    return <PageLoader message={t('dashboard.loading')} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1224]">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">
          <div className="mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
              {t('dashboard.welcomeBack', { name: userName || t('dashboard.defaultUser') })}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">{t('dashboard.subtitle')}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 lg:mb-12">
            <StatCard
              title={t('dashboard.totalBalance')}
              value={`${getCurrencySymbol(preferredCurrency)}${formatNumber(currentTotalBalance, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle={t('dashboard.totalBalanceSubtitle')}
              iconBgColor="bg-violet-500/20"
              iconColor="text-violet-400"
              borderHoverColor="violet-500/50"
              subtitleColor="text-green-400"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <StatCard
              title={t('dashboard.monthlySpending')}
              value={`${getCurrencySymbol(preferredCurrency)}${formatNumber(monthlySpending, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle={monthlyIncome > 0 ? t('dashboard.percentOfIncome', { percent: ((monthlySpending / monthlyIncome) * 100).toFixed(1) }) : t('dashboard.noIncome')}
              iconBgColor="bg-red-500/20"
              iconColor="text-red-400"
              borderHoverColor="red-500/50"
              subtitleColor="text-red-400"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            <StatCard
              title={t('dashboard.goals')}
              value={goalQuantity.toString()}
              subtitle={goalQuantity === 1 ? t('dashboard.activeGoal') : t('dashboard.activeGoals')}
              iconBgColor="bg-violet-500/20"
              iconColor="text-violet-400"
              borderHoverColor="violet-500/50"
              subtitleColor="text-violet-400"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
            />

            <StatCard
              title={t('dashboard.transactions')}
              value={transactionCount.toString()}
              subtitle={t('dashboard.thisMonth')}
              iconBgColor="bg-violet-500/20"
              iconColor="text-violet-400"
              borderHoverColor="violet-500/50"
              subtitleColor="text-violet-400"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* AI Insights Section */}
          <div className="mb-6 lg:mb-8">
            <AIInsightsSection
              insights={insights}
              loading={insightsLoading}
              error={insightsError}
              emptyMessage={t('dashboard.aiInsightsEmpty')}
            />
          </div>

          {/* Recent Transactions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-slate-800/50 p-4 sm:p-6 lg:p-8 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{t('dashboard.recentTransactions')}</h2>
                <Link to="/transactions" className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
                  {t('dashboard.viewAll')}
                </Link>
              </div>

              <RecentTransactionsPanel transactions={transactions} isLoading={isLoading} currency={preferredCurrency} />
            </div>

            {/* Spending by Category */}
            <SpendingByCategoryPanel categories={categoryData} />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};
