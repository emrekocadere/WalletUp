import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { PageLoader } from '@/components/common/PageLoader';
import { reportsApi } from '@/api/endpoints/reports.api';
import { MonthlyBarChart } from '@/components/reports/MonthlyBarChart';
import { NetSavingsLineChart } from '@/components/reports/NetSavingsLineChart';
import { CategoryDoughnutChart } from '@/components/reports/CategoryDoughnutChart';
import type { MonthlyReport, CategoryExpense } from '@/types/model.types';
import { getCurrencySymbol } from '@/utils/formatters';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface SummaryCardProps {
  title: string;
  value: string;
  subtext?: string;
  variant: 'green' | 'red' | 'indigo' | 'amber';
  icon: React.ReactNode;
}

const VARIANT_STYLES = {
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',  icon: 'bg-green-500/20'  },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400',    icon: 'bg-red-500/20'    },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', icon: 'bg-indigo-500/20' },
  amber:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  icon: 'bg-amber-500/20'  },
};

const SummaryCard = ({ title, value, subtext, variant, icon }: SummaryCardProps) => {
  const s = VARIANT_STYLES[variant];
  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-400 mb-1">{title}</p>
          <p className={`text-base sm:text-xl font-bold ${s.text} truncate`}>{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-0.5">{subtext}</p>}
        </div>
        <div className={`${s.icon} p-2 rounded-lg flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const ReportsPage = () => {
  const currentMonthIndex = new Date().getMonth(); // 0-based
  const year = new Date().getFullYear();
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const report = await reportsApi.getAnnualReport(year);
        setMonthlyData([...report.months].sort((a, b) => a.month - b.month));
        setCurrency(report.preferredCurrency);
      } catch (err) {
        console.error('Failed to fetch report data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year]);

  const incomeData  = monthlyData.map(d => d?.income ?? 0);
  const expenseData = monthlyData.map(d => d?.expense ?? 0);
  const netData     = monthlyData.map(d => (d ? d.income - d.expense : 0));

  const totalIncome   = incomeData.reduce((a, b) => a + b, 0);
  const totalExpense  = expenseData.reduce((a, b) => a + b, 0);
  const netSavings    = totalIncome - totalExpense;
  const avgMonthly    = netData.reduce((a, b) => a + b, 0) / 12;

  const currSymbol         = getCurrencySymbol(currency);
  const selectedData       = monthlyData[selectedMonth];
  const categoryExpenses: CategoryExpense[] = selectedData?.categoryExpenses ?? [];
  const topCategories      = [...categoryExpenses].sort((a, b) => b.amount - a.amount).slice(0, 6);

  const fmt = (n: number) =>
    `${currSymbol}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (isLoading) return <PageLoader message="Loading reports..." />;

  return (
    <div className="min-h-screen bg-[#0d1224]">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">

          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">Reports</h1>
            <p className="text-sm sm:text-base text-gray-400">Annual financial overview for {new Date().getFullYear()}</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <SummaryCard
              title="Total Income"
              value={fmt(totalIncome)}
              variant="green"
              icon={
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              }
            />
            <SummaryCard
              title="Total Expenses"
              value={fmt(totalExpense)}
              variant="red"
              icon={
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              }
            />
            <SummaryCard
              title="Net Savings"
              value={fmt(netSavings)}
              subtext={totalIncome > 0 ? `${((netSavings / totalIncome) * 100).toFixed(1)}% of income` : undefined}
              variant={netSavings >= 0 ? 'indigo' : 'red'}
              icon={
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <SummaryCard
              title="Avg. Monthly"
              value={fmt(avgMonthly)}
              subtext="net savings"
              variant="amber"
              icon={
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          {/* Monthly Bar Chart */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
            <h2 className="text-base font-semibold text-white mb-5">Monthly Income vs Expenses</h2>
            <div className="h-64 sm:h-80">
              <MonthlyBarChart incomeData={incomeData} expenseData={expenseData} currency={currSymbol} />
            </div>
          </div>

          {/* Net Savings Line Chart */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
            <h2 className="text-base font-semibold text-white mb-5">Net Savings Trend</h2>
            <div className="h-56 sm:h-72">
              <NetSavingsLineChart netData={netData} currency={currSymbol} />
            </div>
          </div>

          {/* Category breakdown + top categories list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Doughnut chart */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-5 gap-3">
                <h2 className="text-base font-semibold text-white">Spending by Category</h2>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                  className="text-sm bg-slate-700 border border-slate-600 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="h-64">
                <CategoryDoughnutChart categories={categoryExpenses} currency={currSymbol} />
              </div>
            </div>

            {/* Top categories ranked list */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-base font-semibold text-white mb-5">
                Top Categories — <span className="text-slate-400 font-normal">{MONTHS[selectedMonth]}</span>
              </h2>

              {topCategories.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-slate-500 text-sm">No spending data for this month</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topCategories.map((cat, i) => (
                    <div key={cat.categoryId} className="flex items-center gap-3">
                      <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-400">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-sm font-medium text-slate-200 truncate">{cat.categoryName}</span>
                          <span className="text-sm text-slate-300 ml-2 flex-shrink-0 font-medium">
                            {fmt(cat.amount)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0 w-10 text-right">
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
        <Footer />
      </main>
    </div>
  );
};
