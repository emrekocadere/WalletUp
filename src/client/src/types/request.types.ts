export interface CreateTransactionRequest {
    amount: number;
    description: string;
    transactionTypeId: string;
    date: string;
    categoryId: string;
    accountId: string;
    title: string;
}

export interface CreateGoalRequest {
    Title: string;
    Target: number;
    Description: string;
    CurrencyId: string;
}

export interface UpdateGoalRequest {
    Name: string;
    Target: number;
    Description: string;
}

export interface AddTransactionToGoalRequest {
    amount: number;
    transactionTypeId: string;
}



