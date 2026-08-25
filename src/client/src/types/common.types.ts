
export interface Error {
    id: string;
    description: string;
}

export interface Result {
    isSuccess: boolean;
    error: Error | null;
}

export interface ResultT<T> extends Result {
    value?: T;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

export interface Currency {
  id: string;
  iso4217Code: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
