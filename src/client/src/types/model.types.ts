export interface Account {
  id: string;
  name: string;
  accountType: AccountTypeInfo;
  balance: number;
  currency: Currency;
  createdAt: string;
}

export enum AccountType {
  Cash = 'Cash',
  BankAccount = 'BankAccount',
  CreditCard = 'CreditCard',
  Savings = 'Savings',
}

export interface AccountTypeInfo {
  id: string;
  name: string;
}


export interface TransactionType {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: TransactionType;
  createdAt: string;
}

export interface Transaction {
  id?: string;
  amount: number;
  title?: string;
  description?: string;
  category?: Category;
  accountId?: string;
  account?: Account;
  transactionType?: TransactionType;
  date?: string;
}


export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: TransactionType;
  createdAt: string;
}

export interface Currency {
  id: string;
  iso4217Code: string;
  code?: string;
  name?: string;
  symbol?: string;
}

export interface Country {
  id: string;
  name: string;
}


export interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface TransactionDashboard {
  income: number;
  expense: number;
  quantity: number;
  goalQuantity: number;
  currentTotalBalance: number;
  categoryExpenses: CategoryExpense[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  currentAmount: number;
  targetPercent: number;
  creationTime: string;
  currency: Currency;
}

export interface AIPreferences {
  enabled: boolean;
  [key: string]: any;
}

