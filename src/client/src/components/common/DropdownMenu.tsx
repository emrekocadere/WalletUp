import { useState, useRef, useEffect } from 'react';

interface DropdownMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  items?: DropdownMenuItem[];
  menuItems?: DropdownMenuItem[];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const DropdownMenu = ({ items, menuItems, isOpen: controlledIsOpen, onOpenChange }: DropdownMenuProps) => {
  const finalMenuItems = menuItems || items || [];
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
          {finalMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (onOpenChange) {
                  onOpenChange(false);
                } else {
                  setInternalIsOpen(false);
                }
                item.onClick();
              }}
              className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                item.variant === 'danger'
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
