import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Transaction } from '@/types/model.types';
import { DropdownMenu } from '@/components/common/DropdownMenu';

interface TransactionRowActionsProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionRowActions = ({ transaction, onEdit, onDelete }: TransactionRowActionsProps) => {
  const { t } = useTranslation('transactions');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      menuItems={[
        {
          label: t('rowActions.edit'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
          onClick: () => {
            onEdit(transaction);
            setIsOpen(false);
          },
        },
        {
          label: t('rowActions.delete'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          ),
          onClick: () => {
            onDelete(transaction);
            setIsOpen(false);
          },
          variant: 'danger',
        },
      ]}
    />
  );
};
