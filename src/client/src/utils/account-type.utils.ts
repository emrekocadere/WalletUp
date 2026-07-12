import { AccountType } from '@/types/model.types';

export const accountTypeMeta: Record<
  AccountType,
  { label: string; tone: string }
> = {
  [AccountType.Cash]: {
    label: 'Cash',
    tone: 'from-amber-400/30 to-amber-500/30',
  },
  [AccountType.BankAccount]: {
    label: 'Bank Account',
    tone: 'from-sky-400/30 to-sky-500/30',
  },
  [AccountType.CreditCard]: {
    label: 'Credit Card',
    tone: 'from-rose-400/30 to-rose-500/30',
  },
  [AccountType.Savings]: {
    label: 'Savings Account',
    tone: 'from-emerald-400/30 to-emerald-500/30',
  },
};

export const getAccountTypeLabel = (type: AccountType) => accountTypeMeta[type]?.label ?? type;
