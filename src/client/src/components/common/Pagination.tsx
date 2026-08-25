import { useTranslation } from 'react-i18next';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, totalCount, pageSize, onPageChange }: PaginationProps) => {
  const { t } = useTranslation();

  if (totalCount === 0) {
    return null;
  }

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-700/50">
      <p className="text-sm text-gray-400">
        {t('pagination.range', { start: rangeStart, end: rangeEnd, total: totalCount })}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
          >
            {t('pagination.previous')}
          </button>

          {pageNumbers.map((n, idx) => {
            const prev = pageNumbers[idx - 1];
            const showEllipsis = prev !== undefined && n - prev > 1;
            return (
              <span key={n} className="flex items-center">
                {showEllipsis && <span className="px-1.5 text-gray-500">…</span>}
                <button
                  onClick={() => onPageChange(n)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                    n === page
                      ? 'bg-violet-500 text-white font-semibold'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {n}
                </button>
              </span>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
          >
            {t('pagination.next')}
          </button>
        </div>
      )}
    </div>
  );
};
