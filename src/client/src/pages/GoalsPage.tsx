import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { GoalStatsCards } from '@/components/goals/GoalStatsCards';
import { GoalCard } from '@/components/goals/GoalCard';
import { EmptyGoalsState } from '@/components/goals/EmptyGoalsState';
import { AddGoalModal } from '@/components/goals/AddGoalModal';
import { EditGoalModal } from '@/components/goals/EditGoalModal';
import { AddMoneyModal } from '@/components/goals/AddMoneyModal';
import { Toast } from '@/components/common/Toast';
import { AIInsightsSection } from '@/components/common/AIInsightsSection';
import { useAIInsights } from '@/hooks/useAIInsights';
import { accountsApi } from '@/api/endpoints/accounts.api';
import { goalsApi } from '@/api/endpoints/goals.api';
import type { Goal } from '@/types/model.types';

export const GoalsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [accounts, setAccounts] = useState<Array<{ id: string; name: string }>>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const { insights, loading: insightsLoading } = useAIInsights({
    pageType: 'goals',
    taskName: 'goal_planning'
  });

  useEffect(() => {
    loadAccounts();
    loadGoals();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await accountsApi.getAll();
      setAccounts(data.map(acc => ({ id: acc.id!, name: acc.name })));
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const result = await goalsApi.GetAll();
      if (result.isSuccess && result.value) {
        setGoals(result.value);
      } else {
        console.error('Failed to load goals:', result.error);
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMoney = (goalId: string) => {
    console.log('Finding goal with ID:', goalId);
    console.log('Available goals:', goals);
    const goal = goals.find(g => g.id === goalId);
    console.log('Found goal:', goal);
    if (goal) {
      setSelectedGoal(goal);
      setShowAddMoneyModal(true);
    } else {
      console.error('Goal not found for ID:', goalId);
    }
  };

  const handleEditGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setEditingGoal(goal);
      setShowEditModal(true);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const result = await goalsApi.delete(goalId);
      if (result.isSuccess) {
        setToast({ message: 'Goal deleted successfully', type: 'success' });
        loadGoals();
      } else {
        setToast({ message: result.error || 'Failed to delete goal', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
      setToast({ message: 'Failed to delete goal. Please try again.', type: 'error' });
    }
  };

  const handleGoalCreated = () => {
    console.log('Goal created successfully');
    loadGoals();
  };

  const handleMoneyAdded = () => {
    loadGoals();
  };


  const goalsForStats = goals.map(goal => ({
    targetAmount: goal.target,
    currentAmount: goal.currentAmount || 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Financial Goals</h1>
              <p className="text-sm sm:text-base text-gray-400 mt-2">Track your savings goals and stay motivated</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-indigo-500/30 border border-transparent hover:border-indigo-400/30"
            >
              Add New Goal
            </button>
          </div>

          <GoalStatsCards goals={goalsForStats} />

          {/* AI Insights Section */}
          <div className="mb-6 lg:mb-8">
            <AIInsightsSection insights={insights} loading={insightsLoading} />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <EmptyGoalsState onCreateGoal={() => setShowAddModal(true)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddMoney={handleAddMoney}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleGoalCreated}
        onShowToast={(message, type) => setToast({ message, type })}
        accounts={accounts}
      />

      {/* Edit Goal Modal */}
      <EditGoalModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
        onSuccess={handleGoalCreated}
        onShowToast={(message, type) => setToast({ message, type })}
      />

      {/* Add Money Modal */}
      <AddMoneyModal
        isOpen={showAddMoneyModal}
        onClose={() => setShowAddMoneyModal(false)}
        goal={selectedGoal}
        onSuccess={handleMoneyAdded}
      />

      {/* Toast Notification */}
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